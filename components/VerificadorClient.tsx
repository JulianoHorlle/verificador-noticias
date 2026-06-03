"use client";

import { useState } from "react";
import styles from "./VerificadorClient.module.css";

type Verdict = "verdadeiro" | "falso" | "parcialmente verdadeiro" | "não verificável";

interface Result {
  verdict: Verdict;
  analysis: string;
  sources: string[];
}

const EXAMPLES = [
  "Brasil é o maior produtor de café do mundo",
  "A lua é maior que Marte",
  "A vacina contra COVID-19 contém microchips",
  "O Amazonas é o rio mais longo do mundo",
];

const VERDICT_CONFIG: Record<Verdict, { label: string; icon: string; cls: string }> = {
  verdadeiro: { label: "Verdadeiro", icon: "✓", cls: styles.vTrue },
  falso: { label: "Falso", icon: "✗", cls: styles.vFalse },
  "parcialmente verdadeiro": { label: "Parcialmente verdadeiro", icon: "~", cls: styles.vPartial },
  "não verificável": { label: "Não verificável", icon: "?", cls: styles.vUnclear },
};

const LOAD_STEPS = [
  "Buscando informações na web...",
  "Cruzando fontes confiáveis...",
  "Avaliando a veracidade...",
  "Preparando o veredito...",
];

export default function VerificadorClient() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function verify() {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setLoadStep(0);

    const interval = setInterval(() => {
      setLoadStep((s) => (s + 1) % LOAD_STEPS.length);
    }, 1800);

    try {
      const res = await fetch("/api/verificar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro desconhecido");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao verificar. Tente novamente.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setText("");
  }

  if (loading) {
    return (
      <div className={styles.loadingCard}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Analisando a notícia...</p>
        <p className={styles.loadingStep}>{LOAD_STEPS[loadStep]}</p>
      </div>
    );
  }

  if (result) {
    const v = VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG["não verificável"];
    return (
      <div>
        <div className={`${styles.resultCard} ${v.cls}`}>
          <div className={styles.verdictBanner}>
            <div className={styles.verdictIcon}>{v.icon}</div>
            <div>
              <div className={styles.verdictLabel}>{v.label}</div>
            </div>
          </div>
          <div className={styles.resultBody}>
            <p className={styles.sectionLabel}>Análise</p>
            <p className={styles.analysisText}>{result.analysis}</p>
            {result.sources?.length > 0 && (
              <div className={styles.sources}>
                <p className={styles.sectionLabel}>Fontes consultadas</p>
                {result.sources.map((s, i) => (
                  <div key={i} className={styles.sourceItem}>
                    <span className={styles.sourceDot} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className={styles.btnSecondary} onClick={reset}>
          ↺ Verificar outra notícia
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className={styles.errorCard}>{error}</div>
        <button className={styles.btnSecondary} onClick={reset}>
          ↺ Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.examples}>
        <p className={styles.examplesLabel}>Exemplos para testar</p>
        <div className={styles.chips}>
          {EXAMPLES.map((e) => (
            <button key={e} className={styles.chip} onClick={() => setText(e)}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.inputCard}>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole aqui o texto, título ou afirmação que deseja verificar..."
          rows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) verify();
          }}
        />
        <div className={styles.inputFooter}>
          <span className={styles.hint}>⌘ + Enter para verificar</span>
          <button
            className={styles.btnPrimary}
            onClick={verify}
            disabled={text.trim().length < 5}
          >
            Verificar →
          </button>
        </div>
      </div>
    </div>
  );
}
