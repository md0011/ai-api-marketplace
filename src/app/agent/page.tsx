import Link from "next/link";
import { ArrowLeft, Bot, Sparkles } from "lucide-react";
import AgentPlayground from "@/components/AgentPlayground/AgentPlayground";
import styles from "./page.module.scss";

export default function AgentPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/" className={styles.back}>
          <ArrowLeft size={14} />
          Back to marketplace
        </Link>

        <header className={styles.header}>
          <div className={styles.headerMain}>
            <div className={styles.icon}>
              <Bot size={20} />
            </div>

            <div className={styles.headerCopy}>
              <span className={styles.eyebrow}>
                AGENT PLAYGROUND
              </span>

              <h1>Give your agent a goal.</h1>

              <p>
                Describe what you want done. AgentMarket discovers
                capabilities, chooses the right provider, and executes
                the request.
              </p>
            </div>
          </div>

          <div className={styles.status}>
            <span className={styles.statusDot} />
            Hedera Testnet
          </div>
        </header>

        <AgentPlayground />

        <div className={styles.note}>
          <Sparkles size={13} />
          <span>
            Agent autonomously discovers capabilities, selects services,
            and settles paid requests through Hedera x402 when required.
          </span>
        </div>
      </div>
    </main>
  );
}