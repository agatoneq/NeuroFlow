# NeuroFlow – Web & Desktop EEG Focus Assistant

## 🚀 Core Features

### 🔵 Real-time EEG Monitoring
- Live EEG reading from JSON files  
- FastAPI refresh every 1s  
- Focus state detection (`eeg = 1 / 0 / -1`)

### 👀 Eye-State Distraction Detection
- Eye open/closed tracking  
- Micro-interventions when distraction detected  
- Notifications triggered by `eye == 0`

### 🐱 Deep Intervention Mode
Triggered when:
Features:
- Fullscreen breathing animation (cat)  
- 60-second 4–4–4 breathing cycle  
- Pomodoro auto-pause  

### ⏱ EEG-Integrated Pomodoro
- Auto-pause when `eeg == -1`  
- Compact Electron widget  
- Real-time focus reactivity  

### 🌙 Chronotype Assistant
- Determines chronotype (owl/lark)  
- Suggests optimal working hours  

### 🎧 Spotify Integration
- OAuth login  
- Playlist & URI playback  
- Playback controls (play/pause/next)  
- Handles region-blocked playlists  

### 🔊 Ambient Sounds
- Built-in focus sound player  
- Looping ambient tracks  

### 🖥 Desktop Widget (Electron)
- Floating mini-window  
- Pomodoro + FocusBar  
- Lightweight notification system  

### 🔧 Data Flow
- EEG & eye state stored as JSON  
- FastAPI exposes `/state` and `/state_eye`  
- React polls every ~1s  
- UI reacts immediately (colors, pauses, interventions)
