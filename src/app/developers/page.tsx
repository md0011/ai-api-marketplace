import Link from "next/link";
import { ArrowUpRight, Check, Code2, CreditCard, Globe } from "lucide-react";
import styles from "./page.module.scss";

const steps = [
  {
    number: "01",
    title: "Define a service",
    description:
      "Expose a capability that an autonomous agent can call to accomplish a specific task.",
    icon: Code2,
  },
  {
    number: "02",
    title: "Set your price",
    description:
      "Choose a pay-per-request price so agents can access your service without subscriptions or API keys.",
    icon: CreditCard,
  },
  {
    number: "03",
    title: "Make it discoverable",
    description:
      "Publish your service capabilities so AgentMarket can match them with agent goals.",
    icon: Globe,
  },
];

export default function DevelopersPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>FOR DEVELOPERS</span>

          <h1>
            Build services
            <br />
            <span>agents can use.</span>
          </h1>

          <p>
            AgentMarket connects autonomous agents with services that can be
            discovered, selected and paid for programmatically.
          </p>

          <Link href="/agent" className={styles.primaryAction}>
            Explore Agent Playground
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>SERVICE PROVIDERS</span>
          <h2>Turn your capability into an agent-ready service.</h2>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article className={styles.step} key={step.number}>
                <div className={styles.stepTop}>
                  <span>{step.number}</span>

                  <div className={styles.icon}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3>{step.title}</h3>

                <p>{step.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.architecture}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>SERVICE ARCHITECTURE</span>
          <h2>A simple payment boundary.</h2>
        </div>

        <div className={styles.diagram}>
          <div className={styles.diagramItem}>
            <span>01</span>
            <strong>Agent</strong>
            <small>Goal + request</small>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.diagramItem}>
            <span>02</span>
            <strong>Your service</strong>
            <small>Capability endpoint</small>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.diagramItem}>
            <span>03</span>
            <strong>x402</strong>
            <small>Payment boundary</small>
          </div>

          <div className={styles.arrow}>→</div>

          <div className={styles.diagramItem}>
            <span>04</span>
            <strong>Hedera</strong>
            <small>HBAR settlement</small>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <Check size={17} />
          <div>
            <strong>Pay per request</strong>
            <p>Charge agents only when your service is actually used.</p>
          </div>
        </div>

        <div className={styles.feature}>
          <Check size={17} />
          <div>
            <strong>No traditional API subscription</strong>
            <p>
              Let the payment happen at the request boundary instead of
              requiring a long-lived subscription.
            </p>
          </div>
        </div>

        <div className={styles.feature}>
          <Check size={17} />
          <div>
            <strong>Agent-native discovery</strong>
            <p>
              Describe what your service can do so agents can match it against
              their goals.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <span className={styles.eyebrow}>AGENTMARKET</span>

        <h2>Services become capabilities.</h2>

        <p>
          Build once. Let autonomous agents discover and use your service when
          they need it.
        </p>

        <Link href="/" className={styles.primaryAction}>
          Browse Marketplace
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}