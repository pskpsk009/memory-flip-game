import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Memory Flip — Learn Words, Train Memory" },
      { name: "description", content: "A memory matching game to learn new words and boost memory." },
      { property: "og:title", content: "Memory Flip" },
      { property: "og:description", content: "Flip cards, match word pairs, and train your memory." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Pair = { a: string; b: string };
type Screen = "scrMenu" | "scrLevelSelect" | "game" | "scrCreateSet" | "scrGameOver";

type Level = { name: string; pairs: Pair[]; icon?: string; sub?: string; badge?: string };
const LEVELS: Record<string, Level> = {
  Level_1: { name: "Level 1", icon: "🍎", sub: "6 pairs · pictures", badge: "bg-lv1", pairs: [
    { a: "🍎", b: "Apple" }, { a: "🐶", b: "Dog" }, { a: "☀️", b: "Sun" },
    { a: "🚗", b: "Car" }, { a: "🌳", b: "Tree" }, { a: "🐟", b: "Fish" },
  ]},
  Level_2: { name: "Level 2", icon: "📚", sub: "8 pairs · synonyms", badge: "bg-lv2", pairs: [
    { a: "Happy", b: "Joyful" }, { a: "Big", b: "Huge" }, { a: "Fast", b: "Quick" },
    { a: "Smart", b: "Clever" }, { a: "Calm", b: "Peaceful" }, { a: "Brave", b: "Bold" },
    { a: "Tiny", b: "Small" }, { a: "Begin", b: "Start" },
  ]},
  Level_3: { name: "Level 3", icon: "⚖️", sub: "10 pairs · antonyms", badge: "bg-lv3", pairs: [
    { a: "Hot", b: "Cold" }, { a: "Up", b: "Down" }, { a: "Day", b: "Night" }, { a: "Open", b: "Close" },
    { a: "Light", b: "Dark" }, { a: "Win", b: "Lose" }, { a: "Early", b: "Late" }, { a: "Full", b: "Empty" },
    { a: "Rich", b: "Poor" }, { a: "Push", b: "Pull" },
  ]},
  Level_4: { name: "Level 4", icon: "🎓", sub: "12 pairs · advanced vocabulary", badge: "bg-lv4", pairs: [
    { a: "Candid", b: "Honest" }, { a: "Vivid", b: "Bright" }, { a: "Frugal", b: "Thrifty" }, { a: "Eager", b: "Keen" },
    { a: "Vast", b: "Immense" }, { a: "Hostile", b: "Unfriendly" }, { a: "Diligent", b: "Hardworking" }, { a: "Ample", b: "Plenty" },
    { a: "Fragile", b: "Delicate" }, { a: "Obscure", b: "Unclear" }, { a: "Prudent", b: "Wise" }, { a: "Serene", b: "Tranquil" },
  ]},
  Level_5: { name: "Level 5", icon: "🏆", sub: "14 pairs · master challenge", badge: "bg-lv5", pairs: [
    { a: "Ephemeral", b: "Fleeting" }, { a: "Ubiquitous", b: "Everywhere" }, { a: "Benevolent", b: "Kind" }, { a: "Lucid", b: "Clear" },
    { a: "Tenacious", b: "Persistent" }, { a: "Arduous", b: "Difficult" }, { a: "Verbose", b: "Wordy" }, { a: "Meticulous", b: "Careful" },
    { a: "Pragmatic", b: "Practical" }, { a: "Eloquent", b: "Fluent" }, { a: "Resilient", b: "Tough" }, { a: "Candor", b: "Frankness" },
    { a: "Zealous", b: "Passionate" }, { a: "Novice", b: "Beginner" },
  ]},
};
export const MAX_MISTAKES = 3;

type Card = { id: number; pair: number; text: string };
const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);
const buildDeck = (pairs: Pair[]): Card[] =>
  shuffle(pairs.flatMap((p, i) => [{ id: i * 2, pair: i, text: p.a }, { id: i * 2 + 1, pair: i, text: p.b }]));

function App() {
  const [screen, setScreen] = useState<Screen>("scrMenu");
  const [custom, setCustom] = useState<Pair[]>([]);
  const [round, setRound] = useState(0);
  const [active, setActive] = useState<{ name: string; pairs: Pair[] } | null>(null);
  const [result, setResult] = useState({ score: 0, time: 0, moves: 0 });

  const start = (lvl: { name: string; pairs: Pair[] }) => { setActive(lvl); setRound((r) => r + 1); setScreen("game"); };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden p-0 sm:p-4">
      <Decor />
      <div className="relative flex h-dvh w-full max-w-[440px] flex-col overflow-y-auto bg-frame px-5 py-5 sm:h-[min(750px,calc(100dvh-2rem))] sm:rounded-3xl sm:border sm:shadow-card">
        <div key={screen} className="relative flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          {screen === "scrMenu" && <Menu onPlay={() => setScreen("scrLevelSelect")} />}
          {screen === "scrLevelSelect" && (
            <LevelSelect
              custom={custom}
              onBack={() => setScreen("scrMenu")}
              onPick={(k) => start(LEVELS[k]!)}
              onCustom={() => setScreen("scrCreateSet")}
              onPlayCustom={() => start({ name: "Custom Set", pairs: custom })}
            />
          )}
          {screen === "scrCreateSet" && (
            <CreateSet pairs={custom} setPairs={setCustom} onBack={() => setScreen("scrLevelSelect")}
              onPlay={() => start({ name: "Custom Set", pairs: custom })} />
          )}
          {screen === "game" && active && (
            <Game key={round} level={active} onRetry={() => start(active)} onQuit={() => setScreen("scrLevelSelect")}
              onDone={(r) => { setResult(r); setScreen("scrGameOver"); }} />
          )}
          {screen === "scrGameOver" && active && (
            <GameOver {...result} level={active.name} onReplay={() => start(active)} onMenu={() => setScreen("scrMenu")} />
          )}
        </div>
      </div>
    </main>
  );
}

function Decor() {
  const C = ({ className }: { className: string }) => (
    <div className={`pointer-events-none absolute h-28 w-20 rounded-xl bg-accent/40 grid-pattern shadow-card animate-floaty ${className}`}>
      <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full border-2 border-gold bg-gold/70" />
    </div>
  );
  return (
    <>
      <C className="-left-4 top-10 -rotate-12" />
      <C className="-right-6 top-32 rotate-12 [animation-delay:1s]" />
      <C className="-left-6 bottom-16 rotate-6 [animation-delay:2s]" />
      <C className="-right-4 bottom-6 -rotate-6 [animation-delay:3s]" />
    </>
  );
}

function Logo() {
  return (
    <div className="relative h-16 w-14 shrink-0">
      <div className="absolute inset-0 -rotate-12 rounded-xl bg-accent shadow-card" />
      <div className="absolute inset-0 rotate-6 rounded-xl bg-primary grid-pattern shadow-card" />
      <div className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-sm shadow-card">★</div>
    </div>
  );
}

const Btn = ({ variant = "primary", className = "", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) => (
  <button {...p} className={`rounded-2xl px-6 py-3 font-display text-lg font-semibold transition active:scale-95 disabled:opacity-40 ${
    variant === "primary" ? "bg-primary text-primary-foreground shadow-card hover:brightness-110" : "bg-card text-primary shadow-card hover:bg-secondary"
  } ${className}`} />
);

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <Btn variant="ghost" className="!px-4 !py-2" onClick={onBack}>←</Btn>
      <h2 className="truncate text-2xl font-bold">{title}</h2>
    </div>
  );
}

function Menu({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="flex items-center gap-4">
        <Logo />
        <h1 className="text-4xl font-bold text-primary">Memory Flip</h1>
      </div>
      <p className="mt-5 max-w-xs text-lg font-semibold">a game to learn new words and increase memory capability</p>
      <Btn className="mt-10 w-48 !py-4 !text-xl" onClick={onPlay}>Play</Btn>
    </div>
  );
}

function LevelSelect({ custom, onBack, onPick, onCustom, onPlayCustom }: {
  custom: Pair[]; onBack: () => void; onPick: (k: string) => void; onCustom: () => void; onPlayCustom: () => void;
}) {
  const Tile = ({ label, sub, onClick, icon, badge }: { label: string; sub: string; onClick: () => void; icon: string; badge: string }) => (
    <button onClick={onClick} className={`flex w-full items-center gap-4 rounded-2xl border bg-card px-4 py-2.5 text-left shadow-card transition hover:-translate-y-0.5 active:scale-95`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl ${badge}`}>{icon}</span>
      <span className="min-w-0"><span className="block font-display text-lg font-bold">{label}</span>
      <span className="block text-xs text-muted-foreground">{sub}</span></span>
    </button>
  );
  return (
    <>
      <Header title="Choose a Level" onBack={onBack} />
      <div className="mx-auto flex w-full flex-col gap-3">
        {Object.entries(LEVELS).map(([k, l]) => (
          <Tile key={k} icon={l.icon!} label={l.name} sub={l.sub!} badge={l.badge!} onClick={() => onPick(k)} />
        ))}
        <Tile icon="✏️" label="Custom Set" sub={custom.length >= 2 ? `${custom.length} pairs · tap ▶ to play` : "Create your own"} badge="bg-lvc" onClick={onCustom} />
        {custom.length >= 2 && <Tile icon="▶️" label="Play Custom" sub={`${custom.length} pairs`} badge="bg-lvc" onClick={onPlayCustom} />}
      </div>
    </>
  );
}

function CreateSet({ pairs, setPairs, onBack, onPlay }: { pairs: Pair[]; setPairs: (p: Pair[]) => void; onBack: () => void; onPlay: () => void }) {
  const [a, setA] = useState(""); const [b, setB] = useState("");
  const input = "w-full rounded-xl border-2 bg-card px-4 py-3 outline-none focus:border-accent";
  return (
    <>
      <Header title="Create Custom Set" onBack={onBack} />
      <form className="space-y-3 rounded-2xl bg-card/70 p-4 shadow-card" onSubmit={(e) => {
        e.preventDefault(); if (!a.trim() || !b.trim() || pairs.length >= 8) return;
        setPairs([...pairs, { a: a.trim(), b: b.trim() }]); setA(""); setB("");
      }}>
        <input className={input} placeholder="Word or emoji (e.g. 🐱)" value={a} onChange={(e) => setA(e.target.value)} maxLength={20} />
        <input className={input} placeholder="Its match (e.g. Cat)" value={b} onChange={(e) => setB(e.target.value)} maxLength={20} />
        <Btn type="submit" className="w-full" disabled={pairs.length >= 8}>Add Pair</Btn>
        <p className="text-center text-xs text-muted-foreground">{pairs.length}/8 pairs · minimum 2</p>
      </form>
      <ul className="mt-4 space-y-2">
        {pairs.map((p, i) => (
          <li key={i} className="flex items-center justify-between rounded-xl bg-card px-4 py-2 shadow-card">
            <span className="min-w-0 truncate font-semibold">{p.a} ↔ {p.b}</span>
            <button className="shrink-0 text-muted-foreground" onClick={() => setPairs(pairs.filter((_, j) => j !== i))}>✕</button>
          </li>
        ))}
      </ul>
      <Btn className="mt-6" disabled={pairs.length < 2} onClick={onPlay}>Play This Set</Btn>
    </>
  );
}

function Game({ level, onQuit, onDone, onRetry }: { level: { name: string; pairs: Pair[] }; onQuit: () => void; onRetry: () => void; onDone: (r: { score: number; time: number; moves: number }) => void }) {
  const deck = useMemo(() => buildDeck(level.pairs), [level]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const [toast, setToast] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const lost = mistakes >= MAX_MISTAKES;

  useEffect(() => { if (celebrate || lost) return; const t = setInterval(() => setTime((s) => s + 1), 1000); return () => clearInterval(t); }, [celebrate, lost]);

  const flip = (i: number) => {
    if (lost || open.length === 2 || open.includes(i) || matched.has(deck[i]!.pair)) return;
    const next = [...open, i]; setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const x = next[0]!, y = next[1]!;
    if (deck[x]!.pair === deck[y]!.pair) {
      const m = new Set(matched); m.add(deck[x]!.pair);
      setTimeout(() => {
        setMatched(m); setOpen([]); setScore((s) => s + 10);
        setToast("Match! +10"); setTimeout(() => setToast(""), 900);
        if (m.size === level.pairs.length) setCelebrate(true);
      }, 400);
    } else {
      setTimeout(() => { setOpen([]); setScore((s) => Math.max(0, s - 1)); setMistakes((m) => m + 1); }, 900);
    }
  };

  const n = deck.length;
  const cols = n > 20 ? "grid-cols-6" : n > 16 ? "grid-cols-5" : "grid-cols-4";
  const small = n > 16;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      <Header title={level.name} onBack={onQuit} />
      <div className="mb-3 grid w-full grid-cols-4 gap-2 text-center">
        {[["Score", score], ["Time", fmt(time)], ["Moves", moves], ["Lives", "♥".repeat(MAX_MISTAKES - Math.min(mistakes, MAX_MISTAKES)) + "♡".repeat(Math.min(mistakes, MAX_MISTAKES))]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-card py-1.5 shadow-card">
            <div className="text-[10px] text-muted-foreground">{k === "Lives" ? `Mistakes ${mistakes}/${MAX_MISTAKES}` : k}</div>
            <div className={`font-display text-lg font-bold ${k === "Lives" ? "text-danger" : ""}`}>{v}</div>
          </div>
        ))}
      </div>
      <div className={`mx-auto grid w-full ${cols} ${small ? "gap-1.5" : "gap-2"}`}>
        {deck.map((c, i) => {
          const up = open.includes(i) || matched.has(c.pair);
          return (
            <button key={c.id} onClick={() => flip(i)} className="perspective aspect-[4/5]" aria-label={up ? c.text : "Hidden card"}>
              <div className={`preserve-3d relative h-full w-full transition-transform duration-500 ${up ? "rotate-y-180" : "hover:scale-105"}`}>
                <div className="backface-hidden absolute inset-0 grid place-items-center rounded-xl bg-primary grid-pattern shadow-card">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-primary">★</span>
                </div>
                <div className={`backface-hidden rotate-y-180 absolute inset-0 grid place-items-center rounded-xl border-2 p-1 shadow-card ${matched.has(c.pair) ? "border-success bg-success/15" : "bg-card"}`}>
                  <span className={`break-words text-center font-display font-bold ${[...c.text].length <= 2 ? (small ? "text-2xl" : "text-3xl") : small ? "text-[9px] leading-tight" : "text-xs"}`}>{c.text}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {toast && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-success px-5 py-2 font-bold text-primary-foreground shadow-card animate-in fade-in zoom-in">{toast}</div>}
      {lost && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-foreground/40 p-4 animate-in fade-in">
          <div className="w-full max-w-xs rounded-2xl bg-card p-6 text-center shadow-card animate-in zoom-in">
            <div className="text-5xl">💔</div>
            <h3 className="mt-2 text-2xl font-bold">Game Over</h3>
            <p className="mt-1 text-muted-foreground">{MAX_MISTAKES} mistakes — score {score}</p>
            <Btn className="mt-5 w-full" onClick={onRetry}>Try Again</Btn>
            <Btn variant="ghost" className="mt-3 w-full" onClick={onQuit}>Level Select</Btn>
          </div>
        </div>
      )}
      {celebrate && (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-2xl bg-foreground/40 p-4 animate-in fade-in">
          <div className="w-full max-w-xs rounded-2xl bg-card p-6 text-center shadow-card animate-in zoom-in">
            <div className="text-5xl">🎉</div>
            <h3 className="mt-2 text-2xl font-bold">Level Complete!</h3>
            <p className="mt-1 text-muted-foreground">All pairs matched in {fmt(time)}</p>
            <Btn className="mt-5 w-full" onClick={() => onDone({ score, time, moves })}>See Results</Btn>
          </div>
        </div>
      )}
    </>
  );
}

function GameOver({ score, time, moves, level, onReplay, onMenu }: { score: number; time: number; moves: number; level: string; onReplay: () => void; onMenu: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <Logo />
      <h2 className="mt-4 text-3xl font-bold">Well done!</h2>
      <p className="text-muted-foreground">{level}</p>
      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        {[["Score", score], ["Time", `${time}s`], ["Moves", moves]].map(([k, v]) => (
          <div key={k} className="rounded-2xl bg-card p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="font-display text-2xl font-bold text-primary">{v}</div>
          </div>
        ))}
      </div>
      <Btn className="mt-8 w-full" onClick={onReplay}>Replay</Btn>
      <Btn variant="ghost" className="mt-3 w-full" onClick={onMenu}>Back to Menu</Btn>
    </div>
  );
}
