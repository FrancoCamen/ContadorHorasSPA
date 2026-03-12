import { useState, useRef } from 'react';
import './App.css';

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}


function App() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studySessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [desc, setDesc] = useState('');
  const timerRef = useRef(null);

  // Start timer
  const start = () => {
    if (!running) {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
  };

  // Stop timer
  const stop = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
    }
  };

  // Save session
  const saveSession = () => {
    if (seconds > 0 && desc.trim()) {
      const session = {
        date: new Date().toLocaleString(),
        duration: seconds,
        desc: desc.trim(),
      };
      const updated = [session, ...sessions];
      setSessions(updated);
      localStorage.setItem('studySessions', JSON.stringify(updated));
      setSeconds(0);
      setDesc('');
    }
  };

  // Delete session
  const deleteSession = idx => {
    const updated = sessions.filter((_, i) => i !== idx);
    setSessions(updated);
    localStorage.setItem('studySessions', JSON.stringify(updated));
  };

  // Reset timer
  const reset = () => {
    setSeconds(0);
    setDesc('');
    setRunning(false);
    clearInterval(timerRef.current);
  };

  return (
    <main className="study-app">
      <section className="timer-section">
        <h1>Contador de horas de estudio</h1>
        <div className="timer-display">{formatTime(seconds)}</div>
        <div className="timer-controls">
          <button className="start-btn" onClick={start} disabled={running}>Iniciar</button>
          <button className="stop-btn" onClick={stop} disabled={!running}>Parar</button>
          <button className="reset-btn" onClick={reset}>Reset</button>
        </div>
        {!running && seconds > 0 && (
          <div className="session-form">
            <input
              type="text"
              placeholder="Descripción breve de la sesión"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <button className="save-btn" onClick={saveSession} disabled={!desc.trim()}>Guardar sesión</button>
          </div>
        )}
      </section>
      <section className="sessions-section">
        <h2>Sesiones guardadas</h2>
        <ul className="sessions-list">
          {sessions.length === 0 && <li className="empty">No hay sesiones registradas.</li>}
          {sessions.map((s, idx) => (
            <li key={idx} className="session-item">
              <button className="delete-btn" title="Eliminar sesión" onClick={() => deleteSession(idx)}>&times;</button>
              <span className="session-date">{s.date}</span>
              <span className="session-duration">{formatTime(s.duration)}</span>
              <span className="session-desc">{s.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
