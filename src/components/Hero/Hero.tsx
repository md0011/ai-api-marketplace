import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.eyebrow}>
        <Sparkles size={13} />
        The marketplace for autonomous agents
      </div>

      <h1>
        Give your agents
        <br />
        <span>access to the world.</span>
      </h1>

      <p>
        Discover AI services, tools and APIs that agents can
        use and pay for autonomously — one request at a time.
      </p>

      <div className={styles.actions}>
        <a href="#services" className={styles.primary}>
          Explore services
          <ArrowRight size={16} />
        </a>

      </div>

      <div className={styles.signal}>
        <span />
        <span />
        <span />
        Built for the agent economy
      </div>
    </section>
  );
}