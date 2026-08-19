import VerificadorClient from "@/components/VerificadorClient";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* Linha de topo */}
      <div className={styles.topline} />

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.nav}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>PC</div>
            <div>
              <strong className={styles.brandName}>Ponto de Checagem</strong>
              <small className={styles.brandSub}>Verificador de Notícias</small>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div>
            <span className={styles.eyebrow}>IA + Busca em tempo real</span>
            <h1 className={styles.heroTitle}>Verificador<br />de Notícias</h1>
            <p className={styles.heroDesc}>
              Cole uma afirmação, título ou texto de notícia. A inteligência artificial pesquisa na web, cruza fontes e entrega um veredito em segundos.
            </p>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <strong>4</strong>
              <span>Vereditos possíveis</span>
            </div>
            <div className={styles.statItem}>
              <strong>∞</strong>
              <span>Fontes consultadas</span>
            </div>
            <div className={styles.statItem}>
              <strong>&lt;10s</strong>
              <span>Tempo médio</span>
            </div>
          </div>
        </div>
      </section>

      {/* Verificador */}
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <VerificadorClient />
        </div>
      </main>

      {/* Como funciona */}
      <section className={styles.steps}>
        <div className={styles.stepsInner}>
          <span className={styles.eyebrow2}>Como funciona</span>
          <h2 className={styles.stepsTitle}>Antes de compartilhar, verifique.</h2>
          <div className={styles.stepsGrid}>
            {[
              { n: "01", title: "Cole o conteúdo", desc: "Insira o texto, título ou afirmação que deseja verificar." },
              { n: "02", title: "IA pesquisa", desc: "A inteligência artificial busca informações em fontes confiáveis." },
              { n: "03", title: "Cruza os dados", desc: "O sistema compara o conteúdo com o que foi encontrado." },
              { n: "04", title: "Veredito claro", desc: "Receba análise detalhada com fontes e classificação." },
              { n: "05", title: "Compartilhe com segurança", desc: "Agora você pode agir com informação verificada." },
            ].map((s) => (
              <div key={s.n} className={styles.step}>
                <strong className={styles.stepNum}>{s.n}</strong>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footInner}>
          <div>
            <div className={styles.footBrand}>PONTO DE CHECAGEM</div>
            <small>Verificador de Notícias • Powered by Claude + Web Search</small>
          </div>
          <div>
            <small>Os resultados são orientativos. Sempre confirme em fontes primárias.</small>
          </div>
        </div>
      </footer>
    </>
  );
}
