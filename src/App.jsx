import { useEffect, useState } from "react";

const API = "http://localhost:8080/api";

export default function App() {
  const [paragraph, setParagraph] = useState(null);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, mistakes: 0 });
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadParagraph();
  }, []);

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished, typed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && finished) {
        e.preventDefault();
        loadParagraph();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finished]);

  async function loadParagraph() {
    const res = await fetch(`${API}/paragraphs/random`);
    const data = await res.json();

    setParagraph(data);
    setTyped("");
    setStarted(false);
    setTimeLeft(60);
    setFinished(false);
    setStats({ wpm: 0, accuracy: 0, mistakes: 0 });
  }

  function calculateStats(value) {
    if (!paragraph || value.length === 0) {
      return { wpm: 0, accuracy: 0, mistakes: 0 };
    }

    let correct = 0;
    let mistakes = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === paragraph.content[i]) correct++;
      else mistakes++;
    }

    const elapsedSeconds = 60 - timeLeft || 1;
    const minutes = elapsedSeconds / 60;
    const wpm = Math.round((value.length / 5) / minutes);
    const accuracy = Number(((correct / value.length) * 100).toFixed(2));

    return { wpm, accuracy, mistakes };
  }

  function handleTyping(e) {
    if (finished) return;

    const value = e.target.value;
    if (!started) setStarted(true);

    setTyped(value);
    setStats(calculateStats(value));

    if (paragraph && value.length >= paragraph.content.length) {
      finishTest(value);
    }
  }

  async function finishTest(finalTyped = typed) {
    if (finished || !paragraph) return;

    const finalStats = calculateStats(finalTyped);
    setStats(finalStats);
    setFinished(true);

    await fetch(`${API}/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: { id: 1 },
        challenge: { id: paragraph.challenge.id },
        paragraph: { id: paragraph.id },
        wpm: finalStats.wpm,
        accuracy: finalStats.accuracy,
        mistakes: finalStats.mistakes,
        timeTaken: 60 - timeLeft,
        testDate: new Date().toISOString().slice(0, 19)
      })
    });

    loadHistory(false);
  }

  async function loadHistory(show = true) {
    const res = await fetch(`${API}/results/user/1`);
    const data = await res.json();
    setHistory([...data].reverse());
    setShowHistory(show);
  }

  function renderHighlightedText() {
    if (!paragraph) return "Loading paragraph...";

    return paragraph.content.split("").map((char, index) => {
      let className = "char";

      if (index < typed.length) {
        className += typed[index] === char ? " correct" : " wrong";
      }

      if (index === typed.length && !finished) {
        className += " current";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  }

  return (
    <main className="page">
      <section className="card">
        <div className="topbar">
          <div>
            <h1>TypeRush</h1>
            <p className="subtitle">Typing Speed Test</p>
          </div>
          <button className="ghost" onClick={() => setShowHistory(!showHistory)}>
            {showHistory ? "Hide History" : "History"}
          </button>
        </div>

        <div className="stats">
          <div><span>{timeLeft}</span><p>seconds</p></div>
          <div><span>{stats.wpm}</span><p>WPM</p></div>
          <div><span>{stats.accuracy}%</span><p>accuracy</p></div>
          <div><span>{stats.mistakes}</span><p>mistakes</p></div>
        </div>

        <div className="paragraph">{renderHighlightedText()}</div>

        <textarea
          value={typed}
          onChange={handleTyping}
          disabled={finished || !paragraph}
          placeholder="Start typing here..."
          autoFocus
        />

        {finished && (
          <div className="resultBox">
            <h2>Test Complete</h2>
            <div className="resultGrid">
              <div><strong>{stats.wpm}</strong><p>WPM</p></div>
              <div><strong>{stats.accuracy}%</strong><p>Accuracy</p></div>
              <div><strong>{stats.mistakes}</strong><p>Mistakes</p></div>
            </div>
            <p className="hint">Press Enter or click New Test to restart</p>
          </div>
        )}

        <div className="buttons">
          <button onClick={loadParagraph}>New Test</button>
          <button className="ghost" onClick={() => loadHistory(true)}>
            Load History
          </button>
        </div>

        {showHistory && (
          <div className="history">
            <h2>Typing History</h2>

            {history.length === 0 ? (
              <p>No history found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>WPM</th>
                    <th>Accuracy</th>
                    <th>Mistakes</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.wpm}</td>
                      <td>{item.accuracy}%</td>
                      <td>{item.mistakes}</td>
                      <td>{item.timeTaken}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </section>
    </main>
  );
}