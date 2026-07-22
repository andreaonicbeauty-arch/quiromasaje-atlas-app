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
  PlayCircle,
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
  fileLabel?: string;
  summary: string;
};

type View = "home" | "massages" | "videos" | "library" | "exam" | "test";

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
  answers: string[];
  hint?: string;
};

type ZoneTheory = {
  id: string;
  title: string;
  items: string[];
};

type VideoLesson = {
  id: string;
  title: string;
  summary: string;
  driveId: string;
};

const videoLessons: VideoLesson[] = [
  {
    id: "tecnicas-masaje",
    title: "Técnicas de masaje",
    summary: "Vídeo de apoyo para repasar la ejecución y el orden de las técnicas de masaje.",
    driveId: "1RVYT3NryiV0i2Nl_8i3KuSNso3OrHnT1",
  },
  {
    id: "masaje-relajacion",
    title: "Masaje de relajación",
    summary: "Demostración práctica para revisar el masaje de relajación y acompañar el protocolo escrito.",
    driveId: "101czNB8sPaEcKwWuvgIuDUW2iDBupNiG",
  },
  {
    id: "masaje-cervical-supino",
    title: "Masaje cervical II en supino",
    summary: "Vídeo práctico para repasar el trabajo cervical en posición supina.",
    driveId: "1u0cCxn7KyrY3TEJX-G3UR7S-x_YpoTr7",
  },
  {
    id: "masaje-cervical-prono",
    title: "Masaje cervical en prono",
    summary: "Demostración de masaje cervical en prono para acompañar el protocolo de camilla.",
    driveId: "1fR1u6Y8cfTIlzM9V6498nP-pNDPABSUp",
  },
  {
    id: "masaje-zona-glutea",
    title: "Masaje zona glútea",
    summary: "Secuencia visual para revisar el masaje de la zona glútea.",
    driveId: "14sqydOKbe6V-wGjalxK_4xPwHZsRLwfr",
  },
  {
    id: "tejido-blando-paravertebral",
    title: "Técnicas de tejido blando paravertebral",
    summary: "Vídeo de apoyo para estudiar técnicas de tejido blando en paravertebrales.",
    driveId: "1tNaULmSQJeqk_K-4rgQ--QGY03qvsenM",
  },
  {
    id: "masaje-aerofagia-estrenimiento",
    title: "Masaje de aerofagia y estreñimiento",
    summary: "Demostración audiovisual del protocolo abdominal de aerofagia y estreñimiento.",
    driveId: "1StEKvQCtD1RkdpilmdQCiTtysxNWB4Qz",
  },
];

const drivePreviewUrl = (driveId: string) => `https://drive.google.com/file/d/${driveId}/preview`;
const driveViewUrl = (driveId: string) => `https://drive.google.com/file/d/${driveId}/view`;

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
    id: "paravertebral",
    title: "Paravertebral",
    note: "Llamado cuádriceps dorsal. De más superficial/lateral a más profundo:",
    subgroups: ["Iliocostal", "Dorsal largo", "Espinoso"],
    origin: "Aponeurosis del sacro y parte trasera de la cresta ilíaca.",
    destination: "Apófisis transversa y espinosa de la vértebra cervical C2.",
    action:
      "Protección y sujeción de la columna. En conjunto: flexión, rotación, lateralización y extensión de la columna.",
  },
  {
    id: "romboides",
    title: "Romboides",
    origin: "Apófisis espinosas de C7 a D5.",
    destination: "Borde medial de la cara posterior del omóplato.",
    action: "Aducción del omóplato y desplazamiento de los hombros hacia atrás.",
  },
  {
    id: "angular-del-omoplato",
    title: "Angular del Omóplato",
    note: "Conocido como el músculo del telefonista. Está en 2º y 3º plano.",
    origin: "Lateral de las apófisis transversas de las 4 primeras vértebras cervicales C1-C2-C3-C4.",
    destination: "Ángulo superior medial de la cara posterior del omóplato.",
    action: "Eleva el omóplato y realiza flexión lateral del cuello de un solo lado.",
  },
  {
    id: "esplenio",
    title: "Esplenio",
    note: "Músculo superficial, ancho y delgado, situado en la nuca y parte superior del dorso.",
    origin: "Apófisis espinosas de C3 a D6.",
    destination: "Hueso temporal en la apófisis mastoides.",
    action: "Rotación ipsilateral de la cabeza hacia el mismo lado de la contracción.",
  },
  {
    id: "complexo-mayor",
    title: "Complexo Mayor",
    note: "Músculo profundo relacionado con la parte posterior del cuello y cráneo.",
    origin: "Apófisis transversas de C3 a D6.",
    destination: "Occipital en la parte posterior del cráneo.",
    action: "Flexión posterior de cabeza y cuello.",
  },
  {
    id: "complexo-menor",
    title: "Complexo Menor",
    note: "Músculo profundo que comparte inserción y acción principal con el esplenio.",
    origin: "Apófisis transversas de C4 a D3.",
    destination: "Hueso temporal en la apófisis mastoides.",
    action: "Rotación ipsilateral de la cabeza hacia el lado de la contracción.",
  },
  {
    id: "esternocleidomastoideo",
    title: "Esternocleidomastoideo",
    note: "Músculo de la tortícolis, totalmente superficial. Se trabaja en posición de supino.",
    origin: "Parte superior del esternón y parte medial de la clavícula.",
    destination: "Hueso temporal en su apófisis mastoides.",
    action: "Rotación contralateral de la cabeza hacia el lado opuesto a la contracción.",
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
    answers: ["Occipital, apófisis espinosas C1-C7 y dorsales D1-D12"],
  },
  {
    id: "trapecio-multiple",
    muscle: "Trapecio",
    prompt: "Marca las afirmaciones correctas sobre el trapecio.",
    options: [
      "Se origina en occipital, cervicales C1-C7 y dorsales D1-D12",
      "Se inserta en clavícula, espina escapular y acromion",
      "Se inserta en el trocánter mayor",
      "Ninguna es correcta",
    ],
    answers: [
      "Se origina en occipital, cervicales C1-C7 y dorsales D1-D12",
      "Se inserta en clavícula, espina escapular y acromion",
    ],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
  {
    id: "trapecio-fibras",
    muscle: "Trapecio",
    prompt: "¿En cuántos grupos se dividen las fibras del trapecio?",
    options: [
      "Dos: fibras superiores y fibras inferiores",
      "Tres: fibras superiores, medias e inferiores",
      "Cuatro: cervicales, dorsales, lumbares y sacras",
      "Ninguna es correcta",
    ],
    answers: ["Tres: fibras superiores, medias e inferiores"],
  },
  {
    id: "trapecio-insercion-examen",
    muscle: "Trapecio",
    prompt: "¿Dónde se encuentra la inserción del trapecio?",
    options: [
      "Cara posterior de la clavícula, espina escapular y acromion",
      "Cara interna de la clavícula, espina escapular y acromion",
      "Cara anterior de la clavícula y posterior de espina escapular y acromion",
      "Ninguna es correcta",
    ],
    answers: ["Cara interna de la clavícula, espina escapular y acromion"],
  },
  {
    id: "piramidal-insercion",
    muscle: "Piramidal",
    prompt: "¿Dónde se inserta o termina el piramidal?",
    options: [
      "Vértice superior del trocánter mayor",
      "Cara interna de la clavícula",
      "Costillas inferiores",
      "Apófisis espinosas D1-D12",
    ],
    answers: ["Vértice superior del trocánter mayor"],
  },
  {
    id: "piramidal-multiple",
    muscle: "Piramidal",
    prompt: "Marca las opciones correctas del piramidal.",
    options: [
      "Origen en la cara anterior del sacro",
      "Inserción en el vértice superior del trocánter mayor",
      "Origen en la cara interna de la clavícula",
      "Ninguna es correcta",
    ],
    answers: ["Origen en la cara anterior del sacro", "Inserción en el vértice superior del trocánter mayor"],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
  {
    id: "paravertebral-orden",
    muscle: "Paravertebral",
    prompt: "¿Cuál es el orden de más superficial/lateral a más profundo en la musculatura paravertebral?",
    options: [
      "Iliocostal, dorsal largo, espinoso",
      "Espinoso, dorsal largo, iliocostal",
      "Dorsal largo, iliocostal, espinoso",
      "Romboides, trapecio, piramidal",
    ],
    answers: ["Iliocostal, dorsal largo, espinoso"],
  },
  {
    id: "paravertebral-origen-insercion-examen",
    muscle: "Paravertebral",
    prompt: "¿Qué origen e inserción corresponden a los paravertebrales?",
    options: [
      "Aponeurosis del sacro y parte anterior de la cresta ilíaca - apófisis espinosa C2",
      "Aponeurosis del sacro y parte trasera de la cresta ilíaca - apófisis transversa C2",
      "Aponeurosis del sacro y parte trasera de la cresta ilíaca - apófisis espinosa y transversa C2",
      "Ninguna es correcta",
    ],
    answers: ["Aponeurosis del sacro y parte trasera de la cresta ilíaca - apófisis espinosa y transversa C2"],
  },
  {
    id: "paravertebral-multiple",
    muscle: "Paravertebral",
    prompt: "Sobre paravertebrales, marca las respuestas correctas.",
    options: [
      "El orden indicado es iliocostal, dorsal largo y espinoso",
      "Ayudan a proteger y sujetar la columna",
      "Su acción principal es la adducción del omóplato",
      "Ninguna es correcta",
    ],
    answers: ["El orden indicado es iliocostal, dorsal largo y espinoso", "Ayudan a proteger y sujetar la columna"],
    hint: "Puede haber una, varias o ninguna correcta.",
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
    answers: ["Aduce el omóplato y desplaza los hombros hacia atrás"],
  },
  {
    id: "romboides-multiple",
    muscle: "Romboides",
    prompt: "Marca las afirmaciones correctas sobre romboides.",
    options: [
      "Origen en apófisis espinosas de C7 a D5",
      "Inserción en borde medial de la cara posterior del omóplato",
      "Origen en la cara anterior del sacro",
      "Ninguna es correcta",
    ],
    answers: [
      "Origen en apófisis espinosas de C7 a D5",
      "Inserción en borde medial de la cara posterior del omóplato",
    ],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
  {
    id: "romboides-origen-insercion-examen",
    muscle: "Romboides",
    prompt: "¿Qué origen e inserción corresponden al romboides?",
    options: [
      "Apófisis espinosas de C7 a D5 - borde del omóplato",
      "Apófisis transversas de C7 a D4 - borde medial del omóplato",
      "Apófisis espinosas de C7 a D5 - borde medial de la cara posterior del omóplato",
      "Ninguna es correcta",
    ],
    answers: ["Apófisis espinosas de C7 a D5 - borde medial de la cara posterior del omóplato"],
  },
  {
    id: "angular-insercion",
    muscle: "Angular del Omóplato",
    prompt: "¿Dónde se inserta el angular del omóplato?",
    options: [
      "Ángulo superior medial de la cara posterior del omóplato",
      "Vértice superior del trocánter mayor",
      "Cara interna de la clavícula",
      "Apófisis espinosas de C7 a D5",
    ],
    answers: ["Ángulo superior medial de la cara posterior del omóplato"],
  },
  {
    id: "angular-multiple",
    muscle: "Angular del Omóplato",
    prompt: "Marca las opciones correctas del angular del omóplato.",
    options: [
      "Se inserta en el trocánter mayor",
      "Su origen principal está en la cara anterior del sacro",
      "Desciende las costillas durante la espiración",
      "Realiza rotación externa del muslo",
      "Ninguna es correcta",
    ],
    answers: ["Ninguna es correcta"],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
  {
    id: "angular-origen-examen",
    muscle: "Angular del Omóplato",
    prompt: "¿Cuál es el origen del angular del omóplato?",
    options: [
      "En el lateral de las apófisis espinosas de C1 a C4",
      "En el lateral de las apófisis transversas de C1 a C4",
      "En el lateral de las apófisis transversas de C2 a C7",
      "Ninguna es correcta",
    ],
    answers: ["En el lateral de las apófisis transversas de C1 a C4"],
  },
  {
    id: "serrato-menor-superior-examen",
    muscle: "Serrato Menor Superior",
    prompt: "¿Qué origen, inserción y acción corresponden al serrato menor superior?",
    options: [
      "Apófisis espinosas C7 a D3 - cuatro primeras costillas - inspiración",
      "Apófisis espinosas C7 a D3 - parte posterior de la cara externa de las 4 primeras costillas - inspiración",
      "Apófisis transversas C7 a D3 - parte posterior de la cara externa de las 4 primeras costillas - espiración",
      "Ninguna es correcta",
    ],
    answers: ["Apófisis espinosas C7 a D3 - parte posterior de la cara externa de las 4 primeras costillas - inspiración"],
  },
  {
    id: "interescapular-orden",
    muscle: "Zona Interescapular",
    prompt: "Elige el orden correcto de superficial a profundo en zona interescapular.",
    options: [
      "Trapecio fibras inferiores, romboide, serrato menor superior, esplenio, complexo menor, complexo mayor, paravertebrales",
      "Dorsal ancho, serrato menor inferior, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
      "Romboide, trapecio fibras inferiores, intercostales, paravertebrales, dorsal ancho",
      "Ninguna es correcta",
    ],
    answers: [
      "Trapecio fibras inferiores, romboide, serrato menor superior, esplenio, complexo menor, complexo mayor, paravertebrales",
    ],
  },
  {
    id: "dorsal-orden",
    muscle: "Zona Dorsal",
    prompt: "Elige el orden correcto de superficial a profundo en zona dorsal.",
    options: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, romboides, serrato menor superior, paravertebrales, intercostales",
      "Trapecio fibras inferiores, romboide, serrato menor superior, esplenio, complexo menor, complexo mayor",
      "Dorsal ancho, trapecio fibras inferiores, transverso abdominal, intercostales",
      "Ninguna es correcta",
    ],
    answers: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, romboides, serrato menor superior, paravertebrales, intercostales",
    ],
  },
  {
    id: "dorsal-orden-examen-foto",
    muscle: "Zona Dorsal",
    prompt: "Según el examen fotografiado, ¿qué orden de trabajo corresponde al masaje dorsal?",
    options: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, romboides, serrato menor superior, brazo en jarra, paravertebrales",
      "Trapecio fibras inferiores, dorsal ancho, romboides, serrato menor superior, brazo en jarra, paravertebrales",
      "Trapecio fibras inferiores y medias, dorsal ancho, serrato menor inferior, romboides, serrato menor superior, brazo en jarra, paravertebrales",
      "Ninguna es correcta",
    ],
    answers: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, romboides, serrato menor superior, brazo en jarra, paravertebrales",
    ],
  },
  {
    id: "lumbar-orden",
    muscle: "Zona Lumbar",
    prompt: "Elige el orden correcto de superficial a profundo en zona lumbar.",
    options: [
      "Trapecio inferiores, dorsal ancho, serrato menor inferior, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
      "Romboide, serrato menor superior, esplenio, complexo menor, paravertebrales",
      "Intercostales, paravertebrales, dorsal ancho, trapecio inferiores",
      "Ninguna es correcta",
    ],
    answers: [
      "Trapecio inferiores, dorsal ancho, serrato menor inferior, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
    ],
  },
  {
    id: "lumbar-orden-examen-foto",
    muscle: "Zona Lumbar",
    prompt: "¿Qué músculos corresponden al masaje lumbar en su orden de trabajo?",
    options: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, oblicuo mayor, oblicuo menor, transverso abdominal, cresta ilíaca inserciones, paravertebrales",
      "Trapecio todas sus fibras inferiores, dorsal ancho, serrato menor inferior, cresta ilíaca inserciones, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, cresta ilíaca inserciones, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
      "Ninguna es correcta",
    ],
    answers: [
      "Trapecio fibras inferiores, dorsal ancho, serrato menor inferior, cresta ilíaca inserciones, oblicuo mayor, oblicuo menor, transverso abdominal, paravertebrales",
    ],
  },
  {
    id: "esplenio-simple",
    muscle: "Esplenio",
    prompt: "¿Cuál es la inserción del esplenio?",
    options: [
      "Hueso temporal en la apófisis mastoides",
      "Occipital en la parte posterior del cráneo",
      "Ángulo superior medial del omóplato",
      "Vértice superior del trocánter mayor",
    ],
    answers: ["Hueso temporal en la apófisis mastoides"],
  },
  {
    id: "complexo-mayor-simple",
    muscle: "Complexo Mayor",
    prompt: "¿Qué acción principal realiza el complexo mayor?",
    options: [
      "Flexión posterior de cabeza y cuello",
      "Rotación ipsilateral de la cabeza",
      "Aducción del omóplato",
      "Rotación externa del muslo",
    ],
    answers: ["Flexión posterior de cabeza y cuello"],
  },
  {
    id: "complexo-menor-simple",
    muscle: "Complexo Menor",
    prompt: "¿Dónde se inserta el complexo menor?",
    options: [
      "Hueso temporal en la apófisis mastoides",
      "Cara interna de la clavícula",
      "Borde medial de la escápula",
      "Apófisis espinosas de C7 a D5",
    ],
    answers: ["Hueso temporal en la apófisis mastoides"],
  },
  {
    id: "esplenio-complexo-menor-relacion",
    muscle: "Preguntas cruzadas",
    prompt: "¿Qué comparten el esplenio y el complexo menor?",
    options: [
      "Inserción en apófisis mastoides y rotación ipsilateral de la cabeza",
      "Inserción en occipital y flexión posterior de cabeza y cuello",
      "Origen en la cara anterior del sacro",
      "Inserción en clavícula, espina escapular y acromion",
    ],
    answers: ["Inserción en apófisis mastoides y rotación ipsilateral de la cabeza"],
  },
  {
    id: "mastoides-accion-recorrido",
    muscle: "Preguntas cruzadas",
    prompt: "¿Qué músculos comparten acción, parte de su recorrido e inserción en la apófisis mastoides?",
    options: ["Esplenio y Complexo Mayor", "Esplenio y Complexo Menor", "Complexo Mayor y Complexo Menor", "Ninguna es correcta"],
    answers: ["Esplenio y Complexo Menor"],
  },
  {
    id: "esplenio-complexo-menor-recorrido",
    muscle: "Preguntas cruzadas",
    prompt: "Marca las afirmaciones correctas sobre esplenio y complexo menor.",
    options: [
      "Ambos llegan a la apófisis mastoides del temporal",
      "Ambos realizan rotación ipsilateral de la cabeza",
      "El complexo menor se inserta en el occipital",
      "Ninguna es correcta",
    ],
    answers: [
      "Ambos llegan a la apófisis mastoides del temporal",
      "Ambos realizan rotación ipsilateral de la cabeza",
    ],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
  {
    id: "trapecio-complexo-mayor-relacion",
    muscle: "Preguntas cruzadas",
    prompt: "¿Qué relación hay entre trapecio y complexo mayor?",
    options: [
      "El complexo mayor se inserta en el occipital, zona que forma parte del origen del trapecio",
      "Los dos se insertan en el trocánter mayor",
      "El trapecio nace en la apófisis mastoides",
      "No tienen relación anatómica en la ficha",
    ],
    answers: ["El complexo mayor se inserta en el occipital, zona que forma parte del origen del trapecio"],
  },
  {
    id: "trapecio-complexo-mayor-recorrido",
    muscle: "Preguntas cruzadas",
    prompt: "Sobre el recorrido de trapecio y complexo mayor, marca la opción correcta.",
    options: [
      "Comparten relación con la zona posterior del cráneo y cuello",
      "Ambos tienen origen en la cara anterior del sacro",
      "Ambos se insertan únicamente en el omóplato",
      "Ninguna es correcta",
    ],
    answers: ["Comparten relación con la zona posterior del cráneo y cuello"],
  },
  {
    id: "rotadores-contralaterales-examen",
    muscle: "Preguntas cruzadas",
    prompt: "¿Qué músculos realizan la acción de rotador contralateral?",
    options: ["Trapecio y Complexo Mayor", "Esplenio y Complexo Menor", "Trapecio y ECOM", "Ninguna es correcta"],
    answers: ["Trapecio y ECOM"],
  },
  {
    id: "rotadores-ipsilaterales-examen",
    muscle: "Preguntas cruzadas",
    prompt: "¿Qué músculos realizan la acción de rotador ipsilateral?",
    options: ["Trapecio y Complexo Mayor", "Esplenio y Complexo Menor", "Trapecio y ECOM", "Ninguna es correcta"],
    answers: ["Esplenio y Complexo Menor"],
  },
  {
    id: "esternocleidomastoideo-simple",
    muscle: "Esternocleidomastoideo",
    prompt: "¿Cuál es la acción principal del esternocleidomastoideo según la ficha?",
    options: [
      "Rotación contralateral de la cabeza hacia el lado opuesto a la contracción",
      "Aducción del omóplato y desplazamiento de hombros hacia atrás",
      "Rotación externa y abducción del muslo",
      "Flexión posterior de cabeza y cuello",
    ],
    answers: ["Rotación contralateral de la cabeza hacia el lado opuesto a la contracción"],
  },
  {
    id: "protocolo-masaje-primer-paso",
    muscle: "Protocolo del Masaje en C.V.",
    prompt: "Según el esquema, ¿con qué empieza el protocolo del masaje en C.V.?",
    options: [
      "Tejido celular subcutáneo",
      "Patologías asociadas",
      "Estiramientos",
      "Bloques de T.N.M.",
    ],
    answers: ["Tejido celular subcutáneo"],
  },
  {
    id: "protocolo-masaje-venoso",
    muscle: "Protocolo del Masaje en C.V.",
    prompt: "¿Qué técnica se asocia al sistema venoso superficial en el esquema?",
    options: ["Vaciados", "Pinzado rodado", "Presiones", "Estiramientos"],
    answers: ["Vaciados"],
  },
  {
    id: "protocolo-masaje-planos",
    muscle: "Protocolo del Masaje en C.V.",
    prompt: "Marca las afirmaciones correctas sobre la parte de planos musculares del esquema.",
    options: [
      "En los planos donde haya afectación muscular se añade trabajo",
      "Los bloques se organizan como amasamiento + T.N.M. + amasamiento",
      "El sistema venoso superficial se trabaja con rotación contralateral",
      "Ninguna es correcta",
    ],
    answers: [
      "En los planos donde haya afectación muscular se añade trabajo",
      "Los bloques se organizan como amasamiento + T.N.M. + amasamiento",
    ],
    hint: "Puede haber una, varias o ninguna correcta.",
  },
];

const zoneTheory: ZoneTheory[] = [
  {
    id: "zona-interescapular",
    title: "Zona Interescapular",
    items: [
      "Trapecio fibras inferiores",
      "Romboide",
      "Serrato menor superior",
      "Esplenio",
      "Complexo menor",
      "Complexo mayor",
      "Paravertebrales",
    ],
  },
  {
    id: "zona-dorsal",
    title: "Zona Dorsal",
    items: [
      "Trapecio fibras inferiores (todos)",
      "Dorsal ancho",
      "Serrato menor inferior",
      "Romboides",
      "Serrato menor superior",
      "Paravertebrales",
      "Intercostales",
    ],
  },
  {
    id: "zona-lumbar",
    title: "Zona Lumbar",
    items: [
      "Trapecio inferiores (algunos)",
      "Dorsal ancho",
      "Serrato menor inferior",
      "Oblicuo mayor",
      "Oblicuo menor",
      "Transverso abdominal",
      "Paravertebrales",
    ],
  },
  {
    id: "protocolo-masaje-cv",
    title: "Protocolo del Masaje en C.V.",
    items: [
      "Tejido celular subcutáneo: pinzado rodado y presión palmar profunda",
      "Sistema venoso superficial: vaciados",
      "Músculos en general: amasamientos digital/nudillar o palmo-digital",
      "Músculos en particular: técnicas de pre-normalización o inespecíficas",
      "En planos con afectación muscular: añadir técnicas de normalización o específicas",
      "Bloques: amasamiento + T.N.M. + amasamiento",
      "Final: sistema venoso superficial, estiramientos y patologías asociadas",
    ],
  },
];

const baseUrl = import.meta.env.BASE_URL;
const assetUrl = (path: string) => `${baseUrl}${path}`;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${baseUrl}sw.js`).catch(() => {
      // The app still works as a normal website if PWA registration is unavailable.
    });
  });
}

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
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
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
                  {current.fileLabel ?? "PDF"}
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

          <section className="rail-section video-teaser">
            <div className="section-heading">
              <h3>Vídeos de práctica</h3>
              <button className="inline-link" type="button" onClick={() => setView("videos")}>
                Ver todos
              </button>
            </div>
            <VideoStrip videos={videoLessons} />
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

      {view === "videos" && <VideoSection videos={videoLessons} />}

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

      {view === "exam" && <ExamSection muscles={examMuscles} zones={zoneTheory} />}

      {view === "test" && (
        <TestSection
          questions={examQuestions}
          answers={answers}
          submitted={submitted}
          onAnswer={(questionId, option) => {
            setAnswers((currentAnswers) => {
              const selected = currentAnswers[questionId] ?? [];
              const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
              return { ...currentAnswers, [questionId]: next };
            });
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
        <button className={view === "videos" ? "active" : ""} type="button" onClick={() => setView("videos")}>
          <PlayCircle size={22} />
          Vídeos
        </button>
        <button
          className={view === "library" ? "active" : ""}
          type="button"
          onClick={() => setView("library")}
          aria-label="Biblioteca"
        >
          <Grid2X2 size={22} />
          Biblio
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

function VideoStrip({ videos }: { videos: VideoLesson[] }) {
  return (
    <div className="video-strip">
      {videos.map((video) => (
        <a className="video-mini-card" href={driveViewUrl(video.driveId)} target="_blank" rel="noreferrer" key={video.id}>
          <PlayCircle size={22} />
          <span>
            <strong>{video.title}</strong>
            <small>{video.summary}</small>
          </span>
        </a>
      ))}
    </div>
  );
}

function VideoSection({ videos }: { videos: VideoLesson[] }) {
  return (
    <section className="page-section video-page">
      <div className="section-heading expanded">
        <div>
          <h2>Vídeos</h2>
          <p>Material audiovisual para repasar técnicas y secuencias junto a las fichas.</p>
        </div>
        <PlayCircle size={24} />
      </div>
      <div className="video-grid">
        {videos.map((video) => (
          <article className="video-card" key={video.id}>
            <div className="video-frame">
              <iframe
                title={video.title}
                src={drivePreviewUrl(video.driveId)}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="video-copy">
              <span>Google Drive</span>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
              <a className="ghost-button" href={driveViewUrl(video.driveId)} target="_blank" rel="noreferrer">
                <PlayCircle size={18} />
                Abrir vídeo
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
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

function ExamSection({ muscles, zones }: { muscles: ExamMuscle[]; zones: ZoneTheory[] }) {
  return (
    <section className="page-section exam-page">
      <div className="section-heading expanded">
        <div>
          <h2>Examen</h2>
          <p>Repaso por zonas y por músculo: orden superficial-profundo, origen, inserción y acción.</p>
        </div>
        <ClipboardList size={24} />
      </div>
      <div className="zone-grid">
        {zones.map((zone) => (
          <article className="zone-card" key={zone.id}>
            <h3>{zone.title}</h3>
            <span>De superficial a profundo</span>
            <ol className="zone-list">
              {zone.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        ))}
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
                <dt>¿Inserción?</dt>
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
  answers: Record<string, string[]>;
  submitted: boolean;
  onAnswer: (questionId: string, option: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const isCorrectAnswer = (question: ExamQuestion) => {
    const selected = answers[question.id] ?? [];
    return selected.length === question.answers.length && question.answers.every((answer) => selected.includes(answer));
  };
  const answeredCount = questions.filter((question) => (answers[question.id] ?? []).length > 0).length;
  const score = questions.filter((question) => isCorrectAnswer(question)).length;
  const isComplete = answeredCount === questions.length;

  return (
    <section className="page-section test-page">
      <div className="section-heading expanded">
        <div>
          <h2>Test examen</h2>
          <p>Preguntas de una o varias respuestas, casos de ninguna correcta y órdenes por zona.</p>
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
          const isQuestionCorrect = isCorrectAnswer(question);
          return (
            <article className="question-card" key={question.id}>
              <span className="question-label">
                {questionIndex + 1}. {question.muscle}
              </span>
              <h3>{question.prompt}</h3>
              {question.hint && <p className="question-hint">{question.hint}</p>}
              <div className="option-grid">
                {question.options.map((option) => {
                  const isSelected = (selected ?? []).includes(option);
                  const isCorrect = question.answers.includes(option);
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
                <p className={isQuestionCorrect ? "feedback correct" : "feedback wrong"}>
                  {isQuestionCorrect ? "Correcta." : `Incorrecta. Respuesta correcta: ${question.answers.join("; ")}.`}
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
        <a className="round-button" href={assetUrl(item.pdf)} target="_blank" rel="noreferrer" aria-label="Abrir archivo">
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

