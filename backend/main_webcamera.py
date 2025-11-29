import cv2
import mediapipe as mp
import numpy as np
from collections import deque
from mediapipe.python.solutions.drawing_utils import DrawingSpec
import time
import json
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True)
mp_drawing = mp.solutions.drawing_utils

LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

# Track scores for smoothing
score_history = deque(maxlen=10)
distraction = 0

def eye_aspect_ratio(landmarks, eye_points, image_w, image_h):
    points = []
    for idx in eye_points:
        lm = landmarks[idx]
        x, y = int(lm.x * image_w), int(lm.y * image_h)
        cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)
        points.append((x, y))
    A = np.linalg.norm(np.array(points[1]) - np.array(points[5]))
    B = np.linalg.norm(np.array(points[2]) - np.array(points[4]))
    C = np.linalg.norm(np.array(points[0]) - np.array(points[3]))
    ear = (A + B) / (2.0 * C)
    return ear

def is_blinking(ear, threshold=0.2):
    return ear < threshold

# ✅ MODIFIED: Continuous head pose score (0.0 to 1.0)
def get_head_pose_score(landmarks, image_w, image_h):
    nose = landmarks[1]
    x, y = nose.x * image_w, nose.y * image_h
    center_x, center_y = image_w / 2, image_h / 2
    dx = abs(x - center_x)
    dy = abs(y - center_y)
    max_dx = 0.4 * image_w
    max_dy = 0.4 * image_h
    score_x = max(0.0, 1.0 - dx / max_dx)
    score_y = max(0.0, 1.0 - dy / max_dy)
    score = (score_x + score_y) / 2
    return round(score, 2)

# ✅ MODIFIED: Continuous gaze score (0.0 to 1.0)
def get_gaze_score(landmarks, image_w, image_h):
    left_iris = landmarks[468]
    right_iris = landmarks[473]
    avg_x = (left_iris.x + right_iris.x) / 2.0
    center = 0.5
    deviation = abs(avg_x - center)
    max_dev = 0.25
    score = max(0.0, 1.0 - deviation / max_dev)
    return round(score, 2)

def compute_concentration_score(gaze, head_pose, blink):
    score = 0.4 * gaze + 0.4 * head_pose + 0.2 * (0 if blink else 1)
    return round(score * 100, 2)

def draw_concentration_bar(score, frame):
    bar_width = 200
    bar_height = 30
    bar_x = 30
    bar_y = 100

    cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (50, 50, 50), -1)
    fill_width = int(score * bar_width / 100)
    color = (0, 255, 0) if score > 40 else (0, 100, 255)
    cv2.rectangle(frame, (bar_x, bar_y), (bar_x + fill_width, bar_y + bar_height), color, -1)
    cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), (200, 200, 200), 2)
    cv2.putText(frame, f"{score}%", (bar_x + bar_width + 10, bar_y + bar_height // 2 + 5),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)

# Start webcam
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    time.sleep(1)
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    ui_bg = frame.copy()
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image_h, image_w, _ = frame.shape
    results = face_mesh.process(frame_rgb)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            mp_drawing.draw_landmarks(
                frame, face_landmarks, mp_face_mesh.FACEMESH_CONTOURS,
                landmark_drawing_spec=DrawingSpec(color=(0, 200, 0), thickness=1, circle_radius=1),
                connection_drawing_spec=DrawingSpec(color=(0, 150, 255), thickness=1)
            )

            landmarks = face_landmarks.landmark
            left_ear = eye_aspect_ratio(landmarks, LEFT_EYE, image_w, image_h)
            right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE, image_w, image_h)
            avg_ear = (left_ear + right_ear) / 2
            blink = is_blinking(avg_ear)

            gaze_score = get_gaze_score(landmarks, image_w, image_h)
            head_score = get_head_pose_score(landmarks, image_w, image_h)
            concentration = compute_concentration_score(gaze_score, head_score, blink)

            score_history.append(concentration)
            smooth_score = int(np.mean(score_history))
            print(smooth_score)

            if smooth_score < 60:
                distraction +=1
            else :
                distraction = 0


            if distraction >= 36:
                blink_counter += 1
            else:
                blink_counter = 0

            state = {
                "eye": blink_counter,
                "timestamp": int(time.time())
            }

            # Save to JSON file
            with open("state_eye.json", "w") as f:
                json.dump(state, f, indent=4)



cap.release()
cv2.destroyAllWindows()
