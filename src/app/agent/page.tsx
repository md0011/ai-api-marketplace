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
          <div className={styles.icon}>
            <Bot size={20} />
          </div>

          <div>
            <span className={styles.eyebrow}>AGENT PLAYGROUND</span>
            <h1>Give your agent a goal.</h1>
            <p>
              Describe what you want done. AgentMarket will find the right
              service and execute the request.
            </p>
          </div>
        </header>

        <AgentPlayground />

        <div className={styles.note}>
          <Sparkles size={14} />
          <span>
            Autonomous service selection is currently running in demo mode.
          </span>
        </div>
      </div>
    </main>
  );
}