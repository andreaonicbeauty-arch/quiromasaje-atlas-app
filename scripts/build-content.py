from pathlib import Path
import json
import re
import shutil
import unicodedata

import fitz


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent
PUBLIC = ROOT / "public"
ASSETS = PUBLIC / "assets"
PDFS = PUBLIC / "pdfs"
DATA_FILE = ROOT / "src" / "content.ts"


def ascii_slug(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text).strip("-")
    return ascii_text or "documento"


def clean_title(pdf_path: Path) -> str:
    title = pdf_path.stem
    title = re.sub(r"^\d+\s+", "", title)
    title = title.replace(" Final", "")
    title = title.replace("Estreñimiento", "Estrenimiento")
    return unicodedata.normalize("NFC", title)


TITLE_FIXES = {
    "Gluteo Mayor": "Glúteo Mayor",
    "Gluteo Medio": "Glúteo Medio",
    "Gluteo Menor": "Glúteo Menor",
    "Masaje Glúteo": "Masaje Glúteo",
    "Masaje de Relajación Decubito Prono": "Masaje de Relajación Decúbito Prono",
    "Masaje de Relajación Decubito Supino": "Masaje de Relajación Decúbito Supino",
    "Masaje Aerofagia-Estreñimiento": "Masaje Aerofagia-Estreñimiento",
}


def summary_for(title: str, is_massage: bool) -> str:
    if is_massage:
        if "Relajación" in title:
            return "Secuencia de relajación para consultar el orden de maniobras y tiempos durante la práctica."
        if "Lumbar" in title:
            return "Protocolo centrado en la zona lumbar para repasar maniobras, ritmo y colocación."
        if "Glúteo" in title:
            return "Rutina específica para glúteo, útil para repasar preparación, pases y trabajo localizado."
        if "Circulatorio" in title:
            return "Secuencia circulatoria organizada por zonas para seguir el recorrido del masaje."
        return "Protocolo abdominal para consultar pasos, ritmo e indicaciones de forma visual."
    return f"Ficha anatómica de {title.lower()} con descripción, origen, inserción y acción en formato visual."


def render_cover(pdf_path: Path, output_path: Path) -> None:
    document = fitz.open(pdf_path)
    page = document[0]
    matrix = fitz.Matrix(2.4, 2.4)
    pix = page.get_pixmap(matrix=matrix, alpha=False)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(output_path)
    document.close()


def build_item(pdf_path: Path, category: str, index: int) -> dict:
    title = clean_title(pdf_path)
    title = TITLE_FIXES.get(title, title)
    slug = ascii_slug(title)
    pdf_name = f"{slug}.pdf"
    image_name = f"{slug}.png"
    shutil.copy2(pdf_path, PDFS / pdf_name)
    render_cover(pdf_path, ASSETS / image_name)
    is_massage = category == "massage"
    return {
        "id": slug,
        "title": title,
        "category": category,
        "order": index,
        "image": f"assets/{image_name}",
        "pdf": f"pdfs/{pdf_name}",
        "summary": summary_for(title, is_massage),
    }


def main() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    PDFS.mkdir(parents=True, exist_ok=True)
    muscle_pdfs = sorted(
        [path for path in SOURCE.glob("*.pdf") if not path.name.lower().startswith("masaje")],
        key=lambda path: path.name,
    )
    massage_pdfs = sorted(
        [path for path in SOURCE.glob("Masaje*.pdf")],
        key=lambda path: path.name,
    )
    muscles = [build_item(path, "muscle", index + 1) for index, path in enumerate(muscle_pdfs)]
    massages = [build_item(path, "massage", index + 1) for index, path in enumerate(massage_pdfs)]
    data = {
        "muscles": muscles,
        "massages": massages,
    }
    DATA_FILE.write_text(
        "export const atlasContent = "
        + json.dumps(data, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
