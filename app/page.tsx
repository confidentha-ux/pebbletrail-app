"use client";

import { useMemo, useState } from "react";

const choices = ["I would help my friend.", "I would politely decline.", "I would ask for more time."];
const reasons: Record<number, string[]> = {
  0: ["The relationship matters more than my schedule.", "They would not ask unless it were important.", "I want to be someone they can rely on."],
  1: ["I need to protect the commitment I already made.", "A rushed promise could disappoint both of us.", "A clear answer is kinder than uncertain help."],
  2: ["I need more information before I commit.", "There may be a way to protect both commitments.", "I want to understand how urgent the request is."],
};

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [reason, setReason] = useState<number | null>(null);
  const [rechoice, setRechoice] = useState<number | null>(null);
  const progress = useMemo(() => [0, 0, 0, 25, 50, 75, 100][screen] ?? 0, [screen]);
  const next = () => setScreen((value) => Math.min(value + 1, 6));

  return <main className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => setScreen(0)} aria-label="PebbleTrail home"><span className="brand-mark"><i /><i /><i /></span><span>PebbleTrail</span></button>
      {screen >= 3 && screen < 6 && <div className="progress-wrap" aria-label={`${progress}% complete`}><span>{progress}%</span><div className="progress"><b style={{ width: `${progress}%` }} /></div></div>}
      <button className="quiet-button" aria-label="Open menu">•••</button>
    </header>

    <section className={`screen screen-${screen}`}>
      {screen === 0 && <div className="hero-grid"><div className="hero-copy"><p className="eyebrow">READ YOUR JUDGMENT</p><h1>Your decisions leave<br />a trail.</h1><p className="lead">PebbleTrail helps you revisit a decision one step at a time—so you can see what you noticed, what you protected, and which standard guided you.</p><button className="primary" onClick={next}>Begin the trail <span>→</span></button><p className="micro">Your progress is saved as you go.</p></div><TrailArt /></div>}

      {screen === 1 && <div className="center-card intro-card"><div className="pebble-icon"><span /><span /><span /></div><p className="eyebrow">HOW IT WORKS</p><h2>A decision happens quickly.<br />Its making is precise.</h2><p>You will revisit one familiar situation through a short series of questions. Each question reveals another part of the judgment you already made.</p><div className="steps"><div><b>01</b><span><strong>Choose</strong>Your first response</span></div><div><b>02</b><span><strong>Look closer</strong>What shaped it</span></div><div><b>03</b><span><strong>Rejudge</strong>What you now see</span></div></div><button className="primary" onClick={next}>Continue <span>→</span></button></div>}

      {screen === 2 && <div className="center-card purpose-card"><p className="eyebrow">YOUR PURPOSE</p><h2>See the standard<br />behind your choice.</h2><p>We make countless judgments every day. By slowing down one moment, you can recognize the order of your thinking and the criteria that matter most to you.</p><div className="quote">“I want to understand how I arrive at my decisions.”</div><button className="primary" onClick={next}>Start first reflection <span>→</span></button></div>}

      {screen === 3 && <Question eyebrow="SITUATION 01 · A REQUEST" title="An old friend asks for an important favor." body="You already have an important commitment. They need your answer today. What would you do?"><OptionList items={choices} selected={choice} onSelect={setChoice} /><button className="primary" disabled={choice === null} onClick={next}>Continue <span>→</span></button></Question>}

      {screen === 4 && choice !== null && <Question eyebrow="LOOK CLOSER" title="What matters most in your choice?" body="Choose the reason that feels closest—even if more than one is true."><OptionList items={reasons[choice]} selected={reason} onSelect={setReason} /><button className="primary" disabled={reason === null} onClick={next}>Continue <span>→</span></button></Question>}

      {screen === 5 && <Question eyebrow="REJUDGE" title="Now, choose once more." body="You may keep your first answer or choose differently. Notice what feels clearer this time."><OptionList items={choices} selected={rechoice} onSelect={setRechoice} /><button className="primary" disabled={rechoice === null} onClick={next}>See what you found <span>→</span></button></Question>}

      {screen === 6 && choice !== null && reason !== null && rechoice !== null && <div className="result-layout"><div className="result-copy"><p className="eyebrow">YOUR FIRST DISCOVERY</p><h2>You look for a decision<br />you can stand behind.</h2><p>Your answer suggests that you first consider <strong>{choice === 0 ? "the bond between people" : choice === 1 ? "the promise already in your hands" : "the conditions surrounding the choice"}</strong>. You then test whether your response will remain reliable after the moment has passed.</p><div className="finding"><span>THE STANDARD YOU USED</span><strong>{reasons[choice][reason]}</strong></div><button className="primary" onClick={() => { setScreen(3); setChoice(null); setReason(null); setRechoice(null); }}>Walk another trail <span>→</span></button></div><div className="map-card"><p>Your judgment trail</p><div className="map-line"><i /><span>First response</span><b>{choices[choice]}</b></div><div className="map-line"><i /><span>Guiding standard</span><b>{reasons[choice][reason]}</b></div><div className="map-line"><i /><span>Second response</span><b>{choices[rechoice]}</b></div></div></div>}
    </section>
  </main>;
}

function Question({ eyebrow, title, body, children }: { eyebrow: string; title: string; body: string; children: React.ReactNode }) { return <div className="question"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="question-body">{body}</p>{children}</div>; }
function OptionList({ items, selected, onSelect }: { items: string[]; selected: number | null; onSelect: (value: number) => void }) { return <div className="options">{items.map((item, index) => <button key={item} className={selected === index ? "selected" : ""} onClick={() => onSelect(index)}><span>{String.fromCharCode(65 + index)}</span>{item}<i>{selected === index ? "✓" : ""}</i></button>)}</div>; }
function TrailArt() { return <div className="trail-art" aria-label="A trail of stones through a bright forest"><div className="sun" /><div className="ridge ridge-one" /><div className="ridge ridge-two" /><div className="trees">{[1,2,3,4,5,6,7,8].map(n => <i key={n} />)}</div><div className="walker" /><div className="stones">{[1,2,3,4,5,6,7].map(n => <i key={n} />)}</div><p>Follow what your choices reveal.</p></div>; }
