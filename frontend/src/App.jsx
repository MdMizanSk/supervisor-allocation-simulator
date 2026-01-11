import { useState } from "react";
import { simulateAllocation } from "./api";
import "./App.css";

function App() {
  const [cgpa, setCgpa] = useState("");
  const [gate, setGate] = useState("");
  const [prefs, setPrefs] = useState(Array(8).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);

  function updatePref(index, value) {
    const next = [...prefs];
    next[index] = value;
    setPrefs(next);
  }

  // 🔥 CONTINUOUS COLOR MAPPING
  // 🔟 DISCRETE 10-COLOR SCALE (RED → GREEN)
  const PROB_COLORS = [
    "#7f1d1d", // 0–9%   deep red
    "#b91c1c", // 10–19% red
    "#ea580c", // 20–29% orange-red
    "#f97316", // 30–39% orange
    "#f59e0b", // 40–49% yellow-orange
    "#eab308", // 50–59% yellow
    "#abf533", // 60–69% yellow-green
    "#4ade80", // 70–79% light green
    "#22c55e", // 80–89% green
    "#15803d"  // 90–100% strong green
  ];

  function getBarColor(prob) {
    const percent = Math.round(prob * 100);
    const index = Math.min(9, Math.floor(percent / 10));
    return PROB_COLORS[index];
  }


  async function runSimulation() {
    setLoading(true);

    const input = {
      cgpa: parseFloat(cgpa),
      gate: parseInt(gate),
      prefs: prefs.filter(p => p !== "").map(p => parseInt(p))
    };

    const data = await simulateAllocation(input);
    setResult(data);
    setShowNumbers(false);
    setLoading(false);
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Supervisor Allocation Simulator</h1>
        <p className="subtitle">
          Monte Carlo–based allocation under rank & capacity uncertainty
        </p>

        <div className="layout">
          {/* LEFT COLUMN */}
          <div className="left">
            <label className="label">CGPA</label>
            <input
              type="number"
              step="0.01"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              className="input"
            />

            <label className="label">GATE Score</label>
            <input
              type="number"
              value={gate}
              onChange={(e) => setGate(e.target.value)}
              className="input"
            />

            <button
              onClick={runSimulation}
              disabled={loading}
              className="button"
            >
              {loading ? "Simulating..." : "Run Simulation"}
            </button>

            {/* RESULT */}
            {result && (
              <div className="result-card compact">
                <h3>
                  Most Likely Supervisor:
                  <span className="highlight"> {result.most_likely}</span>
                </h3>

                {/* RISK + TOGGLE */}
                <div className="risk-row">
                  <div>
                    <strong>Risk:</strong>{" "}
                    <span className={`risk ${result.risk.toLowerCase()}`}>
                      {result.risk}
                    </span>
                  </div>

                  <button
                    className="toggle-btn inline"
                    onClick={() => setShowNumbers(!showNumbers)}
                  >
                    {showNumbers ? "Hide Values" : "Show Values"}
                  </button>
                </div>

                {/* PROBABILITY BARS */}
                <div className="chart">
                  {Object.entries(result.distribution)
                    .sort((a, b) => b[1] - a[1]) // highest first
                    .map(([name, prob]) => (
                      <div className="bar-row" key={name}>
                        <span className="bar-label">{name}</span>

                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${prob * 100}%`,
                              background: getBarColor(prob)
                            }}
                          />
                        </div>

                        {showNumbers && (
                          <span className="bar-value">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        )}
                      </div>
                    ))}
                </div>

                <p className="explanation">{result.explanation}</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="right">
            <label className="label">Preferences (1–32)</label>

            {prefs.map((value, idx) => (
              <div className="pref-row" key={idx}>
                <span>Preference {idx + 1}</span>
                <input
                  type="number"
                  min="1"
                  max="32"
                  value={value}
                  onChange={(e) => updatePref(idx, e.target.value)}
                  className="pref-input"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
