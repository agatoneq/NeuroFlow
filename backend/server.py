from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = r"E:\NeuroFlow\backend\database"

STATE_PATH = os.path.join(BASE, "state.json")
STATE_EYE_PATH = os.path.join(BASE, "state_eye.json")

@app.get("/state")
def read_state():
    with open(STATE_PATH, "r") as f:
        return json.load(f)

@app.get("/state_eye")
def read_state_eye():
    with open(STATE_EYE_PATH, "r") as f:
        return json.load(f)
