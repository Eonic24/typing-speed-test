import { useEffect, useRef, useState } from "react";

const API = "http://localhost:8080/api";

const fallbackWords = [
  "as", "come", "got", "free", "could", "from", "few", "have", "there", "out",
  "next", "or", "them", "its", "up", "at", "high", "together", "my", "on",
  "she", "and", "real", "then", "some", "take", "time", "they", "her", "even",
  "north", "get", "these", "of", "by", "good", "know", "great", "example",
  "that", "children", "make", "would", "work", "in", "so", "back", "be",
  "begin", "him", "group", "who", "like", "will", "to", "one", "no", "me",
  "new", "he", "first", "than", "which", "just", "over", "can", "say", "ease",
  "hold", "also", "how", "other", "our", "with", "it", "a", "go", "often",
  "us", "look"
];

function buildText(seconds) {
  const count = seconds === 15 ? 35 : seconds === 30 ? 80 : 150;
  return Array.from(
    { length: count },
    (_, i) => fallbackWords[i % fallbackWords.length]
  ).join(" ");
}

export default function App() {
  const [duration, setDuration] = useState(30);
  const [text, setText] = useState(buildText(30));
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correct: 0
  });

  const inputRef = useRef(null);
  const textRef = useRef(text);
  const typedRef = useRef("");
  const timeLeftRef = useRef(duration);
  const finishedRef = useRef(false);

  useEffect(() => {
    resetTest(duration);
  }, [duration]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);

  useEffect(() => {
    if (!started || finished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(timer);
          finishTest(typedRef.current, 0);
          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, finished]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        resetTest(duration);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [duration]);

  async function resetTest(selectedDuration = duration) {
    let finalText = buildText(selectedDuration);

    try {
      const res = await fetch(`${API}/paragraphs/random`);
      const data = await res.json();
      const repeatCount =
        selectedDuration === 15 ? 4 : selectedDuration === 30 ? 8 : 15;

      finalText = Array(repeatCount).fill(data.content).join(" ");
    } catch {
      finalText = buildText(selectedDuration);
    }

    setText(finalText);
    textRef.current = finalText;

    setTyped("");
    typedRef.current = "";

    setTimeLeft(selectedDuration);
    timeLeftRef.current = selectedDuration;

    setStarted(false);
    setFinished(false);
    finishedRef.current = false;

    setStats({
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correct: 0
    });

    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function calculate(value, customTimeLeft = timeLeftRef.current) {
    const currentText = textRef.current;

    let correct = 0;
    let errors = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentText[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    const elapsed = Math.max(duration - customTimeLeft, 1);
    const minutes = elapsed / 60;
    const wpm = Math.round(correct / 5 / minutes);
    const accuracy =
      value.length === 0 ? 100 : Math.round((correct / value.length) * 100);

    return {
      wpm,
      accuracy,
      errors,
      correct
    };
  }

  function handleInput(e) {
    if (finishedRef.current) return;

    const value = e.target.value;

    typedRef.current = value;

    if (!started) {
      setStarted(true);
    }

    setTyped(value);
    setStats(calculate(value));

    if (value.length >= textRef.current.length) {
      finishTest(value, timeLeftRef.current);
    }
  }

  async function finishTest(
    finalTyped = typedRef.current,
    customTimeLeft = timeLeftRef.current
  ) {
    if (finishedRef.current) return;

    const finalStats = calculate(finalTyped, customTimeLeft);

    setStats(finalStats);
    setFinished(true);
    finishedRef.current = true;

    try {
      await fetch(`${API}/results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: { id: 1 },
          challenge: { id: 1 },
          paragraph: { id: 1 },
          wpm: finalStats.wpm,
          accuracy: finalStats.accuracy,
          mistakes: finalStats.errors,
          timeTaken: duration - customTimeLeft,
          testDate: new Date().toISOString().slice(0, 19)
        })
      });
    } catch {
      console.log("Result not saved. Backend may be offline.");
    }
  }

  function renderText() {
    return text.split("").map((char, index) => {
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
    <main className="page" onClick={() => inputRef.current?.focus()}>
      <h1 className="logo">
        type<span>rush</span>
      </h1>

      <div className="timeOptions">
        {[15, 30, 60].map((sec) => (
          <button
            key={sec}
            className={duration === sec ? "active" : ""}
            onClick={() => setDuration(sec)}
          >
            {sec}s
          </button>
        ))}
      </div>

      {!finished ? (
        <>
          <div className="line"></div>

          <section className="stats">
            <div>
              <p>TIME</p>
              <strong>
                {timeLeft}
                <small>s</small>
              </strong>
            </div>

            <div>
              <p>WPM</p>
              <strong>{stats.wpm}</strong>
            </div>

            <div>
              <p>ACCURACY</p>
              <strong>
                {stats.accuracy}
                <small>%</small>
              </strong>
            </div>

            <div>
              <p>ERRORS</p>
              <strong>{stats.errors}</strong>
            </div>
          </section>

          <p className="startHint">
            {started ? "" : "Start typing to begin the test"}
          </p>

          <section className="textBox">{renderText()}</section>

          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleInput}
            autoFocus
            spellCheck="false"
          />

          <p className="restartHint">
            Press <kbd>Tab</kbd> to restart
          </p>
        </>
      ) : (
        <section className="resultScreen">
          <p className="complete">TEST COMPLETE</p>

          <div className="resultCards">
            <div>
              <p>WPM</p>
              <strong>{stats.wpm}</strong>
            </div>

            <div>
              <p>ACCURACY</p>
              <strong className="green">
                {stats.accuracy}
                <small>%</small>
              </strong>
            </div>

            <div>
              <p>ERRORS</p>
              <strong className="red">{stats.errors}</strong>
            </div>

            <div>
              <p>DURATION</p>
              <strong>
                {duration}
                <small>s</small>
              </strong>
            </div>
          </div>

          <div className="bars">
            <div className="barLabel">
              <span>Correct</span>
              <span>{stats.correct}</span>
            </div>

            <div className="bar">
              <div
                className="barFill correctBar"
                style={{
                  width: `${Math.min(stats.accuracy, 100)}%`
                }}
              ></div>
            </div>

            <div className="barLabel">
              <span>Errors</span>
              <span>{stats.errors}</span>
            </div>

            <div className="bar">
              <div
                className="barFill errorBar"
                style={{
                  width: `${Math.min(stats.errors, 100)}%`
                }}
              ></div>
            </div>
          </div>

          <button className="tryAgain" onClick={() => resetTest(duration)}>
            Try again <span>(Tab)</span>
          </button>
        </section>
      )}
    </main>
  );
}