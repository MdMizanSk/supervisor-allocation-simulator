export async function simulateAllocation(input) {
  const res = await fetch("http://127.0.0.1:8000/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return res.json();
}
