export async function simulateAllocation(input) {
  const res = await fetch("https://supervisor-allocation-api.onrender.com/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  return res.json();
}
