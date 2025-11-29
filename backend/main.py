"""EEG measurement example

Example how to get measurements using brainaccess library

Change Bluetooth device name to your device name (line 68)
"""
import numpy as np
import json
import pandas as pd
import time
import threading
from scipy.signal import butter, filtfilt, welch, sosfiltfilt
from brainaccess import core
from brainaccess.core.eeg_manager import EEGManager
import brainaccess.core.eeg_channel as eeg_channel
from brainaccess.core.gain_mode import (
    GainMode,
)


def bandpass_filter(data, low, high, fs, order=4):
    nyq = 0.5 * fs
    low_cut = low / nyq
    high_cut = high / nyq
    b, a = butter(order, [low_cut, high_cut], btype='band')
    y = filtfilt(b, a, data)
    return y

def calculate_coeff_for_waves(df):
    eeg_channels = ['F3', 'F4', 'C3', 'C4', 'P3', 'P4', 'O1', 'O2']
    fs = 250  # sampling frequency in Hz

    # Ensure numeric values
    for ch in eeg_channels:
        df[ch] = pd.to_numeric(df[ch], errors='coerce')
    df = df.dropna(subset=eeg_channels)

    bands = {
        'delta': (0.5, 4),
        'theta': (4, 8),
        'alpha': (8, 13),
        'beta': (13, 30),
        'gamma': (30, 45)
    }

    metrics = []
    filtered_waves = {}

    for ch in eeg_channels:
        data = df[ch].values

        # Filter waves for each band
        filtered_waves[ch] = {}
        for band, (low, high) in bands.items():
            filtered_waves[ch][band] = bandpass_filter(data, low, high, fs)

        # Compute power per band using Welch
        band_power = {}
        f, Pxx = welch(data, fs=fs, nperseg=fs * 2)
        for band, (low, high) in bands.items():
            ix = np.logical_and(f >= low, f <= high)
            band_power[band] = np.sum(Pxx[ix])

        total_power = sum(band_power.values())
        beta = band_power['beta']
        theta = band_power['theta']
        alpha = band_power['alpha']

        metrics.append({
            'Channel': ch,
            'beta/theta': beta / theta if theta != 0 else np.nan,
            'beta/alpha': beta / alpha if alpha != 0 else np.nan,
            'total_power': total_power,
            'alpha/total_power': alpha / total_power if total_power != 0 else np.nan,
            'beta>20Hz': 1 if beta > 20 else 0
        })

    # Convert metrics to a DataFrame
    metrics_df = pd.DataFrame(metrics)
    #print(metrics_df)
    return metrics_df

def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

def classify_four_feature(NOW, RELAX, FOCUS):
    score_RELAX = 0
    score_FOCUS = 0

    for name in ["F3_beta_theta", "F4_beta_theta", "C3_beta_alpha", "C4_beta_alpha"]:
        if euclidean_distance(RELAX[name], NOW[name]) < euclidean_distance(FOCUS[name], NOW[name]):
            score_RELAX +=1
        else:
            score_FOCUS +=1

    if FOCUS["F3_beta_gt_20Hz"] ==1:
        score_FOCUS +=1
    else:
        score_RELAX +=1
    if FOCUS["F4_beta_gt_20Hz"] ==1:
        score_FOCUS +=1
    else:
        score_RELAX +=1

    if score_FOCUS > 3 & score_RELAX < 3: return 1 # Skupienie
    elif score_RELAX > 3 & score_FOCUS < 3: return -1
    else : return 0

def extract_coefficient_to_vector(df):
    results = {
        "F3_beta_theta": df["beta/theta"][0],
        "F4_beta_theta": df["beta/theta"][1],
        "C3_beta_alpha": df["beta/alpha"][2],
        "C4_beta_alpha": df["beta/alpha"][3],
        "F3_beta_gt_20Hz": df["beta>20Hz"][0],
        "F4_beta_gt_20Hz": df["beta>20Hz"][1],
        "O1_alpha_total": df["alpha/total_power"][6],
        "O2_alpha_total": df["alpha/total_power"][7],
        "P3_alpha_total": df["alpha/total_power"][4],
        "P4_alpha_total": df["alpha/total_power"][5]
    }
    return results

def butter_bandpass(
    lowcut: float, highcut: float, fs: int, order: int = 2
) -> np.ndarray:
    """Design a bandpass Butterworth filter."""
    nyq = 0.5 * fs
    low = lowcut / nyq
    high = highcut / nyq
    sos = butter(order, [low, high], analog=False, btype="bandpass", output="sos")
    return sos


def butter_bandpass_filter(
    data: np.ndarray, lowcut: float, highcut: float, fs: int, order: int = 2
) -> np.ndarray:
    """Apply a bandpass Butterworth filter to the data."""
    sos = butter_bandpass(lowcut, highcut, fs, order=order)
    y = sosfiltfilt(sos, data)
    return y


def _acq_closure(ch_number: int = 1, buffer_length: int = 1000) -> tuple:
    """Acquisition callback closure."""
    data = np.zeros((ch_number, buffer_length))
    mutex = threading.Lock()

    def _acq_callback(chunk: list, chunk_size: int) -> None:
        nonlocal data
        nonlocal mutex
        with mutex:
            data = np.roll(data, -chunk_size)
            data[:, -chunk_size:] = chunk

    def get_data() -> np.ndarray:
        nonlocal data
        with mutex:
            return data.copy()

    return _acq_callback, get_data

cap: dict = {
 0: "F3",
 1: "F4",
 2: "C3",
 3: "C4",
 4: "P3",
 5: "P4",
 6: "O1",
 7: "O2",
}

focus_df = pd.read_csv("./calibration_data/focus_metrics_output.csv")
relax_df = pd.read_csv("./calibration_data/open_eyes_metrics_output.csv")
closed_eyes_df = pd.read_csv("./calibration_data/closed_eyes_metrics_output.csv")

FOCUS_coeff = extract_coefficient_to_vector(focus_df)
RELAX_coeff = extract_coefficient_to_vector(relax_df)
CLOSED_coeff = extract_coefficient_to_vector(closed_eyes_df)

save_name = f'data/{time.strftime("%Y%m%d_%H%M")}-raw.csv'

distraction_counter = 0

if __name__ == "__main__":
    # Change to your device name
    device_name = "BA MINI 033"
    # inits:
    core.init()
    devices = core.scan()
    print("Found devices:", len(devices))
    print(f"Devices: {[device.name for device in devices]}")

    with EEGManager() as mgr:
        print("Connecting to device:", device_name)
        _status = mgr.connect(device_name)
        is_registration = True
        if _status == 2:
            raise Exception("Stream is incompatible. Update the firmware.")
        elif _status > 0:
            raise Exception("Connection failed")

        device_features = mgr.get_device_features()
        eeg_channels_number = device_features.electrode_count()

        # set the channels
        ch_nr = 0
        for i in range(0, eeg_channels_number):
            mgr.set_channel_enabled(eeg_channel.ELECTRODE_MEASUREMENT + i, True)  # noqa
            ch_nr += 1
            mgr.set_channel_gain(
                eeg_channel.ELECTRODE_MEASUREMENT + i, GainMode.X8
            )  # noqa
        mgr.set_channel_bias(eeg_channel.ELECTRODE_MEASUREMENT + i, True)

        # Keep track of enabled eeg channel number
        eeg_enabled_nr = ch_nr

        # check if the device has accelerometer
        has_accel = device_features.has_accel()
        if has_accel:
            print("Setting the accelerometer")
            mgr.set_channel_enabled(eeg_channel.ACCELEROMETER, True)
            ch_nr += 1
            mgr.set_channel_enabled(eeg_channel.ACCELEROMETER + 1, True)
            ch_nr += 1
            mgr.set_channel_enabled(eeg_channel.ACCELEROMETER + 2, True)
            ch_nr += 1

        mgr.set_channel_enabled(eeg_channel.SAMPLE_NUMBER, True)
        ch_nr += 1

        mgr.set_channel_enabled(eeg_channel.STREAMING, True)
        ch_nr += 1

        # get the sample rate
        sr = mgr.get_sample_frequency()
        duration = 15
        buffer_time = int(sr * duration)  # seconds
        _acq_callback, get_data = _acq_closure(
            ch_number=ch_nr, buffer_length=buffer_time
        )
        mgr.set_callback_chunk(_acq_callback)
        mgr.load_config()

        # start the stream
        mgr.start_stream()
        print("Stream started")

        try:
            while True:  # infinite loop
                print("\n--- Recording 15 seconds ---")
                time.sleep(duration)

                dat = get_data()

                # Preprocess EEG
                eeg_data = dat[1: eeg_enabled_nr + 1, :]
                eeg_data = eeg_data - np.mean(eeg_data, axis=0)
                eeg_data = butter_bandpass_filter(eeg_data, 1, 40, sr)
                eeg_columns = []
                eeg_dict = {}

                for idx in range(eeg_enabled_nr):
                    channel_name = cap.get(idx, f"EEG_{idx + 1}")
                    eeg_columns.append(channel_name)
                    eeg_dict[channel_name] = eeg_data[idx, :]

                accel_dict = {}
                if has_accel:
                    accel_dict["Accel_X"] = dat[-4, :]
                    accel_dict["Accel_Y"] = dat[-3, :]
                    accel_dict["Accel_Z"] = dat[-2, :]

                misc_dict = {
                    "Sample_Number": dat[0, :],
                    "Stream_Flag": dat[-1, :],
                }

                df = pd.DataFrame({**eeg_dict, **accel_dict, **misc_dict})
                # compute coefficients:
                coeffs = calculate_coeff_for_waves(df)
                NOW_coeffs = extract_coefficient_to_vector(coeffs)
                # print(NOW_coeffs)

                focus_score = classify_four_feature(NOW_coeffs, RELAX_coeff, FOCUS_coeff)
                print(focus_score)

                if focus_score == -1:
                    distraction_counter += 1
                else :
                    distraction_counter = 0

                state = {
                    "eeg": focus_score,
                    "counter": distraction_counter,
                    "timestamp": int(time.time())
                }

                # Save to JSON file
                with open("state.json", "w") as f:
                    json.dump(state, f, indent=4)


                # # optional: save data
                # save_name = f"data/{time.strftime('%Y%m%d_%H%M%S')}_segment.csv"
                # df.to_csv(save_name, index=False)
                # print(f"Saved: {save_name}")

        except KeyboardInterrupt:
            print("Stopping continuous acquisition...")

        mgr.stop_stream()
        print("Stream stopped.")

    core.close()
    print("Disconnected and core closed.")



    # # plot the data
    # print("Plotting the data")
    # n_channels = eeg_enabled_nr
    # fig, axs = plt.subplots(n_channels, 1, figsize=(12, 2.5 * n_channels), sharex=True)
    #
    # if n_channels == 1:
    #     axs = [axs]  # ensure iterable if only one channel
    #
    # for ch in range(n_channels):
    #     axs[ch].plot(eeg_data[ch], linewidth=1)
    #     axs[ch].set_ylabel(f"Ch {ch + 1}")
    #     axs[ch].grid(True)
    #
    # axs[-1].set_xlabel("Samples")
    # plt.suptitle("Filtered EEG Channels (1–40 Hz)")
    # plt.tight_layout()
    # plt.show()
    #
    # eeg_columns = []
    # eeg_dict = {}
    #
    # for idx in range(eeg_enabled_nr):
    #     channel_name = cap.get(idx, f"EEG_{idx + 1}")  # fallback name if CAP missing
    #     eeg_columns.append(channel_name)
    #     eeg_dict[channel_name] = eeg_data[idx, :]
    #
    #
    # accel_dict = {}
    #
    # if has_accel:
    #     accel_dict["Accel_X"] = dat[-4, :]
    #     accel_dict["Accel_Y"] = dat[-3, :]
    #     accel_dict["Accel_Z"] = dat[-2, :]
    #
    # sample_number = dat[0, :]
    # stream_flag = dat[-1, :]
    #
    # misc_dict = {
    #     "Sample_Number": sample_number,
    #     "Stream_Flag": stream_flag,
    # }
    #
    # # -------------------------------
    # # FINAL MERGED DATAFRAME
    # # -------------------------------
    #
    # df = pd.DataFrame({**eeg_dict, **accel_dict, **misc_dict})
    #
    # coeffs = calculate_coeff_for_waves(df)
    # print(coeffs)
    #
    # # print(df.head())
    # # print(df.info())
    # #
    # # df.to_csv(save_name)
    #
