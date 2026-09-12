import Link from "next/link";
import { ArrowUpRight, Check, CircleDollarSign, Search, Zap } from "lucide-react";
import styles from "./page.module.scss";

const steps = [
  {
    number: "01",
    title: "Give your agent a goal",
    description:
      "Describe what you want done in natural language. AgentMarket turns the goal into an executable service request.",
    icon: Search,
  },
  {
    number: "02",
    title: "Discover the right capability",
    description:
      "AgentMarket evaluates available services and agents, then identifies the capability that best matches the request.",
    icon: Zap,
  },
  {
    number: "03",
    title: "Choose and execute",
    description:
      "The agent selects the best provider and sends the request directly to the selected service.",
    icon: Check,
  },
  {
    number: "04",
    title: "Pay per request",
    description:
      "When a service requires payment, x402 handles the payment boundary and settles the request on Hedera.",
    icon: CircleDollarSign,
  },
];

export default function HowItWorksPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>HOW IT WORKS</span>

          <h1>
            Agents that can
            <br />
            <span>discover, decide & pay.</span>
          </h1>

          <p>
            AgentMarket gives autonomous agents access to services without
            traditional API keys, subscriptions, or manual payment steps.
          </p>

          <Link href="/agent" className={styles.primaryAction}>
            Try Agent Playground
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className={styles.flowSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>THE AGENT FLOW</span>
          <h2>From goal to result.</h2>
        </div>

        <div className={styles.steps}>
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div className={styles.step} key={step.number}>
                <div className={styles.stepTop}>
                  <span className={styles.stepNumber}>{step.number}</span>

                  <div className={styles.stepIcon}>
                    <Icon size={18} />
                  </div>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.techSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>THE INFRASTRUCTURE</span>
          <h2>Built for machine-to-machine commerce.</h2>
        </div>

        <div className={styles.techGrid}>
          <article className={styles.techCard}>
            <div className={styles.techLabel}>HEDERA</div>

            <h3>Pay per request with x402</h3>

            <p>
              Services can require payment before execution. AgentMarket
              automatically settles the request using HBAR on Hedera Testnet.
            </p>

            <div className={styles.techMeta}>
              <span>Hedera Testnet</span>
              <span>HBAR</span>
              <span>x402</span>
            </div>
          </article>

          <article className={styles.techCard}>
            <div className={styles.techLabel}>THE GRAPH · AGENT0</div>

            <h3>Discover agents from live data</h3>

            <p>
              AgentMarket can query live onchain agent registration and
              reputation data to discover and rank agents based on a goal.
            </p>

            <div className={styles.techMeta}>
              <span>ERC-8004</span>
              <span>MCP</span>
              <span>x402</span>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <span className={styles.eyebrow}>READY TO TRY IT?</span>

        <h2>Give the agent a goal.</h2>

        <p>
          Let AgentMarket discover the capability, choose a provider and
          execute the request.
        </p>

        <Link href="/agent" className={styles.primaryAction}>
          Launch Agent Playground
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </main>
  );
}