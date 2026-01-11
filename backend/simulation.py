import random
from collections import Counter

def run_simulation(students, supervisors, target_id, iterations=500):
    results = []

    for _ in range(iterations):

        # 1. Rank students with small randomness (uncertainty)
        ranked_students = sorted(
            students,
            key=lambda s: (
                s["cgpa"] + random.uniform(-0.01, 0.01),
                s["gate"] + random.uniform(-20, 20)
            ),
            reverse=True
        )

        # 2. Initialize supervisor capacities for this iteration
        capacity = {
            sup["id"]: random.randint(sup["min_cap"], sup["max_cap"])
            for sup in supervisors
        }

        # 3. Allocate supervisors greedily
        for stu in ranked_students:
            for pref in stu["prefs"]:
                if capacity[pref] > 0:
                    if stu["id"] == target_id:
                        results.append(pref)
                    capacity[pref] -= 1
                    break

    return results
