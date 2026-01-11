import random
SUPERVISORS = [
    {
        "id": i,
        "name": f"Prof {i}",
        "min_cap": 1 if i % 7 == 0 else 2,
        "max_cap": 2 if i % 7 == 0 else 3
    }
    for i in range(1, 33)
]


STUDENTS = []

for i in range(1, 76):
    student = {
        "id": i,
        "cgpa": round(random.uniform(7.5, 9.5), 2),
        "gate": random.randint(450, 750),
        "prefs": random.sample(range(1, 33), 8)
    }
    STUDENTS.append(student)
