import VerificadorClient from "@/components/VerificadorClient";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3rem 1rem 4rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "640px" }}>
        <header style={{ marginBottom: "2.5rem", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--bg-subtle)",
              border: "0.5px solid var(--border)",
              borderRadius: "20px",
              padding: "5px 14px",
              fontSize: "12px",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
              letterSpacing: "0.04em",
            }}
          >
            IA + busca em tempo real
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "0.75rem",
            }}
          >
            Verificador de notícias
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--text-muted)",
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            Cole uma afirmação ou título de notícia. A IA pesquisa na web e
            entrega um veredito com análise em segundos.
          </p>
        </header>

        <VerificadorClient />

        <footer
          style={{
            marginTop: "3rem",
            textAlign: "center",
            fontSize: "12px",
            color: "var(--text-faint)",
          }}
        >
          Powered by Claude + web search · Os resultados são orientativos,
          sempre confirme em fontes primárias.
        </footer>
      </div>
    </main>
  );
}
