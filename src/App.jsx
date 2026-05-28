import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

/* ── SUPABASE ── */
const SUPABASE_URL = "https://otijqofdmqarnerumopm.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90aWpxb2ZkbXFhcm5lcnVtb3BtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDk5MTcsImV4cCI6MjA5NTQ4NTkxN30.jjb71cgo5QTg2synIwqniCX1epgYVLFZyq0iFO4FOAw";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

/* ── FONTS ── */
const FONT_LINK = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');`;

/* ── DESIGN TOKENS ── */
const C = {
  bg:        "#F0F4FA",
  surface:   "#FFFFFF",
  surfaceUp: "#E8EEF8",
  border:    "#D0DCF0",
  borderHi:  "#A8BEDE",
  navy:      "#1A3A6E",
  blue:      "#1A56DB",
  blueHi:    "#2563EB",
  blueDim:   "#DBEAFE",
  gold:      "#1A56DB",
  goldHi:    "#2563EB",
  goldDim:   "#BFDBFE",
  white:     "#1E293B",
  gray:      "#64748B",
  grayHi:    "#475569",
  green:     "#16A34A",
  red:       "#DC2626",
  amber:     "#D97706",
};

const TOPICS = [
  { id: "ethics",     name: "Ethics & Standards",        icon: "⚖️", total: 180, color: "#1A56DB", free: true  },
  { id: "quant",      name: "Quantitative Methods",       icon: "📐", total: 220, color: "#7C3AED", free: true  },
  { id: "econ",       name: "Economics",                  icon: "📈", total: 195, color: "#0891B2", free: true  },
  { id: "fra",        name: "Financial Reporting",        icon: "📋", total: 280, color: "#7C3AED", free: false },
  { id: "corp",       name: "Corporate Finance",          icon: "🏢", total: 160, color: "#DB2777", free: false },
  { id: "equity",     name: "Equity Investments",         icon: "📊", total: 210, color: "#16A34A", free: false },
  { id: "fi",         name: "Fixed Income",               icon: "🏦", total: 230, color: "#D97706", free: false },
  { id: "deriv",      name: "Derivatives",                icon: "🔄", total: 140, color: "#EA580C", free: false },
  { id: "alts",       name: "Alternative Investments",    icon: "💎", total: 120, color: "#7C3AED", free: false },
  { id: "port",       name: "Portfolio Management",       icon: "🎯", total: 175, color: "#0891B2", free: false },
];

const FREE_QUESTIONS_PER_TOPIC = 15;

const MOCK_QUESTIONS = [
  {
    id: 1, topic: "ethics",
    q: "According to the CFA Institute Code of Ethics, members must act with integrity, competence, diligence, and respect and in an ethical manner with the public, clients, prospective clients, employers, employees, colleagues in the investment profession, and other participants in the global capital markets. Which of the following best describes a violation of this standard?",
    opts: [
      "Disclosing a conflict of interest to a supervisor before executing a trade",
      "Placing personal trades ahead of client trades to benefit from anticipated price movements",
      "Reporting suspected violations of the Code to the CFA Institute",
      "Maintaining client confidentiality while complying with legal requirements"
    ],
    correct: 1,
    explanation: "Front-running — placing personal trades before client trades to profit from anticipated price movements — is a clear violation of the duty of loyalty to clients and the prohibition against self-dealing under Standard VI(B) Priority of Transactions."
  },
  {
    id: 2, topic: "quant",
    q: "An investment has an expected return of 12% with a standard deviation of 8%. Assuming returns are normally distributed, what is the probability that the return will be less than 4%?",
    opts: ["2.28%", "15.87%", "84.13%", "97.72%"],
    correct: 1,
    explanation: "4% is exactly one standard deviation below the mean (12% − 8% = 4%). For a normal distribution, approximately 15.87% of outcomes fall more than one standard deviation below the mean."
  },
  {
    id: 3, topic: "econ",
    q: "When the central bank unexpectedly raises interest rates, which of the following is the most likely immediate effect on the foreign exchange market?",
    opts: [
      "The domestic currency depreciates due to capital outflows",
      "The domestic currency appreciates as foreign capital flows in seeking higher yields",
      "Exchange rates remain stable as markets had anticipated the move",
      "The domestic currency depreciates due to lower inflation expectations"
    ],
    correct: 1,
    explanation: "Higher domestic interest rates attract foreign capital seeking better returns, increasing demand for the domestic currency and causing it to appreciate. This is consistent with interest rate parity theory."
  },
];

const FLASHCARDS = [
  { id: 1, topic: "quant", front: "What is the formula for the Sharpe Ratio?", back: "Sharpe Ratio = (Rp − Rf) / σp\n\nWhere Rp = portfolio return, Rf = risk-free rate, σp = portfolio standard deviation", tag: "Formula" },
  { id: 2, topic: "ethics", front: "Standard III(A) — Loyalty, Prudence and Care", back: "Members must act for the benefit of their clients and place their clients' interests before their employer's or their own interests. The client's interests always come first.", tag: "Standard" },
  { id: 3, topic: "fi", front: "What is Modified Duration?", back: "Modified Duration = Macaulay Duration / (1 + y/m)\n\nMeasures the price sensitivity of a bond to interest rate changes. A duration of 5 means ~5% price change per 1% yield change.", tag: "Formula" },
];

/* ── GLOBAL STYLES ── */
const injectStyles = () => {
  const el = document.createElement("style");
  el.textContent = `
    ${FONT_LINK}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { background: ${C.bg}; font-family: 'Syne', sans-serif; color: ${C.white}; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${C.surfaceUp}; } ::-webkit-scrollbar-thumb { background: ${C.borderHi}; border-radius: 99px; }
    @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn  { from { opacity:0; transform:scale(.94); } to { opacity:1; transform:scale(1); } }
    @keyframes pulse    { 0%,100%{opacity:1;} 50%{opacity:.5;} }
    @keyframes spin     { to { transform: rotate(360deg); } }
    @keyframes shimmer  { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 20px ${C.gold}44;} 50%{box-shadow:0 0 40px ${C.gold}88;} }
    .btn-primary {
      background: linear-gradient(135deg, ${C.blue}, ${C.blueHi});
      border: none; border-radius: 10px; color: #FFFFFF;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
      cursor: pointer; transition: all .2s; letter-spacing: .5px;
    }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px ${C.blue}44; }
    .btn-ghost {
      background: transparent; border: 1.5px solid ${C.border};
      border-radius: 10px; color: ${C.grayHi};
      font-family: 'Syne', sans-serif; font-weight: 600; font-size: 14px;
      cursor: pointer; transition: all .2s;
    }
    .btn-ghost:hover { border-color: ${C.blue}; color: ${C.blue}; }
    .card {
      background: ${C.surface}; border: 1px solid ${C.border};
      border-radius: 16px; transition: border-color .2s, transform .2s;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .card:hover { border-color: ${C.borderHi}; box-shadow: 0 4px 16px rgba(26,86,219,0.08); }
    .tag {
      display: inline-flex; align-items: center;
      padding: 3px 10px; border-radius: 99px;
      font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
    }
  `;
  document.head.appendChild(el);
};

/* ── COMPONENTS ── */

function Logo({ size = 20 }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{
        width: size*1.8, height: size*1.8, borderRadius: 8,
        background: `linear-gradient(135deg, ${C.blue}, ${C.gold})`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: size*.7, fontFamily:"'Cormorant Garamond', serif", fontWeight:700, color:"#fff"
      }}>CF</div>
      <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:size, letterSpacing:-.5, color:C.white }}>
        CFA<span style={{ color:C.gold }}>prep</span>
      </span>
    </div>
  );
}

function ProgressRing({ pct, size=56, stroke=5, color=C.blue }) {
  const r = (size-stroke*2)/2;
  const circ = 2*Math.PI*r;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
        strokeLinecap="round" style={{ transition:"stroke-dashoffset .6s ease" }}/>
    </svg>
  );
}

function TopicBadge({ topic }) {
  const t = TOPICS.find(x=>x.id===topic) || TOPICS[0];
  return <span className="tag" style={{ background:`${t.color}22`, color:t.color, border:`1px solid ${t.color}44` }}>{t.name}</span>;
}

/* ── NAV ── */
function Nav({ screen, setScreen, lang, setLang, isPremium }) {
  const items = [
    { id:"dashboard", icon:"⊞", label:lang==="it"?"Dashboard":"Dashboard" },
    { id:"quiz",      icon:"❓", label:lang==="it"?"Quiz":"Quiz" },
    { id:"flashcard", icon:"🃏", label:lang==="it"?"Flashcard":"Flashcard" },
    { id:"exam",      icon:"📝", label:lang==="it"?"Esame":"Exam" },
    { id:"pricing",   icon:"⭐", label:lang==="it"?"Premium":"Premium" },
  ];
  return (
    <nav style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:100,
      background:`${C.surface}F0`, backdropFilter:"blur(20px)",
      borderTop:`1px solid ${C.border}`,
      display:"flex", justifyContent:"space-around", padding:"8px 0 max(8px,env(safe-area-inset-bottom))"
    }}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>setScreen(it.id)} style={{
          background:"none", border:"none", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", gap:3,
          padding:"4px 12px", borderRadius:10,
          color: screen===it.id ? (it.id==="pricing"?C.gold:C.blueHi) : C.gray,
          transition:"color .2s",
        }}>
          <span style={{ fontSize:18 }}>{it.icon}</span>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase" }}>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── LANDING ── */
function Landing({ setScreen, lang, setLang }) {
  const t = lang==="it";
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      {/* BG mesh */}
      <div style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"60vw", height:"60vw", borderRadius:"50%", background:`radial-gradient(circle, ${C.blue}10 0%, transparent 70%)` }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle, #2563EB0D 0%, transparent 70%)` }}/>
        {/* Grid lines */}
        {[...Array(6)].map((_,i)=>(
          <div key={i} style={{ position:"absolute", left:0, right:0, top:`${i*20}%`, height:1, background:`${C.border}88` }}/>
        ))}
      </div>

      <header style={{ position:"relative", zIndex:1, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <Logo/>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={()=>setLang(lang==="it"?"en":"it")} className="btn-ghost" style={{ padding:"6px 14px", fontSize:12 }}>
            {lang==="it"?"🇬🇧 EN":"🇮🇹 IT"}
          </button>
          <button onClick={()=>setScreen("login")} className="btn-primary" style={{ padding:"8px 18px" }}>
            {t?"Accedi":"Login"}
          </button>
        </div>
      </header>

      <main style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", zIndex:1, textAlign:"center" }}>
        <div className="tag" style={{ background:`${C.blue}12`, color:C.blue, border:`1px solid ${C.border}`, marginBottom:24, animation:"fadeUp .5s ease both" }}>
          {t?"🎓 CFA Level 1 — Oltre 2000 Domande":"🎓 CFA Level 1 — 2000+ Questions"}
        </div>

        <h1 style={{
          fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(36px,8vw,64px)",
          fontWeight:700, lineHeight:1.1, marginBottom:20,
          color: C.navy,
          animation:"fadeUp .5s ease .1s both"
        }}>
          {t ? <>Supera il CFA<br/><span style={{ color:C.blue }}>Level 1</span><br/>al primo tentativo</> :
               <>Pass the CFA<br/><span style={{ color:C.blue }}>Level 1</span><br/>on your first attempt</>}
        </h1>

        <p style={{ fontSize:16, color:C.gray, maxWidth:420, lineHeight:1.7, marginBottom:36, animation:"fadeUp .5s ease .2s both" }}>
          {t ? "Quiz adattivi, flashcard, simulatore d'esame e tracking dei progressi per tutti e 10 i topic CFA." :
               "Adaptive quizzes, flashcards, full exam simulator and progress tracking across all 10 CFA topics."}
        </p>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", animation:"fadeUp .5s ease .3s both" }}>
          <button onClick={()=>setScreen("register")} className="btn-primary" style={{ padding:"14px 32px", fontSize:16 }}>
            {t?"Inizia Gratis →":"Start Free →"}
          </button>
          <button onClick={()=>setScreen("pricing")} className="btn-ghost" style={{ padding:"14px 28px", fontSize:16 }}>
            {t?"Vedi i piani":"See pricing"}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginTop:56, maxWidth:440, width:"100%", animation:"fadeUp .5s ease .4s both" }}>
          {[
            { n:"2,000+", l:t?"Domande":"Questions" },
            { n:"10",     l:t?"Topic CFA":"CFA Topics" },
            { n:"180",    l:t?"Simulatore":"Exam Sim" },
          ].map((s,i)=>(
            <div key={i} className="card" style={{ padding:"18px 12px", textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:C.gold }}>{s.n}</div>
              <div style={{ fontSize:11, color:C.gray, fontWeight:600, letterSpacing:.5, marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({ setScreen, setActiveTopic, lang, isPremium, user }) {
  const t = lang==="it";
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Load real progress from Supabase
  useEffect(()=>{
    const loadProgress = async () => {
      const { data, error } = await supabase
        .from("user_progress")
        .select("topic, questions_answered, questions_correct");
      if (!error && data) {
        const map = {};
        data.forEach(row => {
          map[row.topic] = {
            answered: row.questions_answered,
            correct: row.questions_correct,
            pct: row.questions_answered > 0
              ? Math.round((row.questions_correct / row.questions_answered) * 100)
              : 0
          };
        });
        setProgress(map);
      }
      setLoading(false);
    };
    loadProgress();
  }, []);

  const totalAnswered = Object.values(progress).reduce((a,b)=>a+(b.answered||0), 0);
  const totalCorrect  = Object.values(progress).reduce((a,b)=>a+(b.correct||0), 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect/totalAnswered)*100) : 0;
  const overall  = TOPICS.length > 0
    ? Math.round(Object.values(progress).reduce((a,b)=>a+(b.pct||0),0) / TOPICS.length)
    : 0;

  return (
    <div style={{ padding:"24px 20px 90px", animation:"fadeIn .4s ease" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <div style={{ fontSize:11, color:C.gray, letterSpacing:2, textTransform:"uppercase", fontWeight:700 }}>{t?"Bentornato":"Welcome back"}</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, marginTop:2 }}>
            {user?.name || "Studente"}
          </div>
        </div>
        <div style={{ position:"relative" }}>
          <ProgressRing pct={overall} size={56} color={C.blue}/>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:C.blue, fontFamily:"'JetBrains Mono',monospace" }}>{overall}%</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
        {[
          { icon:"✅", val: loading?"…":totalAnswered, label:t?"Risposte":"Answered" },
          { icon:"🎯", val: loading?"…":`${accuracy}%`, label:t?"Accuracy":"Accuracy" },
          { icon:"📚", val: loading?"…":`${Object.keys(progress).length}/10`, label:t?"Topic":"Topics" },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ padding:"14px 10px", textAlign:"center", animation:`fadeUp .4s ease ${i*.08}s both` }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, fontWeight:500, color:C.white }}>{s.val}</div>
            <div style={{ fontSize:10, color:C.gray, fontWeight:600, letterSpacing:.5, textTransform:"uppercase", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Exam countdown */}
      <div className="card" style={{ padding:"16px 20px", marginBottom:24, background:`linear-gradient(135deg, ${C.navy}, ${C.blue})`, borderColor:C.blue, animation:"fadeUp .4s ease .15s both" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, color:"#93C5FD", letterSpacing:2, textTransform:"uppercase", fontWeight:700, marginBottom:4 }}>{t?"Prossimo Esame":"Next Exam"}</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:"#fff" }}>CFA Level I — Nov 2025</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:28, color:"#FCD34D", fontWeight:500 }}>
              {Math.max(0, Math.ceil((new Date("2025-11-15") - new Date()) / (1000*60*60*24)))}
            </div>
            <div style={{ fontSize:10, color:"#93C5FD", fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{t?"giorni":"days"}</div>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, letterSpacing:.5 }}>{t?"Topic":"Topics"}</h2>
          <span style={{ fontSize:12, color:C.gray }}>{t?"10 aree":"10 areas"}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {TOPICS.map((tp, i) => {
            const p = progress[tp.id] || { pct:0, answered:0 };
            const locked = !tp.free && !isPremium;
            const freeLabel = !isPremium && tp.free ? ` · ${FREE_QUESTIONS_PER_TOPIC} free` : "";
            return (
              <div key={tp.id} className="card" onClick={()=>{ if(!locked){setActiveTopic(tp.id);setScreen("quiz");} }}
                style={{ padding:"14px 16px", cursor:locked?"default":"pointer", opacity:locked?.65:1, animation:`fadeUp .4s ease ${i*.05}s both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ fontSize:22, width:36, textAlign:"center" }}>{tp.icon}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:locked?C.gray:C.white, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:"60%" }}>{tp.name}</span>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        {locked && <span style={{ fontSize:10 }}>🔒</span>}
                        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:locked?C.gray:tp.color }}>
                          {loading?"…":`${p.pct}%`}
                        </span>
                      </div>
                    </div>
                    <div style={{ height:4, background:C.border, borderRadius:99 }}>
                      <div style={{ height:"100%", width:`${p.pct}%`, background:locked?C.border:tp.color, borderRadius:99, transition:"width .6s ease" }}/>
                    </div>
                    <div style={{ fontSize:10, color:C.gray, marginTop:4 }}>
                      {locked
                        ? `🔒 ${t?"Sblocca con Premium":"Unlock with Premium"}`
                        : `${p.answered} ${t?"risposte":"answered"} · ${tp.total} ${t?"totali":"total"}${freeLabel}`}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isPremium && (
        <div className="card" onClick={()=>setScreen("pricing")} style={{
          padding:"18px 20px", cursor:"pointer", marginTop:8,
          background:`linear-gradient(135deg, ${C.blue}18, ${C.blue}08)`,
          borderColor:C.blue,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:28 }}>⭐</span>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:2 }}>{t?"Sblocca Premium":"Unlock Premium"}</div>
              <div style={{ fontSize:12, color:C.gray }}>{t?"Accedi a tutti i 2000+ quesiti":"Access all 2000+ questions"}</div>
            </div>
            <span style={{ marginLeft:"auto", color:C.blue, fontSize:18 }}>→</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── QUIZ ── */
function QuizScreen({ activeTopic, lang, isPremium }) {
  const t = lang==="it";
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState({ correct:0, total:0 });
  const [filter, setFilter] = useState(activeTopic||"all");
  const timerRef = useRef();

  const questions = MOCK_QUESTIONS.filter(q=>filter==="all"||q.topic===filter);
  const q = questions[qIdx % questions.length];
  const hitFreeLimit = !isPremium && qIdx >= FREE_QUESTIONS_PER_TOPIC;

  const reveal = () => { clearInterval(timerRef.current); setRevealed(true); };

  useEffect(()=>{
    setSelected(null); setRevealed(false); setTimeLeft(30);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(()=>{
      setTimeLeft(tl=>{ if(tl<=1){ reveal(); return 0; } return tl-1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[qIdx, filter]);

  const handleSelect = async (i) => {
    if(revealed||selected!==null) return;
    setSelected(i); reveal();
    const isCorrect = i === q.correct;
    setScore(s=>({ correct: s.correct+(isCorrect?1:0), total:s.total+1 }));

    // Save progress to Supabase (upsert per topic)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const topic = q.topic;
      // First get existing row
      const { data: existing } = await supabase
        .from("user_progress")
        .select("questions_answered, questions_correct")
        .eq("user_id", user.id)
        .eq("topic", topic)
        .single();

      const newAnswered = (existing?.questions_answered || 0) + 1;
      const newCorrect  = (existing?.questions_correct  || 0) + (isCorrect ? 1 : 0);

      await supabase.from("user_progress").upsert({
        user_id: user.id,
        topic,
        questions_answered: newAnswered,
        questions_correct:  newCorrect,
        last_activity: new Date().toISOString(),
      }, { onConflict: "user_id,topic" });
    }
  };

  const next = ()=>{ setQIdx(qi=>(qi+1)%questions.length); };

  const circ = 2*Math.PI*26;
  const letters=["A","B","C","D"];
  const optColor=(i)=>{
    if(!revealed) return selected===i?C.blue:C.border;
    if(i===q.correct) return C.green;
    if(i===selected) return C.red;
    return C.border;
  };

  return (
    <div style={{ padding:"20px 20px 90px", animation:"fadeIn .4s ease" }}>
      {/* Filters */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:20 }}>
        {[{id:"all",label:t?"Tutti":"All"}, ...TOPICS.slice(0,3)].map(tp=>(
          <button key={tp.id} onClick={()=>{ setFilter(tp.id); setQIdx(0); }}
            className={filter===tp.id?"btn-primary":"btn-ghost"}
            style={{ padding:"6px 14px", fontSize:11, whiteSpace:"nowrap", flexShrink:0 }}>
            {tp.label||tp.name}
          </button>
        ))}
        <button className="btn-ghost" style={{ padding:"6px 14px", fontSize:11, whiteSpace:"nowrap", flexShrink:0, opacity:.5 }}>
          🔒 {t?"Altro":"More"}
        </button>
      </div>

      {/* Free limit wall */}
      {hitFreeLimit ? (
        <div style={{ textAlign:"center", padding:"40px 20px", animation:"fadeIn .4s ease" }}>
          <div style={{ fontSize:56, marginBottom:16 }}>🔒</div>
          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.navy, marginBottom:10 }}>
            {t?"Hai usato le 15 domande gratuite":"You've used your 15 free questions"}
          </h3>
          <p style={{ fontSize:13, color:C.gray, lineHeight:1.7, marginBottom:28 }}>
            {t?`Sblocca tutti i ${TOPICS.find(tp=>tp.id===filter)?.total||2000}+ quesiti di questo topic con Premium.`:`Unlock all ${TOPICS.find(tp=>tp.id===filter)?.total||2000}+ questions in this topic with Premium.`}
          </p>
          <button className="btn-primary" style={{ padding:"14px 32px", fontSize:15 }} onClick={()=>setQIdx(0)}>
            ⭐ {t?"Scopri Premium":"See Premium Plans"}
          </button>
          <div style={{ marginTop:14 }}>
            <button className="btn-ghost" style={{ padding:"10px 20px", fontSize:12 }} onClick={()=>{ setFilter("all"); setQIdx(0); }}>
              {t?"Cambia topic":"Change topic"}
            </button>
          </div>
        </div>
      ) : (<>

      {/* Score bar */}
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
        {[
          { label:t?"Corrette":"Correct", val:score.correct, color:C.green },
          { label:t?"Totali":"Total",     val:score.total,   color:C.gray },
          { label:t?"Accuracy":"Accuracy", val:score.total?`${Math.round(score.correct/score.total*100)}%`:"—", color:C.blue },
        ].map((s,i)=>(
          <div key={i} className="card" style={{ flex:1, margin:i===1?"0 8px":"0", padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:18, color:s.color }}>{s.val}</div>
            <div style={{ fontSize:9, color:C.gray, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Free questions remaining */}
      {!isPremium && (
        <div style={{ marginBottom:12, padding:"8px 14px", borderRadius:8, background:C.blueDim, border:`1px solid ${C.border}`, fontSize:12, color:C.blue, fontWeight:600 }}>
          {t?`${FREE_QUESTIONS_PER_TOPIC - qIdx} domande gratuite rimanenti su questo topic`:`${FREE_QUESTIONS_PER_TOPIC - qIdx} free questions remaining in this topic`}
        </div>
      )}

      {/* Question card */}
      <div className="card" style={{ padding:"20px", marginBottom:16, animation:"scaleIn .3s ease" }}>
        {/* Timer */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <TopicBadge topic={q.topic}/>
          <div style={{ position:"relative", width:52, height:52, flexShrink:0 }}>
            <svg width="52" height="52" style={{ transform:"rotate(-90deg)" }}>
              <circle cx="26" cy="26" r="22" fill="none" stroke={C.border} strokeWidth="4"/>
              <circle cx="26" cy="26" r="22" fill="none"
                stroke={timeLeft>20?C.green:timeLeft>10?C.amber:C.red}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ*(1-timeLeft/30)}
                style={{ transition:"stroke-dashoffset 1s linear, stroke .5s" }}/>
            </svg>
            <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:C.white }}>
              {timeLeft}
            </div>
          </div>
        </div>

        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, lineHeight:1.65, color:C.white, marginBottom:20 }}>
          {q.q}
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>handleSelect(i)}
              style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"12px 14px", borderRadius:10, textAlign:"left",
                background: revealed&&i===q.correct?`${C.green}12`:revealed&&i===selected&&i!==q.correct?`${C.red}12`:C.surfaceUp,
                border:`1.5px solid ${optColor(i)}`,
                color:C.white, cursor:revealed?"default":"pointer",
                transition:"all .25s", animation:`fadeUp .3s ease ${i*.06}s both`,
                fontFamily:"'Syne',sans-serif", fontSize:13,
              }}>
              <span style={{
                width:28, height:28, borderRadius:7, flexShrink:0,
                background: revealed&&i===q.correct?C.green:revealed&&i===selected&&i!==q.correct?C.red:C.blueDim,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:"'JetBrains Mono',monospace", fontSize:12, fontWeight:500,
                color: revealed?(i===q.correct||i===selected)?"#fff":C.gray:C.blue,
                transition:"all .25s"
              }}>{letters[i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {revealed && (
        <div className="card" style={{ padding:"16px 18px", marginBottom:12, borderColor:`${C.blue}55`, animation:"scaleIn .3s ease" }}>
          <div style={{ fontSize:10, color:C.blue, letterSpacing:2, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>
            {t?"Spiegazione":"Explanation"}
          </div>
          <p style={{ fontSize:13, lineHeight:1.7, color:C.grayHi }}>{q.explanation}</p>
        </div>
      )}

      {revealed && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <div style={{ padding:"12px 16px", borderRadius:10,
            background:C.blueDim, border:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", gap:10, animation:"fadeUp .3s ease both" }}>
            <span style={{ fontSize:16 }}>📖</span>
            <span style={{ fontSize:12, color:C.blue, fontWeight:600 }}>
              {t?"Spiegazione completa nella descrizione del post":"Full explanation in the post description"}
            </span>
          </div>
          <button onClick={next} className="btn-primary" style={{ padding:"14px", fontSize:15, animation:"fadeUp .3s ease .1s both" }}>
            {t?"Prossima Domanda →":"Next Question →"}
          </button>
        </div>
      )}
      </>)}
    </div>
  );
}

/* ── FLASHCARDS ── */
function FlashcardScreen({ lang, isPremium }) {
  const t = lang==="it";
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const card = FLASHCARDS[idx % FLASHCARDS.length];

  const next = (knew) => {
    if(knew) setKnown(k=>[...k, card.id]);
    setFlipped(false);
    setTimeout(()=>setIdx(i=>(i+1)%FLASHCARDS.length),150);
  };

  return (
    <div style={{ padding:"24px 20px 90px", animation:"fadeIn .4s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700 }}>Flashcards</h2>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:C.gray }}>{idx+1}/{FLASHCARDS.length}</span>
      </div>

      {/* Progress */}
      <div style={{ height:3, background:C.border, borderRadius:99, marginBottom:28 }}>
        <div style={{ height:"100%", width:`${((idx+1)/FLASHCARDS.length)*100}%`, background:`linear-gradient(90deg,${C.blue},${C.gold})`, borderRadius:99, transition:"width .4s" }}/>
      </div>

      {/* Card */}
      <div onClick={()=>setFlipped(f=>!f)} style={{
        minHeight:260, padding:"28px 24px", borderRadius:20,
        background: flipped ? `linear-gradient(135deg,${C.navy},${C.blueDim})` : C.surface,
        border:`1.5px solid ${flipped?C.blueDim:C.border}`,
        cursor:"pointer", display:"flex", flexDirection:"column", justifyContent:"space-between",
        transition:"all .3s", animation:"scaleIn .3s ease",
        marginBottom:20
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <TopicBadge topic={card.topic}/>
          <span className="tag" style={{ background:`${C.gold}18`, color:C.gold, border:`1px solid ${C.goldDim}` }}>{card.tag}</span>
        </div>
        <div>
          <div style={{ fontSize:10, color:flipped?C.blueHi:C.gray, letterSpacing:2, textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>
            {flipped?(t?"RISPOSTA":"ANSWER"):(t?"DOMANDA":"QUESTION")}
          </div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:flipped?15:18, lineHeight:1.65, color:C.white, whiteSpace:"pre-line" }}>
            {flipped?card.back:card.front}
          </div>
        </div>
        <div style={{ textAlign:"center", fontSize:11, color:C.gray, marginTop:16 }}>
          {flipped?(t?"Tocca per la domanda":"Tap for question"):(t?"Tocca per la risposta":"Tap for answer")}
        </div>
      </div>

      {flipped && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, animation:"fadeUp .3s ease both" }}>
          <button onClick={()=>next(false)} className="btn-ghost" style={{ padding:"14px", borderColor:C.red, color:C.red }}>
            😕 {t?"Da ripassare":"Study more"}
          </button>
          <button onClick={()=>next(true)} className="btn-primary" style={{ padding:"14px", background:`linear-gradient(135deg,${C.green},#16A361)` }}>
            ✓ {t?"Lo so":"Got it!"}
          </button>
        </div>
      )}

      {!isPremium && (
        <div className="card" style={{ marginTop:24, padding:"16px", borderColor:C.blue, background:C.blueDim }}>
          <div style={{ fontSize:13, color:C.blue, fontWeight:700, marginBottom:4 }}>🔒 {t?"Solo 3 flashcard gratuite":"Only 3 free flashcards"}</div>
          <div style={{ fontSize:12, color:C.gray }}>{t?"Sblocca tutte le 500+ flashcard con Premium":"Unlock all 500+ flashcards with Premium"}</div>
        </div>
      )}
    </div>
  );
}

/* ── EXAM SIMULATOR ── */
function ExamScreen({ lang, isPremium, setScreen }) {
  const t = lang==="it";
  const [phase, setPhase] = useState("intro"); // intro | session | done
  const [session, setSession] = useState(1); // 1 or 2
  const [qIdx, setQIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const timerRef = useRef();

  const totalTime = 270*60;

  useEffect(()=>{
    if(phase==="session"){
      timerRef.current=setInterval(()=>setElapsed(e=>e+1),1000);
    }
    return ()=>clearInterval(timerRef.current);
  },[phase]);

  const fmtTime=(s)=>`${String(Math.floor((totalTime-s)/3600)).padStart(2,"0")}:${String(Math.floor(((totalTime-s)%3600)/60)).padStart(2,"0")}:${String((totalTime-s)%60).padStart(2,"0")}`;

  if(!isPremium) return (
    <div style={{ padding:"40px 24px 90px", display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", animation:"fadeIn .4s ease" }}>
      <div style={{ fontSize:64, marginBottom:20 }}>🔒</div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, marginBottom:12 }}>{t?"Simulatore Esame":"Exam Simulator"}</h2>
      <p style={{ fontSize:14, color:C.gray, lineHeight:1.7, marginBottom:32, maxWidth:340 }}>
        {t?"Il simulatore d'esame completo (180 domande, 2 sessioni da 270 minuti) è disponibile solo con Premium.":"The full exam simulator (180 questions, 2 × 270-minute sessions) is available with Premium only."}
      </p>
      <button onClick={()=>setScreen("pricing")} className="btn-primary" style={{ padding:"14px 32px", fontSize:15 }}>
        {t?"Sblocca Premium →":"Unlock Premium →"}
      </button>
    </div>
  );

  if(phase==="intro") return (
    <div style={{ padding:"24px 20px 90px", animation:"fadeIn .4s ease" }}>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, marginBottom:6 }}>{t?"Simulatore d'Esame":"Exam Simulator"}</h2>
      <p style={{ fontSize:13, color:C.gray, marginBottom:28, lineHeight:1.6 }}>
        {t?"Replica esatta dell'esame CFA Level I. 2 sessioni da 90 domande, 270 minuti ciascuna.":"Exact replica of the CFA Level I exam. 2 sessions of 90 questions, 270 minutes each."}
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:32 }}>
        {[
          { icon:"📝", title:t?"180 Domande Total":"180 Total Questions", desc:t?"90 per sessione, come il vero esame":"90 per session, just like the real exam" },
          { icon:"⏱️", title:t?"270 Minuti per Sessione":"270 Minutes per Session", desc:t?"1.5 minuti a domanda":"1.5 minutes per question" },
          { icon:"📊", title:t?"Report Dettagliato":"Detailed Report", desc:t?"Analisi per topic e weak areas":"Topic-by-topic breakdown + weak areas" },
          { icon:"🎯", title:t?"Benchmark 70%":"70% Benchmark", desc:t?"Il passing score CFA stimato":"Estimated CFA passing score" },
        ].map((it,i)=>(
          <div key={i} className="card" style={{ padding:"14px 16px", display:"flex", gap:14, alignItems:"center", animation:`fadeUp .4s ease ${i*.08}s both` }}>
            <span style={{ fontSize:24 }}>{it.icon}</span>
            <div>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:2 }}>{it.title}</div>
              <div style={{ fontSize:12, color:C.gray }}>{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={()=>setPhase("session")} className="btn-primary" style={{ width:"100%", padding:"15px", fontSize:16 }}>
        {t?"Inizia Sessione 1 →":"Start Session 1 →"}
      </button>
    </div>
  );

  const q = MOCK_QUESTIONS[qIdx % MOCK_QUESTIONS.length];
  return (
    <div style={{ padding:"16px 20px 90px", animation:"fadeIn .4s ease" }}>
      {/* Exam header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16,
        padding:"12px 16px", borderRadius:12, background:C.surface, border:`1px solid ${C.border}` }}>
        <div>
          <div style={{ fontSize:10, color:C.gray, letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>{t?"Sessione":"Session"} {session}/2</div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:C.white, marginTop:2 }}>Q {qIdx+1}/90</div>
        </div>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, color: elapsed>totalTime*.8?C.red:C.gold }}>{fmtTime(elapsed)}</div>
          <div style={{ fontSize:9, color:C.gray, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{t?"Tempo rimanente":"Time remaining"}</div>
        </div>
        <button onClick={()=>setPhase("done")} className="btn-ghost" style={{ padding:"6px 12px", fontSize:11, borderColor:C.red, color:C.red }}>
          {t?"Fine":"End"}
        </button>
      </div>

      {/* Progress */}
      <div style={{ height:2, background:C.border, borderRadius:99, marginBottom:20 }}>
        <div style={{ height:"100%", width:`${((qIdx+1)/90)*100}%`, background:C.blue, borderRadius:99, transition:"width .3s" }}/>
      </div>

      <div className="card" style={{ padding:"20px", marginBottom:14 }}>
        <TopicBadge topic={q.topic}/>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, lineHeight:1.7, color:C.white, margin:"16px 0" }}>{q.q}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>setSelected(i)} style={{
              padding:"12px 14px", borderRadius:10, textAlign:"left",
              background:selected===i?`${C.blue}22`:C.surfaceUp,
              border:`1.5px solid ${selected===i?C.blue:C.border}`,
              color:C.white, cursor:"pointer", fontSize:13,
              fontFamily:"'Syne',sans-serif", display:"flex", gap:10, alignItems:"center",
              transition:"all .2s"
            }}>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", color:selected===i?C.blueHi:C.gray, fontSize:12, minWidth:16 }}>{"ABCD"[i]}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button onClick={()=>setQIdx(i=>i+1)} className="btn-primary" style={{ width:"100%", padding:"13px", fontSize:14 }}>
        {t?"Successiva →":"Next →"}
      </button>
    </div>
  );
}

/* ── PRICING ── */
function PricingScreen({ lang, setIsPremium, user }) {
  const t = lang==="it";
  const [billing, setBilling] = useState("monthly");

  const plans = [
    {
      name:"Free", price:0, period:"",
      features: t
        ? ["30 domande gratuite","3 topic sbloccati","5 flashcard","Nessuna simulazione esame"]
        : ["30 free questions","3 unlocked topics","5 flashcards","No exam simulator"],
      locked:[t?"Topic avanzati":"Advanced topics",t?"Simulatore esame":"Exam simulator",t?"Statistiche complete":"Full analytics"],
      cta: t?"Inizia Gratis":"Start Free", primary:false
    },
    {
      name:"Premium", price:billing==="monthly"?29:19, period:t?`/mese${billing==="annual"?" × 12":""}`:"/mo",
      badge:t?"Più popolare":"Most popular",
      features: t
        ? ["2000+ domande CFA Level I","Tutti i 10 topic","500+ flashcard","Simulatore esame completo","Analytics per topic","Weak area detection","Aggiornamenti gratuiti","IT & EN"]
        : ["2000+ CFA Level I questions","All 10 topics","500+ flashcards","Full exam simulator","Per-topic analytics","Weak area detection","Free updates","IT & EN"],
      cta:t?"Inizia ora →":"Get started →", primary:true
    }
  ];

  return (
    <div style={{ padding:"24px 20px 90px", animation:"fadeIn .4s ease" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div className="tag" style={{ background:`${C.blue}12`, color:C.blue, border:`1px solid ${C.border}`, marginBottom:12 }}>
          {t?"Prezzi":"Pricing"}
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, marginBottom:8 }}>
          {t?"Scegli il tuo piano":"Choose your plan"}
        </h2>
        <p style={{ fontSize:13, color:C.gray }}>{t?"Nessuna sorpresa. Cancella quando vuoi.":"No surprises. Cancel anytime."}</p>
      </div>

      {/* Billing toggle */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <div style={{ display:"flex", background:C.surface, borderRadius:10, padding:4, border:`1px solid ${C.border}` }}>
          {["monthly","annual"].map(b=>(
            <button key={b} onClick={()=>setBilling(b)}
              style={{
                padding:"8px 18px", borderRadius:8, border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
                background:billing===b?C.blue:"transparent",
                color:billing===b?C.white:C.gray, transition:"all .2s", fontFamily:"'Syne',sans-serif"
              }}>
              {b==="monthly"?(t?"Mensile":"Monthly"):(t?"Annuale -35%":"Annual -35%")}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        {plans.map((plan,i)=>(
          <div key={i} className="card" style={{
            padding:"22px 20px",
            border:`1.5px solid ${plan.primary?C.blue:C.border}`,
            background:plan.primary?`linear-gradient(135deg,${C.navy},${C.blue})`:C.surface,
            position:"relative", animation:`fadeUp .4s ease ${i*.1}s both`
          }}>
            {plan.badge && (
              <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)" }}>
                <span className="tag" style={{ background:C.blue, color:C.white, padding:"4px 14px" }}>{plan.badge}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:800, letterSpacing:.5 }}>{plan.name}</div>
                {plan.price===0 && <div style={{ fontSize:12, color:C.gray, marginTop:2 }}>{t?"Per sempre gratis":"Free forever"}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:plan.primary?C.gold:C.white }}>
                  {plan.price===0?"€0":`€${plan.price}`}
                </span>
                <span style={{ fontSize:12, color:C.gray }}>{plan.period}</span>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {plan.features.map((f,j)=>(
                <div key={j} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13 }}>
                  <span style={{ color:plan.primary?C.green:C.gray, fontSize:14 }}>✓</span>
                  <span style={{ color:plan.primary?C.white:C.grayHi }}>{f}</span>
                </div>
              ))}
              {plan.locked?.map((f,j)=>(
                <div key={j} style={{ display:"flex", gap:8, alignItems:"center", fontSize:13, opacity:.5 }}>
                  <span style={{ color:C.gray, fontSize:14 }}>✗</span>
                  <span style={{ color:C.gray }}>{f}</span>
                </div>
              ))}
            </div>

            <button onClick={()=>{
                if(!plan.primary) return;
                const baseUrl = billing==="monthly"
                  ? "https://cfaprep.lemonsqueezy.com/checkout/buy/544c4577-6dd6-45db-ad74-2160893257c6"
                  : "https://cfaprep.lemonsqueezy.com/checkout/buy/327777c9-c76d-4018-9cec-103b8c7d32b2";
                const params = new URLSearchParams();
                if(user?.email) params.set("checkout[email]", user.email);
                if(user?.id) params.set("checkout[custom][user_id]", user.id);
                const url = `${baseUrl}?${params.toString()}`;
                window.location.href = url;
              }}
              className={plan.primary?"btn-primary":"btn-ghost"}
              style={{ width:"100%", padding:"13px", fontSize:14,
                background:plan.primary?`linear-gradient(135deg,${C.blue},${C.blueHi})`:undefined }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={{ textAlign:"center", marginTop:20, fontSize:12, color:C.gray, lineHeight:1.8 }}>
        🔒 {t?"Pagamento sicuro via Lemon Squeezy":"Secure payment via Lemon Squeezy"}<br/>
        {t?"Garanzia 7 giorni soddisfatti o rimborsati":"7-day money-back guarantee"}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AUTH SCREENS
───────────────────────────────────────────── */

/* shared input style */
const inputStyle = (focused) => ({
  width:"100%", padding:"13px 16px", borderRadius:10, fontSize:14,
  fontFamily:"'Syne',sans-serif", color:C.white, background:C.surfaceUp,
  border:`1.5px solid ${focused ? C.blue : C.border}`,
  outline:"none", transition:"border-color .2s",
  boxShadow: focused ? `0 0 0 3px ${C.blue}18` : "none",
});

function AuthInput({ label, type="text", value, onChange, placeholder, hint }) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.grayHi, marginBottom:6, letterSpacing:.3 }}>
        {label}
      </label>
      <div style={{ position:"relative" }}>
        <input
          type={isPassword && show ? "text" : type}
          value={value} onChange={onChange}
          placeholder={placeholder}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={inputStyle(focused)}
        />
        {isPassword && (
          <button onClick={()=>setShow(s=>!s)} style={{
            position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", cursor:"pointer", color:C.gray, fontSize:16,
          }}>{show?"🙈":"👁️"}</button>
        )}
      </div>
      {hint && <div style={{ fontSize:11, color:C.gray, marginTop:4 }}>{hint}</div>}
    </div>
  );
}

function AuthDivider({ lang }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
      <div style={{ flex:1, height:1, background:C.border }}/>
      <span style={{ fontSize:11, color:C.gray, fontWeight:600 }}>{lang==="it"?"oppure":"or"}</span>
      <div style={{ flex:1, height:1, background:C.border }}/>
    </div>
  );
}

function GoogleBtn({ lang, onClick }) {
  return (
    <button onClick={onClick} className="btn-ghost" style={{
      width:"100%", padding:"13px", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:10,
    }}>
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.7 2.5 30.2 0 24 0 14.8 0 6.9 5.4 2.9 13.3l7.8 6C12.5 13 17.8 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17z"/>
        <path fill="#FBBC05" d="M10.7 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.2-6z"/>
        <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.3-9.9l-8.2 6C6.9 42.6 14.8 48 24 48z"/>
      </svg>
      {lang==="it"?"Continua con Google":"Continue with Google"}
    </button>
  );
}

/* ── LOGIN ── */
function LoginScreen({ setScreen, setUser, lang }) {
  const t = lang==="it";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError(t?"Compila tutti i campi":"Fill in all fields"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    setUser({ email: data.user.email, name: data.user.user_metadata?.full_name || data.user.email.split("@")[0], isPremium: false });
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    setLoading(false);
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:C.bg }}>
      {/* Header */}
      <div style={{ padding:"24px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Logo size={18}/>
        <button onClick={()=>setScreen("landing")} className="btn-ghost" style={{ padding:"6px 12px", fontSize:12 }}>
          ← {t?"Torna":"Back"}
        </button>
      </div>

      <div style={{ flex:1, padding:"32px 24px 40px", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:440, margin:"0 auto", width:"100%" }}>
        {/* Title */}
        <div style={{ marginBottom:32, animation:"fadeUp .4s ease both" }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:C.navy, marginBottom:6 }}>
            {t?"Bentornato":"Welcome back"} 👋
          </h1>
          <p style={{ fontSize:14, color:C.gray, lineHeight:1.6 }}>
            {t?"Accedi al tuo account CFAprep":"Sign in to your CFAprep account"}
          </p>
        </div>

        {/* Google */}
        <div style={{ animation:"fadeUp .4s ease .05s both" }}>
          <GoogleBtn lang={lang} onClick={handleGoogle}/>
        </div>

        <AuthDivider lang={lang}/>

        {/* Form */}
        <div style={{ animation:"fadeUp .4s ease .1s both" }}>
          <AuthInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="mario@email.com"/>
          <AuthInput label={t?"Password":"Password"} type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••"/>

          <div style={{ textAlign:"right", marginTop:-8, marginBottom:20 }}>
            <button onClick={()=>setScreen("forgot")} style={{ background:"none", border:"none", color:C.blue, fontSize:12, cursor:"pointer", fontWeight:600 }}>
              {t?"Password dimenticata?":"Forgot password?"}
            </button>
          </div>

          {error && (
            <div style={{ padding:"10px 14px", borderRadius:8, background:`${C.red}12`, border:`1px solid ${C.red}44`, fontSize:13, color:C.red, marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} className="btn-primary"
            style={{ width:"100%", padding:"14px", fontSize:15, opacity:loading?.7:1 }}>
            {loading ? (t?"Accesso in corso...":"Signing in...") : (t?"Accedi →":"Sign in →")}
          </button>
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:13, color:C.gray, animation:"fadeUp .4s ease .15s both" }}>
          {t?"Non hai un account?":"Don't have an account?"}{" "}
          <button onClick={()=>setScreen("register")} style={{ background:"none", border:"none", color:C.blue, fontWeight:700, cursor:"pointer", fontSize:13 }}>
            {t?"Registrati":"Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── REGISTER ── */
function RegisterScreen({ setScreen, setUser, lang }) {
  const t = lang==="it";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1=form, 2=verify email

  const handleRegister = async () => {
    if (!name || !email || !password) { setError(t?"Compila tutti i campi":"Fill in all fields"); return; }
    if (password !== confirm) { setError(t?"Le password non coincidono":"Passwords don't match"); return; }
    if (password.length < 8) { setError(t?"Password minimo 8 caratteri":"Password must be at least 8 characters"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setLoading(false);
    setStep(2);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.href } });
    setLoading(false);
  };

  if (step===2) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:C.bg, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:20, animation:"fadeUp .4s ease both" }}>📧</div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:C.navy, marginBottom:10, animation:"fadeUp .4s ease .05s both" }}>
        {t?"Controlla la tua email":"Check your email"}
      </h2>
      <p style={{ fontSize:14, color:C.gray, lineHeight:1.7, maxWidth:320, marginBottom:32, animation:"fadeUp .4s ease .1s both" }}>
        {t?`Abbiamo inviato un link di conferma a ${email}. Clicca il link per attivare il tuo account.`
           :`We sent a confirmation link to ${email}. Click the link to activate your account.`}
      </p>
      <div style={{ animation:"fadeUp .4s ease .15s both", display:"flex", flexDirection:"column", gap:10, width:"100%", maxWidth:320 }}>
        <button onClick={()=>setScreen("login")} className="btn-primary" style={{ padding:"13px", fontSize:15 }}>
          {t?"Vai al login →":"Go to login →"}
        </button>
        <button onClick={()=>setStep(1)} className="btn-ghost" style={{ padding:"11px", fontSize:13 }}>
          {t?"Riprova con un'altra email":"Try another email"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"24px 24px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <Logo size={18}/>
        <button onClick={()=>setScreen("login")} className="btn-ghost" style={{ padding:"6px 12px", fontSize:12 }}>
          ← {t?"Accedi":"Sign in"}
        </button>
      </div>

      <div style={{ flex:1, padding:"32px 24px 40px", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:440, margin:"0 auto", width:"100%" }}>
        <div style={{ marginBottom:32, animation:"fadeUp .4s ease both" }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:700, color:C.navy, marginBottom:6 }}>
            {t?"Crea il tuo account":"Create your account"} 🎓
          </h1>
          <p style={{ fontSize:14, color:C.gray }}>
            {t?"Inizia gratis, nessuna carta richiesta":"Start free, no credit card required"}
          </p>
        </div>

        <div style={{ animation:"fadeUp .4s ease .05s both" }}>
          <GoogleBtn lang={lang} onClick={handleGoogle}/>
        </div>
        <AuthDivider lang={lang}/>

        <div style={{ animation:"fadeUp .4s ease .1s both" }}>
          <AuthInput label={t?"Nome completo":"Full name"} value={name} onChange={e=>setName(e.target.value)} placeholder="Mario Rossi"/>
          <AuthInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="mario@email.com"/>
          <AuthInput label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Minimo 8 caratteri" hint={t?"Minimo 8 caratteri":"At least 8 characters"}/>
          <AuthInput label={t?"Conferma password":"Confirm password"} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)}
            placeholder="••••••••"/>

          {error && (
            <div style={{ padding:"10px 14px", borderRadius:8, background:`${C.red}12`, border:`1px solid ${C.red}44`, fontSize:13, color:C.red, marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleRegister} disabled={loading} className="btn-primary"
            style={{ width:"100%", padding:"14px", fontSize:15, opacity:loading?.7:1 }}>
            {loading ? (t?"Creazione account...":"Creating account...") : (t?"Crea account →":"Create account →")}
          </button>

          <p style={{ fontSize:11, color:C.gray, textAlign:"center", marginTop:14, lineHeight:1.6 }}>
            {t?"Registrandoti accetti i nostri":"By registering you agree to our"}{" "}
            <span style={{ color:C.blue, cursor:"pointer" }}>{t?"Termini di Servizio":"Terms of Service"}</span>{" "}
            {t?"e la":"and"}{" "}
            <span style={{ color:C.blue, cursor:"pointer" }}>{t?"Privacy Policy":"Privacy Policy"}</span>
          </p>
        </div>

        <div style={{ textAlign:"center", marginTop:20, fontSize:13, color:C.gray }}>
          {t?"Hai già un account?":"Already have an account?"}{" "}
          <button onClick={()=>setScreen("login")} style={{ background:"none", border:"none", color:C.blue, fontWeight:700, cursor:"pointer", fontSize:13 }}>
            {t?"Accedi":"Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── FORGOT PASSWORD ── */
function ForgotScreen({ setScreen, lang }) {
  const t = lang==="it";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.href });
    setLoading(false); setSent(true);
  };

  if (sent) return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", background:C.bg, textAlign:"center" }}>
      <div style={{ fontSize:64, marginBottom:20 }}>✅</div>
      <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:C.navy, marginBottom:10 }}>
        {t?"Email inviata!":"Email sent!"}
      </h2>
      <p style={{ fontSize:14, color:C.gray, lineHeight:1.7, maxWidth:300, marginBottom:28 }}>
        {t?`Controlla ${email} per il link di reset della password.`:`Check ${email} for the password reset link.`}
      </p>
      <button onClick={()=>setScreen("login")} className="btn-primary" style={{ padding:"13px 28px" }}>
        {t?"Torna al login":"Back to login"}
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:C.bg }}>
      <div style={{ padding:"24px 24px 0", display:"flex", alignItems:"center" }}>
        <button onClick={()=>setScreen("login")} className="btn-ghost" style={{ padding:"6px 12px", fontSize:12 }}>
          ← {t?"Torna al login":"Back to login"}
        </button>
      </div>
      <div style={{ flex:1, padding:"32px 24px", display:"flex", flexDirection:"column", justifyContent:"center", maxWidth:440, margin:"0 auto", width:"100%" }}>
        <div style={{ marginBottom:32, animation:"fadeUp .4s ease both" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔑</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:700, color:C.navy, marginBottom:8 }}>
            {t?"Password dimenticata?":"Forgot password?"}
          </h1>
          <p style={{ fontSize:14, color:C.gray, lineHeight:1.6 }}>
            {t?"Inserisci la tua email e ti mandiamo un link per reimpostare la password.":"Enter your email and we'll send you a reset link."}
          </p>
        </div>

        <div style={{ animation:"fadeUp .4s ease .1s both" }}>
          <AuthInput label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="mario@email.com"/>
          <button onClick={handleReset} disabled={loading||!email} className="btn-primary"
            style={{ width:"100%", padding:"14px", fontSize:15, opacity:(loading||!email)?.6:1 }}>
            {loading?(t?"Invio in corso...":"Sending..."):(t?"Invia link reset →":"Send reset link →")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── PROFILE ── */
function ProfileScreen({ user, setUser, setScreen, lang, isPremium }) {
  const t = lang==="it";
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen("landing");
  };

  const stats = [
    { icon:"🔥", label:t?"Streak":"Streak",    val:"12 gg" },
    { icon:"✅", label:t?"Risposte":"Answered", val:"347" },
    { icon:"🎯", label:"Accuracy",              val:"71%" },
    { icon:"📚", label:t?"Topic":"Topics",       val:"3/10" },
  ];

  return (
    <div style={{ padding:"24px 20px 90px", animation:"fadeIn .4s ease" }}>
      {/* Avatar + name */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28, paddingTop:8 }}>
        <div style={{
          width:80, height:80, borderRadius:"50%", marginBottom:14,
          background:`linear-gradient(135deg, ${C.blue}, ${C.navy})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:32, fontWeight:700, color:"#fff",
          boxShadow:`0 4px 20px ${C.blue}33`,
          animation:"fadeUp .4s ease both"
        }}>
          {user.name?.[0]?.toUpperCase()||"U"}
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.navy, marginBottom:4, animation:"fadeUp .4s ease .05s both" }}>
          {user.name}
        </h2>
        <div style={{ fontSize:13, color:C.gray, animation:"fadeUp .4s ease .1s both" }}>{user.email}</div>
        {isPremium && (
          <span className="tag" style={{ background:`${C.blue}15`, color:C.blue, border:`1px solid ${C.border}`, marginTop:10, animation:"fadeUp .4s ease .15s both" }}>
            ⭐ Premium
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24 }}>
        {stats.map((s,i)=>(
          <div key={i} className="card" style={{ padding:"16px", animation:`fadeUp .4s ease ${i*.06}s both` }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{s.icon}</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:20, color:C.navy, fontWeight:500 }}>{s.val}</div>
            <div style={{ fontSize:11, color:C.gray, fontWeight:600, letterSpacing:.5, textTransform:"uppercase", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Settings list */}
      <div style={{ display:"flex", flexDirection:"column", gap:2, marginBottom:20 }}>
        {[
          { icon:"🌐", label:t?"Lingua":"Language", val:lang==="it"?"Italiano":"English", action:null },
          { icon:"🔔", label:t?"Notifiche":"Notifications", val:t?"Attive":"On", action:null },
          { icon:"📅", label:t?"Data esame":"Exam date", val:"Nov 2025", action:null },
          { icon:"🔒", label:t?"Cambia password":"Change password", val:"", action:()=>setScreen("forgot") },
        ].map((item,i)=>(
          <button key={i} onClick={item.action||undefined} className="card" style={{
            padding:"14px 16px", display:"flex", alignItems:"center", gap:12,
            cursor:item.action?"pointer":"default", background:C.surface,
            border:`1px solid ${C.border}`, borderRadius:12, textAlign:"left", width:"100%"
          }}>
            <span style={{ fontSize:18 }}>{item.icon}</span>
            <span style={{ flex:1, fontSize:14, color:C.white, fontWeight:500 }}>{item.label}</span>
            <span style={{ fontSize:13, color:C.gray }}>{item.val} {item.action&&"→"}</span>
          </button>
        ))}
      </div>

      {/* Premium CTA if free */}
      {!isPremium && (
        <div className="card" onClick={()=>setScreen("pricing")} style={{
          padding:"16px 18px", cursor:"pointer", marginBottom:16,
          background:`linear-gradient(135deg,${C.blue}18,${C.blue}08)`,
          borderColor:C.blue
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>⭐</span>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:C.blue, marginBottom:2 }}>{t?"Passa a Premium":"Upgrade to Premium"}</div>
              <div style={{ fontSize:12, color:C.gray }}>{t?"Da €29/mese · Cancella quando vuoi":"From €29/mo · Cancel anytime"}</div>
            </div>
            <span style={{ marginLeft:"auto", color:C.blue }}>→</span>
          </div>
        </div>
      )}

      {/* Logout */}
      <button onClick={()=>setShowLogout(true)} className="btn-ghost"
        style={{ width:"100%", padding:"13px", borderColor:C.red, color:C.red }}>
        {t?"Esci dall'account":"Sign out"}
      </button>

      {/* Logout confirm modal */}
      {showLogout && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:200,
          display:"flex", alignItems:"flex-end", justifyContent:"center",
          animation:"fadeIn .2s ease"
        }} onClick={()=>setShowLogout(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:C.surface, borderRadius:"20px 20px 0 0", padding:"28px 24px 40px",
            width:"100%", maxWidth:480, animation:"fadeUp .3s ease both"
          }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700, color:C.navy, marginBottom:8 }}>
              {t?"Vuoi uscire?":"Sign out?"}
            </div>
            <p style={{ fontSize:14, color:C.gray, marginBottom:24 }}>
              {t?"I tuoi progressi sono salvati e potrai rientrare in qualsiasi momento.":"Your progress is saved. You can sign back in anytime."}
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setShowLogout(false)} className="btn-ghost" style={{ flex:1, padding:"13px" }}>
                {t?"Annulla":"Cancel"}
              </button>
              <button onClick={handleLogout} style={{
                flex:1, padding:"13px", borderRadius:10, border:"none",
                background:C.red, color:"#fff", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:14, cursor:"pointer"
              }}>
                {t?"Esci":"Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── APP ── */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [lang, setLang] = useState("it");
  const [isPremium, setIsPremium] = useState(false);
  const [activeTopic, setActiveTopic] = useState("all");
  const [user, setUser] = useState(null); // null = not logged in

  useEffect(()=>{ injectStyles(); },[]);

  // Supabase session persistence — restores login on page reload
  useEffect(()=>{
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          isPremium: false,
        });
        setScreen("dashboard");
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email.split("@")[0],
          isPremium: false,
        });
        if (screen === "landing" || screen === "login" || screen === "register") setScreen("dashboard");
      } else {
        setUser(null);
        setScreen("landing");
      }
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line
  },[]);

  // Auth screens (no nav)
  const authScreens = ["landing","login","register","forgot"];
  const showNav = !authScreens.includes(screen) && !!user;

  // Auto-redirect after login
  const handleSetUser = (u) => {
    setUser(u);
    setScreen("dashboard");
  };

  // Nav items (profile replaces the old account icon)
  const navItems = [
    { id:"dashboard", icon:"⊞", labelIt:"Dashboard", labelEn:"Dashboard" },
    { id:"quiz",      icon:"❓", labelIt:"Quiz",      labelEn:"Quiz" },
    { id:"flashcard", icon:"🃏", labelIt:"Flashcard", labelEn:"Flashcard" },
    { id:"exam",      icon:"📝", labelIt:"Esame",     labelEn:"Exam" },
    { id:"profile",   icon:"👤", labelIt:"Profilo",   labelEn:"Profile" },
  ];

  return (
    <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100vh", position:"relative", background:C.bg }}>

      {/* Top bar */}
      {showNav && (
        <div style={{
          position:"sticky", top:0, zIndex:50,
          padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center",
          background:`${C.surface}F2`, backdropFilter:"blur(20px)",
          borderBottom:`1px solid ${C.border}`
        }}>
          <Logo size={16}/>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>setLang(l=>l==="it"?"en":"it")} className="btn-ghost" style={{ padding:"5px 10px", fontSize:11 }}>
              {lang==="it"?"🇬🇧":"🇮🇹"}
            </button>
            {isPremium
              ? <span className="tag" style={{ background:`${C.blue}15`, color:C.blue, border:`1px solid ${C.border}` }}>⭐ PRO</span>
              : <button onClick={()=>setScreen("pricing")} className="btn-primary" style={{ padding:"6px 12px", fontSize:11 }}>
                  {lang==="it"?"Premium":"Premium"}
                </button>
            }
          </div>
        </div>
      )}

      {/* Screens */}
      {screen==="landing"   && <Landing       setScreen={setScreen} lang={lang} setLang={setLang}/>}
      {screen==="login"     && <LoginScreen    setScreen={setScreen} setUser={handleSetUser} lang={lang}/>}
      {screen==="register"  && <RegisterScreen setScreen={setScreen} setUser={handleSetUser} lang={lang}/>}
      {screen==="forgot"    && <ForgotScreen   setScreen={setScreen} lang={lang}/>}

      {user && screen==="dashboard" && <Dashboard    setScreen={setScreen} setActiveTopic={setActiveTopic} lang={lang} isPremium={isPremium} user={user}/>}
      {user && screen==="quiz"      && <QuizScreen   activeTopic={activeTopic} lang={lang} isPremium={isPremium}/>}
      {user && screen==="flashcard" && <FlashcardScreen lang={lang} isPremium={isPremium}/>}
      {user && screen==="exam"      && <ExamScreen   lang={lang} isPremium={isPremium} setScreen={setScreen}/>}
      {user && screen==="pricing"   && <PricingScreen lang={lang} setIsPremium={(v)=>{setIsPremium(v);setScreen("dashboard");}} user={user}/>}
      {user && screen==="profile"   && <ProfileScreen user={user} setUser={setUser} setScreen={setScreen} lang={lang} isPremium={isPremium}/>}

      {/* Bottom nav */}
      {showNav && (
        <nav style={{
          position:"fixed", bottom:0, left:0, right:0, zIndex:100,
          background:`${C.surface}F0`, backdropFilter:"blur(20px)",
          borderTop:`1px solid ${C.border}`,
          display:"flex", justifyContent:"space-around",
          padding:"8px 0 max(8px,env(safe-area-inset-bottom))",
          maxWidth:480, margin:"0 auto"
        }}>
          {navItems.map(it=>(
            <button key={it.id} onClick={()=>setScreen(it.id)} style={{
              background:"none", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              padding:"4px 12px", borderRadius:10,
              color: screen===it.id ? C.blue : C.gray,
              transition:"color .2s",
            }}>
              <span style={{ fontSize:18 }}>{it.icon}</span>
              <span style={{ fontSize:9, fontWeight:700, letterSpacing:.5, textTransform:"uppercase" }}>
                {lang==="it"?it.labelIt:it.labelEn}
              </span>
            </button>
          ))}
        </nav>
      )}

      {/* Landing CTA buttons */}
      {screen==="landing" && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:480, margin:"0 auto",
          padding:"16px 20px", background:`${C.surface}F2`, backdropFilter:"blur(20px)", borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <button onClick={()=>setScreen("register")} className="btn-primary" style={{ padding:"13px", fontSize:14 }}>
              {lang==="it"?"Registrati gratis":"Sign up free"}
            </button>
            <button onClick={()=>setScreen("login")} className="btn-ghost" style={{ padding:"13px", fontSize:14 }}>
              {lang==="it"?"Accedi":"Sign in"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
