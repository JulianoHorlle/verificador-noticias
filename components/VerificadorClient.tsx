"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./VerificadorClient.module.css";

type Verdict = "verdadeiro" | "falso" | "parcialmente verdadeiro" | "não verificável";
interface Result { verdict: Verdict; analysis: string; sources: string[]; }

const EXAMPLES = [
  "Brasil é o maior produtor de café do mundo",
  "A lua é maior que Marte",
  "A vacina contra COVID-19 contém microchips",
  "O Amazonas é o rio mais longo do mundo",
];

const VERDICT_CONFIG: Record<Verdict, { label: string; icon: string; cls: string; sub: string }> = {
  verdadeiro: { label: "Verdadeiro", icon: "✓", cls: styles.vTrue, sub: "Informação confirmada por fontes confiáveis" },
  falso: { label: "Falso", icon: "✗", cls: styles.vFalse, sub: "Informação não suportada pelos fatos" },
  "parcialmente verdadeiro": { label: "Parcialmente verdadeiro", icon: "~", cls: styles.vPartial, sub: "Contém elementos verdadeiros e falsos" },
  "não verificável": { label: "Não verificável", icon: "?", cls: styles.vUnclear, sub: "Não foi possível confirmar ou refutar" },
};

const LOAD_STEPS = ["Analisando o conteúdo...", "Buscando informações na web...", "Cruzando fontes...", "Preparando o veredito..."];

export default function VerificadorClient() {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl); setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  function removeImage() {
    setImage(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function verify() {
    if ((!text.trim() && !image) || loading) return;
    setLoading(true); setResult(null); setError(null); setLoadStep(0);
    const interval = setInterval(() => setLoadStep((s) => (s + 1) % LOAD_STEPS.length), 1800);
    try {
      const res = await fetch("/api/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao verificar. Tente novamente.");
    } finally {
      clearInterval(interval); setLoading(false);
    }
  }

  function reset() { setResult(null); setError(null); setText(""); removeImage(); }
  const canVerify = (text.trim().length >= 5 || !!image) && !loading;

  if (loading) return (
    <div className={styles.loadingBox}>
      {imagePreview && <img src={imagePreview} alt="" className={styles.loadingThumb} />}
      <div className={styles.spinner} />
      <p className={styles.loadingTitle}>Verificando...</p>
      <p className={styles.loadingStep}>{LOAD_STEPS[loadStep]}</p>
    </div>
  );

  if (result) {
    const v = VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG["não verificável"];
    return (
      <div>
        <div className={`${styles.resultCard} ${v.cls}`}>
          <div className={styles.verdictBanner}>
            <div className={styles.verdictIcon}>{v.icon}</div>
            <div>
              <div className={styles.verdictLabel}>{v.label}</div>
              <div className={styles.verdictSub}>{v.sub}</div>
            </div>
          </div>
          {imagePreview && (
            <div className={styles.resultImgWrap}>
              <img src={imagePreview} alt="Imagem verificada" className={styles.resultImg} />
            </div>
          )}
          <div className={styles.resultBody}>
            <p className={styles.sectionLabel}>Análise</p>
            <p className={styles.analysis}>{result.analysis}</p>
            {result.sources?.length > 0 && (
              <div className={styles.sources}>
                <p className={styles.sectionLabel}>Fontes consultadas</p>
                {result.sources.map((s, i) => (
                  <div key={i} className={styles.sourceItem}>
                    <span className={styles.sourceDash}>—</span> {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className={styles.btnSecondary} onClick={reset}>↺ Verificar outro conteúdo</button>
      </div>
    );
  }

  if (error) return (
    <div>
      <div className={styles.errorBox}>{error}</div>
      <button className={styles.btnSecondary} onClick={reset}>↺ Tentar novamente</button>
    </div>
  );

  return (
    <div>
      {/* Exemplos */}
      {!image && (
        <div className={styles.examples}>
          <p className={styles.examplesLabel}>Exemplos para testar</p>
          <div className={styles.chips}>
            {EXAMPLES.map((e) => (
              <button key={e} className={styles.chip} onClick={() => setText(e)}>{e}</button>
            ))}
          </div>
        </div>
      )}

      {/* Área de imagem */}
      {imagePreview ? (
        <div className={styles.imgPreviewWrap}>
          <img src={imagePreview} alt="Preview" className={styles.imgPreview} />
          <button className={styles.removeImg} onClick={removeImage} title="Remover">✕</button>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${dragging ? styles.dragging : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <span className={styles.dropIcon}>🖼</span>
          <span className={styles.dropText}>Arraste uma imagem ou <u>clique para selecionar</u></span>
          <span className={styles.dropHint}>JPG, PNG, GIF, WEBP</span>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Divider */}
      <div className={styles.divider}><span>ou verifique por texto</span></div>

      {/* Textarea */}
      <div className={styles.inputWrap}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o texto, título ou afirmação que deseja verificar..."
          rows={4}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) verify(); }}
        />
        <div className={styles.inputFooter}>
          <span className={styles.hint}>⌘ + Enter para verificar</span>
          <button className={styles.btnPrimary} onClick={verify} disabled={!canVerify}>
            Verificar →
          </button>
        </div>
      </div>
    </div>
  );
}
