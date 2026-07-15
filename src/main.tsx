import React, { useMemo, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Download,
  Grid2X2,
  HeartPulse,
  Home,
  Maximize2,
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

const baseUrl = import.meta.env.BASE_URL;
const assetUrl = (path: string) => `${baseUrl}${path}`;

declare global {
  var __atlasRoot: Root | undefined;
}

function App() {
  const muscles = atlasContent.muscles as AtlasItem[];
  const massages = atlasContent.massages as AtlasItem[];
  const [view, setView] = useState<"home" | "massages" | "library">("home");
  const [active, setActive] = useState(0);
  const [query, setQuery] = useState("");
  const [reader, setReader] = useState<AtlasItem | null>(null);

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
          <p className="microcopy">Consulta estática</p>
          <h1>Atlas Quiromasaje</h1>
        </div>
        <button className="round-button" type="button" aria-label="Abrir biblioteca" onClick={() => setView("library")}>
          <BookOpen size={22} />
        </button>
      </section>

      <section className="tabs" aria-label="Secciones principales">
        <button className={view === "home" ? "active" : ""} type="button" onClick={() => setView("home")}>
          Fichas
        </button>
        <button className={view === "massages" ? "active" : ""} type="button" onClick={() => setView("massages")}>
          Masajes
        </button>
        <button className={view === "library" ? "active" : ""} type="button" onClick={() => setView("library")}>
          Biblioteca
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
