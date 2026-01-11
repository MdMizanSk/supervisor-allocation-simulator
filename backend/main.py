from fastapi import FastAPI
from pydantic import BaseModel
from collections import Counter
from simulation import run_simulation
from data import SUPERVISORS,STUDENTS
import math
from fastapi.middleware.cors import CORSMiddleware




print(run_simulation)
app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend from anywhere
    allow_methods=["*"],
    allow_headers=["*"],
)

def entropy(probabilities):
    return -sum(p * math.log2(p) for p in probabilities if p > 0)
@app.get("/")
def hello():
    return {"message": "Hello, World!"}

class studentInput(BaseModel):
    cgpa: float
    gate: int
    prefs: list[int]
    
@app.post("/simulate")
def simulate(student: studentInput):

    # 1. Create target student with a fixed ID
    target_id = 999
    student_data = {
        "id": target_id,
        "cgpa": student.cgpa,
        "gate": student.gate,
        "prefs": student.prefs
    }

    # 2. Combine with existing students
    all_students = STUDENTS + [student_data]

    # 3. Run Monte Carlo simulation
    results = run_simulation(
        all_students,
        SUPERVISORS,
        target_id=target_id,
        iterations=1000
    )

    # 4. Frequency → probability
    freq = Counter(results)
    total = sum(freq.values())

    probs = {k: v / total for k, v in freq.items()}

    # 5. Map supervisor IDs → names
    SUP_MAP = {s["id"]: s["name"] for s in SUPERVISORS}
    named_probs = {SUP_MAP[k]: round(v, 2) for k, v in probs.items()}

    # 6. Most likely supervisor
    most_likely = max(named_probs, key=named_probs.get)

    # 7. Risk via entropy
    ent = entropy(list(probs.values()))
    if ent < 0.8:
        risk = "Low"
    elif ent < 1.3:
        risk = "Medium"
    else:
        risk = "High"

    # 8. Explanation
    explanation = (
        "The allocation outcome varies due to small rank perturbations "
        "and limited supervisor capacities. Probabilities reflect "
        "how often each supervisor was assigned across simulations."
    )

    return {
        "most_likely": most_likely,
        "distribution": named_probs,
        "risk": risk,
        "explanation": explanation
    }
