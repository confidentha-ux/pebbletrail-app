import type { ReactNode } from "react";

export function Frame({ children, progress, onHome }: { children: ReactNode; progress?: number; onHome?: () => void }) {
  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={onHome} aria-label="PebbleTrail home"><span className="brand-mark"><i /><i /><i /></span><span>PebbleTrail</span></button>
      {typeof progress === "number" && <div className="progress-wrap"><span>{progress}%</span><div className="progress"><b style={{ width: `${progress}%` }} /></div></div>}
      <span className="chapter-label">READ YOUR JUDGMENT</span>
    </header>
    {children}
  </main>;
}

export function QuestionFrame({ kicker, title, body, children, note }: { kicker: string; title: string; body: string; children: ReactNode; note?: string }) {
  return <section className="screen question-screen"><div className="question-panel">
    <p className="eyebrow">{kicker}</p><h1 className="question-title">{title}</h1><p className="question-body">{body}</p>
    {children}{note && <p className="screen-note">{note}</p>}
  </div></section>;
}
