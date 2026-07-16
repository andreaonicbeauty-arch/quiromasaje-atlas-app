import React, { useMemo, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Download,
  Grid2X2,
  HelpCircle,
  HeartPulse,
  Home,
  Maximize2,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { atlasContent } from "./content";
import "./style.css";

type AtlasItem = {
  id: string;
  title: string;
  category: "muscle" | "massage";
  order: number;
  image: string;
  pdf: string;
  summary: string;
};

type View = "home" | "massages" | "library" | "exam" | "test";

type ExamMuscle = {
  id: string;
  title: string;
  note?: string;
  origin: string;
  destination: string;
  action: string;
  subgroups?: string[];
};

type ExamQuestion = {
  id: string;
  muscle: string;
  prompt: string;
  options: string[];
  answer: string;
};

const examMuscles: ExamMuscle[] = [
  {
    id: "trapecio",
    title: "Trapecio",
    origin:
      "Parte posterior del cráneo en el occipital, apófisis espinosas cervicales C1-C7 y vértebras dorsales D1-D12.",
    destination: "Cara interna de la clavícula, espina escapular y acromion.",
    action: "Rotación contralateral de cabeza y cuello, y extensión posterior de cabeza y cuello.",
  },
  {
    id: "piramidal",
    title: "Piramidal",
    origin: "Cara anterior del sacro.",
    destination: "Vértice superior del trocánter mayor.",
    action: "Rotador externo del muslo y abductor del muslo.",
  },
  {
    id: "paravertebrales",
    title: "Paravertebrales",
    note: "Grupo erector de la columna. De más exterior a más interior:",
    subgroups: ["Iliocostal", "Longísimo", "Espinoso"],
    origin: "Origen común en sacro, cresta ilíaca, fascia toracolumbar y apófisis espinosas lumbares.",
    destination: "Costillas, apófisis transversas y apófisis espinosas vertebrales, según el fascículo.",
    action:
      "Extensión de la columna; unilateralmente, inclinación lateral del tronco hacia el mismo lado y estabilización postural.",
  },
  {
    id: "romboides",
    title: "Romboides",
    origin: "Apófisis espinosas de C7 a D5.",
    destination: "Borde medial de la cara posterior del omóplato.",
    action: "Aducción del omóplato y desplazamiento de los hombros hacia atrás.",
  },
];

const examQuestions: ExamQuestion[] = [
  {
    id: "trapecio-origen",
    muscle: "Trapecio",
    prompt: "¿Cuál es el origen principal del trapecio según la ficha?",
    options: [
      "Occipital, apófisis espinosas C1-C7 y dorsales D1-D12",
      "Cara anterior del sacro",
      "Borde medial de la escápula",
      "Trocánter mayor",
    ],
    answer: "Occipital, apófisis espinosas C1-C7 y dorsales D1-D12",
  },
  {
    id: "piramidal-destino",
    muscle: "Piramidal",
    prompt: "¿Dónde se inserta o termina el piramidal?",
    options: [
      "Vértice superior del trocánter mayor",
      "Cara interna de la clavícula",
      "Costillas inferiores",
      "Apófisis espinosas D1-D12",
    ],
    answer: "Vértice superior del trocánter mayor",
  },
  {
    id: "paravertebrales-orden",
    muscle: "Paravertebrales",
    prompt: "¿Cuál es el orden de más exterior a más interior en los paravertebrales?",
    options: [
      "Iliocostal, longísimo, espinoso",
      "Espinoso, longísimo, iliocostal",
      "Longísimo, iliocostal, espinoso",
      "Romboides, trapecio, piramidal",
    ],
    answer: "Iliocostal, longísimo, espinoso",
  },
  {
    id: "romboides-accion",
    muscle: "Romboides",
    prompt: "¿Qué acción realiza el romboides?",
    options: [
      "Aduce el omóplato y desplaza los hombros hacia atrás",
      "Rota externamente y abduce el muslo",
      "Flexiona el cuello hacia delante",
      "Desciende las costillas durante la espiración",
    ],
    answer: "Aduce el omóplato y desplaza los hombros hacia atrás",
  },
];

const baseUrl = import.meta.env.BASE_URL;
const assetUrl = (path: string) => `${baseUrl}${path}`;

declare global {
  var __atlasRoot: Root | undefined;
}

function App() {
  const muscles = atlasContent.muscles as AtlasItem[];
  const massages = atlasContent.massages as AtlasItem[];
  const [view, setView] = useState<View>("home");
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [reader, setReader] = useState<AtlasItem | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const current = muscles[active];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const all = [...muscles, ...massages];
    if (!term) return all;
    return all.filter((item) => item.title.toLowerCase().includes(term));
  }, [query, muscles, massages]);

  const goTo = (next: number) => {
    const size = muscles.length;
    setActive((next + size) % size);
  };

  return (
    <main className="app-shell">
      <section className="topbar" aria-label="Cabecera">
        <div>
          <p className="microcopy">Curso Quiromasaje</p>
          <h1>Atlas Quiromasaje</h1>
        </div>
        <button className="round-button" type="button" aria-label="Abrir biblioteca" onClick={() => setView("library")}>
          <BookOpen size={22} />
        </button>
      </section>

      {view === "home" && (
        <>
          <section className="hero-slide" aria-label="Ficha destacada">
            <div className="slide-copy">
              <span>{String(current.order).padStart(2, "0")} / {muscles.length}</span>
              <h2>{current.title}</h2>
              <p>{current.summary}</p>
              <div className="actions">
                <button className="primary-button" type="button" onClick={() => setReader(current)}>
                  <Maximize2 size={18} />
                  Ver ficha
                </button>
                <a className="ghost-button" href={assetUrl(current.pdf)} target="_blank" rel="noreferrer">
                  <Download size={18} />
                  PDF
                </a>
              </div>
            </div>
            <button className="image-button" type="button" onClick={() => setReader(current)} aria-label={`Abrir ${current.title}`}>
              <img src={assetUrl(current.image)} alt={`Ficha anatómica ${current.title}`} />
            </button>
          </section>

          <section className="slide-controls" aria-label="Controles de diapositiva">
            <button className="round-button" type="button" onClick={() => goTo(active - 1)} aria-label="Ficha anterior">
              <ArrowLeft size={22} />
            </button>
            <div className="dots" aria-hidden="true">
              {muscles.map((item, index) => (
                <span key={item.id} className={index === active ? "active" : ""} />
              ))}
            </div>
            <button className="round-button" type="button" onClick={() => goTo(active + 1)} aria-label="Ficha siguiente">
              <ArrowRight size={22} />
            </button>
          </section>

          <section className="rail-section">
            <div className="section-heading">
              <h3>Masajes destacados</h3>
              <span>Desliza</span>
            </div>
            <MassageRail items={massages} onOpen={setReader} />
          </section>
        </>
      )}

      {view === "massages" && (
        <section className="page-section">
          <div className="section-heading expanded">
            <div>
              <h2>Protocolos de masaje</h2>
              <p>Cards táctiles para revisar cada secuencia en móvil o escritorio.</p>
            </div>
            <Sparkles size={24} />
          </div>
          <div className="massage-grid">
            {massages.map((item) => (
              <MassageCard key={item.id} item={item} onOpen={setReader} large />
            ))}
          </div>
        </section>
      )}

      {view === "library" && (
        <section className="page-section">
          <label className="search-box">
            <Search size={19} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar ficha o masaje" />
          </label>
          <div className="library-list">
            {filtered.map((item) => (
              <button key={item.id} className="library-row" type="button" onClick={() => setReader(item)}>
                <img src={assetUrl(item.image)} alt="" />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.category === "muscle" ? "Ficha anatómica" : "Protocolo de masaje"}</small>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </section>
      )}

      {view === "exam" && <ExamSection muscles={examMuscles} />}

      {view === "test" && (
        <TestSection
          questions={examQuestions}
          answers={answers}
          submitted={submitted}
          onAnswer={(questionId, option) => {
            setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: option }));
            setSubmitted(false);
          }}
          onSubmit={() => setSubmitted(true)}
          onReset={() => {
            setAnswers({});
            setSubmitted(false);
          }}
        />
      )}

      <nav className="bottom-nav" aria-label="Navegación inferior">
        <button className={view === "home" ? "active" : ""} type="button" onClick={() => setView("home")}>
          <Home size={22} />
          Inicio
        </button>
        <button className={view === "massages" ? "active" : ""} type="button" onClick={() => setView("massages")}>
          <HeartPulse size={22} />
          Masajes
        </button>
        <button className={view === "library" ? "active" : ""} type="button" onClick={() => setView("library")}>
          <Grid2X2 size={22} />
          Biblioteca
        </button>
        <button className={view === "exam" ? "active" : ""} type="button" onClick={() => setView("exam")}>
          <ClipboardList size={22} />
          Examen
        </button>
        <button className={view === "test" ? "active" : ""} type="button" onClick={() => setView("test")}>
          <HelpCircle size={22} />
          Test
        </button>
      </nav>

      {reader && <ReaderModal item={reader} onClose={() => setReader(null)} />}
    </main>
  );
}

function MassageRail({ items, onOpen }: { items: AtlasItem[]; onOpen: (item: AtlasItem) => void }) {
  return (
    <div className="massage-rail">
      {items.map((item) => (
        <MassageCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}

function MassageCard({ item, onOpen, large = false }: { item: AtlasItem; onOpen: (item: AtlasItem) => void; large?: boolean }) {
  return (
    <button className={`massage-card ${large ? "large" : ""}`} type="button" onClick={() => onOpen(item)}>
      <img src={assetUrl(item.image)} alt="" />
      <span className="massage-overlay">
        <HeartPulse size={22} />
        <strong>{item.title}</strong>
        <small>{item.summary}</small>
      </span>
    </button>
  );
}

function ExamSection({ muscles }: { muscles: ExamMuscle[] }) {
  return (
    <section className="page-section exam-page">
      <div className="section-heading expanded">
        <div>
          <h2>Examen</h2>
          <p>Repaso por músculo: origen, destino y acción.</p>
        </div>
        <ClipboardList size={24} />
      </div>
      <div className="exam-grid">
        {muscles.map((muscle) => (
          <article className="exam-card" key={muscle.id}>
            <div className="exam-card-title">
              <h3>{muscle.title}</h3>
              {muscle.note && <span>{muscle.note}</span>}
            </div>
            {muscle.subgroups && (
              <ol className="subgroup-list" aria-label="Orden de exterior a interior">
                {muscle.subgroups.map((subgroup) => (
                  <li key={subgroup}>{subgroup}</li>
                ))}
              </ol>
            )}
            <dl className="exam-facts">
              <div>
                <dt>¿Origen?</dt>
                <dd>{muscle.origin}</dd>
              </div>
              <div>
                <dt>¿Destino?</dt>
                <dd>{muscle.destination}</dd>
              </div>
              <div>
                <dt>¿Acción?</dt>
                <dd>{muscle.action}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function TestSection({
  questions,
  answers,
  submitted,
  onAnswer,
  onSubmit,
  onReset,
}: {
  questions: ExamQuestion[];
  answers: Record<string, string>;
  submitted: boolean;
  onAnswer: (questionId: string, option: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const score = questions.filter((question) => answers[question.id] === question.answer).length;
  const isComplete = answeredCount === questions.length;

  return (
    <section className="page-section test-page">
      <div className="section-heading expanded">
        <div>
          <h2>Test examen</h2>
          <p>Una pregunta por grupo, cuatro respuestas posibles y corrección al finalizar.</p>
        </div>
        <HelpCircle size={24} />
      </div>

      <div className="test-status" aria-live="polite">
        <span>
          {answeredCount} / {questions.length} respondidas
        </span>
        {submitted && (
          <strong>
            Nota: {score} / {questions.length}
          </strong>
        )}
      </div>

      <div className="question-list">
        {questions.map((question, questionIndex) => {
          const selected = answers[question.id];
          return (
            <article className="question-card" key={question.id}>
              <span className="question-label">
                {questionIndex + 1}. {question.muscle}
              </span>
              <h3>{question.prompt}</h3>
              <div className="option-grid">
                {question.options.map((option) => {
                  const isSelected = selected === option;
                  const isCorrect = question.answer === option;
                  const resultClass = submitted && (isCorrect ? "correct" : isSelected ? "wrong" : "");

                  return (
                    <button
                      className={`answer-option ${isSelected ? "selected" : ""} ${resultClass}`}
                      type="button"
                      key={option}
                      onClick={() => onAnswer(question.id, option)}
                      aria-pressed={isSelected}
                    >
                      <span>{option}</span>
                      {submitted && isCorrect && <CheckCircle2 size={18} />}
                    </button>
                  );
                })}
              </div>
              {submitted && (
                <p className={selected === question.answer ? "feedback correct" : "feedback wrong"}>
                  {selected === question.answer ? "Correcta." : `Incorrecta. Respuesta correcta: ${question.answer}.`}
                </p>
              )}
            </article>
          );
        })}
      </div>

      <div className="test-actions">
        <button className="primary-button" type="button" onClick={onSubmit} disabled={!isComplete}>
          <CheckCircle2 size={18} />
          Validar examen
        </button>
        <button className="ghost-button" type="button" onClick={onReset}>
          <RotateCcw size={18} />
          Reiniciar
        </button>
      </div>
    </section>
  );
}

function ReaderModal({ item, onClose }: { item: AtlasItem; onClose: () => void }) {
  return (
    <section className="reader" role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="reader-toolbar">
        <button className="round-button" type="button" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>
        <div>
          <strong>{item.title}</strong>
          <span>{item.category === "muscle" ? "Ficha anatómica" : "Protocolo de masaje"}</span>
        </div>
        <a className="round-button" href={assetUrl(item.pdf)} target="_blank" rel="noreferrer" aria-label="Abrir PDF">
          <Download size={21} />
        </a>
      </div>
      <div className="reader-canvas">
        <img src={assetUrl(item.image)} alt={`Vista completa de ${item.title}`} />
      </div>
    </section>
  );
}

const appRoot = globalThis.__atlasRoot ?? createRoot(document.getElementById("app")!);
globalThis.__atlasRoot = appRoot;

appRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
