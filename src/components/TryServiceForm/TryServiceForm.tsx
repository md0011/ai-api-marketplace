"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, ArrowUpRight, LoaderCircle, Sparkles } from "lucide-react";

import { APIService } from "@/types/service";

import styles from "./TryServiceForm.module.scss";

interface TryServiceFormProps {
  service: APIService;
}

export default function TryServiceForm({
  service,
}: TryServiceFormProps) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Enter a request before continuing.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/services/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service.id,
          input: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong.",
        );
      }

      setResult(data.result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div>
          <span>REQUEST</span>

          <h2>Send a request</h2>
        </div>

        <div className={styles.agentBadge}>
          <Sparkles size={13} />
          Agent ready
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">
          What would you like the service to do?
        </label>

        <textarea
          id="prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={
            service.category === "Media"
              ? "Example: A premium product photograph of a black running shoe on a minimal studio background..."
              : "Describe what you want this service to do..."
          }
          rows={8}
          disabled={loading}
        />

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle
                size={15}
                className={styles.spinner}
              />
              Executing request...
            </>
          ) : (
            <>
              Run service
              <ArrowUpRight size={15} />
            </>
          )}
        </button>

      {result && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <span className={styles.resultLabel}>Execution result</span>
            <span className={styles.resultStatus}>Completed</span>
          </div>

          <pre className={styles.resultText}>{result}</pre>
        </div>
      )}
    </form>
    </section>
  );
}