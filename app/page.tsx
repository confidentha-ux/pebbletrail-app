"use client";

import { useEffect, useMemo, useState } from "react";
import { ChoiceList } from "./components/ChoiceList";
import { Frame, QuestionFrame } from "./components/Frame";
import { buildDiscovery, choices, openConditions, realityOptions, reasonsFor, situationOne } from "./core/situation-one";
import { clearSession, newSession, readSession, writeSession } from "./core/session";
import type { AppStage, ChoiceId, PebbleTrailSession, RealitySource, SituationAnswers } from "./core/types";

const flow: AppStage[] = ["welcome", "purpose", "situation", "exclusion-one", "reality-one", "exclusion-two", "reality-two", "space", "rejudge", "discovery"];

export default function Home() {
  const [session, setSession] = useState<PebbleTrailSession>(newSession());
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setSession(readSession()); setHydrated(true); }, []);

  const stage = session.stage;
  const answers = session.situationOne;
  const progress = useMemo(() => Math.max(0, Math.round((flow.indexOf(stage) - 1) / 7 * 100)), [stage]);

  function move(next: AppStage, patch: Partial<SituationAnswers> = {}) {
    const nextAnswers = { ...answers, ...patch };
    setSession(writeSession(next, nextAnswers));
  }

  function restart() {
    clearSession();
    const fresh = newSession();
    setSession(fresh);
  }

  if (!hydrated) return <Frame><section className="screen"><p className="eyebrow">PEBBLETRAIL</p></section></Frame>;

  if (stage === "welcome") return <Frame onHome={restart}><Welcome onNext={() => move("purpose")} /></Frame>;
  if (stage === "purpose") return <Frame onHome={restart}><Purpose onNext={() => move("situation")} /></Frame>;
  if (stage === "home") return <Frame onHome={restart}><Dashboard discoveryReady={Boolean(answers.finalChoice)} onContinue={() => move(answers.finalChoice ? "discovery" : "situation")} onRestart={() => move("situation", {})} /></Frame>;

  if (stage === "situation") return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="SITUATION 01 · A REQUEST" title={situationOne.title} body={situationOne.scene} note="Choose the response that comes first. You will have a chance to choose again.">
    <ChoiceList items={choices} selected={answers.firstChoice} onSelect={(id) => move("situation", { firstChoice: id })} />
    <Continue disabled={!answers.firstChoice} onClick={() => move("exclusion-one")} />
  </QuestionFrame></Frame>;

  if (stage === "exclusion-one" && answers.firstChoice) {
    const items = reasonsFor(answers.firstChoice);
    return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="WHAT YOU SET ASIDE · 1 OF 2" title="Why did another response fall away?" body="A decision also contains the options you did not choose. Select the thought that most strongly closed another path.">
      <ChoiceList items={items} selected={answers.firstExclusion} onSelect={(id) => move("exclusion-one", { firstExclusion: id })} />
      <Continue disabled={!answers.firstExclusion} onClick={() => move("reality-one")} />
    </QuestionFrame></Frame>;
  }

  if (stage === "reality-one") return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="WHERE THE THOUGHT COMES FROM" title="What is this thought to you?" body="Locate the source as closely as you can. This shows how the thought gained authority in your judgment.">
    <ChoiceList items={realityOptions} selected={answers.firstReality} onSelect={(id) => move("reality-one", { firstReality: id })} />
    <Continue disabled={!answers.firstReality} onClick={() => move("exclusion-two")} />
  </QuestionFrame></Frame>;

  if (stage === "exclusion-two" && answers.firstChoice) {
    const items = reasonsFor(answers.firstChoice, answers.firstExclusion ? [answers.firstExclusion] : []);
    return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="WHAT YOU SET ASIDE · 2 OF 2" title="What else kept the other paths closed?" body="Choose a second standard that was present in the same decision.">
      <ChoiceList items={items} selected={answers.secondExclusion} onSelect={(id) => move("exclusion-two", { secondExclusion: id })} />
      <Continue disabled={!answers.secondExclusion} onClick={() => move("reality-two")} />
    </QuestionFrame></Frame>;
  }

  if (stage === "reality-two") return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="WHERE THE THOUGHT COMES FROM" title="And this thought?" body="The two thoughts may come from different places. Mark the source that feels closest.">
    <ChoiceList items={realityOptions} selected={answers.secondReality} onSelect={(id) => move("reality-two", { secondReality: id })} />
    <Continue disabled={!answers.secondReality} onClick={() => move("space")} />
  </QuestionFrame></Frame>;

  if (stage === "space") return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="OPEN THE JUDGMENT SPACE" title="Which condition would make another choice possible?" body="Choose one concrete change that would allow you to consider the situation again.">
    <ChoiceList items={openConditions.map((label, index) => ({ id: `condition-${index}`, label }))} selected={answers.openCondition} onSelect={(id) => move("space", { openCondition: id })} />
    <Continue disabled={!answers.openCondition} onClick={() => move("rejudge")} label="Revisit the decision" />
  </QuestionFrame></Frame>;

  if (stage === "rejudge") return <Frame progress={progress} onHome={() => move("home")}><QuestionFrame kicker="REJUDGE" title="Choose again with the full trail in view." body="Your first answer, the standards that closed other paths, and a new condition are now present together.">
    <ChoiceList items={choices} selected={answers.finalChoice} onSelect={(id: ChoiceId) => move("rejudge", { finalChoice: id })} />
    <Continue disabled={!answers.finalChoice} onClick={() => move("discovery")} label="See what you discovered" />
  </QuestionFrame></Frame>;

  return <Frame progress={100} onHome={() => move("home")}><Discovery answers={answers} onHome={() => move("home")} onAgain={restart} /></Frame>;
}

function Continue({ disabled, onClick, label = "Continue" }: { disabled: boolean; onClick: () => void; label?: string }) {
  return <button className="primary continue" disabled={disabled} onClick={onClick}>{label}<span>→</span></button>;
}

function Welcome({ onNext }: { onNext: () => void }) {
  return <section className="screen welcome"><div className="welcome-copy"><p className="eyebrow">PEBBLETRAIL</p><h1>Your judgment leaves<br />a trail.</h1><p className="lead">A decision may arrive in a moment. Behind it is a precise sequence: what you noticed first, what you protected, what you set aside, and which standard you trusted.</p><button className="primary" onClick={onNext}>Begin <span>→</span></button></div><Trail /></section>;
}

function Purpose({ onNext }: { onNext: () => void }) {
  return <section className="screen purpose"><div className="purpose-inner"><p className="eyebrow">WHAT YOU WILL DO HERE</p><h1>Read one decision<br />from the inside.</h1><p className="lead">You will make a choice, examine why other choices disappeared, locate where those thoughts came from, and choose once more. The path between the two choices reveals how your judgment was made.</p><div className="purpose-steps"><div><b>01</b><strong>Choose</strong><span>Meet your first response.</span></div><div><b>02</b><strong>Unfold</strong><span>Find what closed the other paths.</span></div><div><b>03</b><strong>Rejudge</strong><span>Choose with more of the decision visible.</span></div></div><button className="primary" onClick={onNext}>Enter the first situation <span>→</span></button></div></section>;
}

function Dashboard({ discoveryReady, onContinue, onRestart }: { discoveryReady: boolean; onContinue: () => void; onRestart: () => void }) {
  return <section className="screen dashboard"><div className="dashboard-inner"><p className="eyebrow">YOUR PEBBLETRAIL</p><h1>One decision,<br />read more closely.</h1><div className="program-card"><span className="program-number">01</span><div><small>READ YOUR JUDGMENT</small><h2>A request from a friend</h2><p>{discoveryReady ? "Your first discovery is ready." : "Continue the situation and uncover the standards inside your choice."}</p></div><button onClick={onContinue}>{discoveryReady ? "View discovery" : "Continue"} →</button></div>{discoveryReady && <button className="text-button" onClick={onRestart}>Walk the situation again</button>}</div></section>;
}

function Discovery({ answers, onHome, onAgain }: { answers: SituationAnswers; onHome: () => void; onAgain: () => void }) {
  const result = buildDiscovery(answers);
  return <section className="screen discovery"><div className="discovery-grid"><div><p className="eyebrow">YOUR FIRST DISCOVERY</p><h1>{result.headline}</h1><p className="lead">{result.summary}</p><p className="movement">{result.movement}</p><div className="result-actions"><button className="primary" onClick={onHome}>Save to my trail <span>→</span></button><button className="text-button" onClick={onAgain}>Start over</button></div></div><aside className="trail-card"><h2>The standards you carried</h2><div><span>FIRST</span><strong>{result.firstStandard}</strong></div><div><span>ALSO PRESENT</span><strong>{result.secondStandard}</strong></div><div><span>OPENED BY</span><strong>{answers.openCondition ? openConditions[Number(answers.openCondition.split("-")[1])] : "A new condition"}</strong></div></aside></div></section>;
}

function Trail() { return <div className="trail-visual" aria-label="A person following scattered stones through a bright forest"><div className="sun"/><div className="hill far"/><div className="hill near"/><div className="tree-line">{Array.from({length:9},(_,i)=><i key={i}/>)}</div><div className="walker"/><div className="pebbles">{Array.from({length:8},(_,i)=><i key={i}/>)}</div><p>Follow what your choices reveal.</p></div>; }
