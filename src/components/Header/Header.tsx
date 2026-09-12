import Link from "next/link";
import { ArrowUpRight, Circle } from "lucide-react";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <Circle size={8} fill="currentColor" />
          </span>

          <span>
            agent<span>market</span>
          </span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/how-it-works">How it works</Link>
          <Link href="/developers">Developers</Link>
        </nav>

        <div className={styles.actions}>
          <Link href="/agent" className={styles.connectButton}>
            Launch Agent
            <ArrowUpRight size={14} />
          </Link>
          
        </div>
      </div>
    </header>
  );
}