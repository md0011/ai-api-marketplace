"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Check,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import styles from "./AgentPlayground.module.scss";

interface AgentResult {
  service: string;
  provider: string;
  price: string;
  unit: string;
  reasoning: string;
  result: string;
}

export default function AgentPlayground() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!goal.trim()) {
      setError("Give the agent a goal first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: goal.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Agent execution failed.");
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div className={styles.agentIcon}>
            <Bot size={18} />
          </div>

          <div>
            <span>AGENT REQUEST</span>
            <strong>What do you want to accomplish?</strong>
          </div>
        </div>

        <textarea
          className={styles.textarea}
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          placeholder="Example: Create a premium product image for my skincare brand."
          disabled={loading}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submit}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle
                size={16}
                className={styles.spinner}
              />
              Agent is working...
            </>
          ) : (
            <>
              Run agent
              <ArrowUpRight size={16} />
            </>
          )}
        </button>
      </form>

      {loading && (
        <div className={styles.thinking}>
          <div className={styles.thinkingIcon}>
            <Sparkles size={16} />
          </div>

          <div>
            <strong>Agent is finding the right service</strong>
            <span>
              Evaluating available API capabilities...
            </span>
          </div>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultTop}>
            <div className={styles.success}>
              <Check size={14} />
            </div>

            <div>
              <span>EXECUTION COMPLETE</span>
              <strong>{result.service}</strong>
            </div>

            <div className={styles.price}>
              {result.price} {result.unit}
            </div>
          </div>

          <div className={styles.reasoning}>
            <span>AGENT DECISION</span>
            <p>{result.reasoning}</p>
          </div>

          <div className={styles.output}>
            <div className={styles.outputHeader}>
              <span>RESULT</span>
              <span>Completed</span>
            </div>

            <pre>{result.result}</pre>
          </div>
        </div>
      )}
    </section>
  );
}