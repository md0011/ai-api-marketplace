"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  Check,
  CircleDollarSign,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import styles from "./AgentPlayground.module.scss";

interface PaymentState {
  required: boolean;
  paid: boolean;
  method: string;
  network: string;
  asset: string;
  amount: string;
  message: string;
}

interface AgentResult {
  success: boolean;
  serviceId: string;
  service: string;
  provider: string;
  price: string;
  unit: string;
  reasoning: string;
  result: string;
  payment: PaymentState;
}

export default function AgentPlayground() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
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

  async function handleApprovePayment() {
    if (!result) return;

    setPaymentLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: result.serviceId,
          input: goal.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment approval failed.");
      }

      setResult((current) =>
        current
          ? {
              ...current,
              payment: data.payment,
              result: "",
              success: false,
            }
          : current,
      );

      setPaymentLoading(false);
      setExecuting(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setResult((current) =>
        current
          ? {
              ...current,
              success: data.success,
              payment: data.payment,
              result: data.result,
            }
          : current,
      );

      setExecuting(false);
    } catch (error) {
      setPaymentLoading(false);
      setExecuting(false);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    }
  }

  const paymentPending =
    result?.payment?.required && !result.payment.paid;

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
          disabled={loading || paymentLoading || executing}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          className={styles.submit}
          disabled={loading || paymentLoading || executing}
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
            <div
              className={
                result.payment.paid
                  ? styles.success
                  : styles.serviceIcon
              }
            >
              {result.payment.paid ? (
                <Check size={14} />
              ) : (
                <Bot size={14} />
              )}
            </div>

            <div>
              <span>
                {executing
                  ? "EXECUTING SERVICE"
                  : result.payment.paid
                    ? "EXECUTION COMPLETE"
                    : "SERVICE SELECTED"}
              </span>

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

          {paymentPending && (
            <div className={styles.paymentCard}>
              <div className={styles.paymentHeader}>
                <div className={styles.paymentIcon}>
                  <CircleDollarSign size={17} />
                </div>

                <div>
                  <span>PAYMENT REQUIRED</span>
                  <strong>Approve this request</strong>
                </div>
              </div>

              <div className={styles.paymentDetails}>
                <div>
                  <span>Amount</span>
                  <strong>
                    {result.payment.amount} {result.payment.asset}
                  </strong>
                </div>

                <div>
                  <span>Network</span>
                  <strong>Hedera Testnet</strong>
                </div>

                <div>
                  <span>Method</span>
                  <strong>{result.payment.method}</strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.paymentButton}
                onClick={handleApprovePayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className={styles.spinner}
                    />
                    Confirming payment...
                  </>
                ) : (
                  <>
                    Approve payment
                    <ArrowUpRight size={16} />
                  </>
                )}
              </button>

              <p className={styles.demoNotice}>
                Demo payment only. Real Hedera settlement will be
                connected in the next stage.
              </p>
            </div>
          )}

          {result.payment.paid && !executing && (
            <div className={styles.confirmed}>
              <div className={styles.confirmedIcon}>
                <ShieldCheck size={15} />
              </div>

              <div>
                <span>PAYMENT CONFIRMED</span>
                <strong>
                  {result.payment.amount} {result.payment.asset} approved
                </strong>
              </div>
            </div>
          )}

          {executing && (
            <div className={styles.executing}>
              <LoaderCircle
                size={17}
                className={styles.spinner}
              />

              <div>
                <span>EXECUTING SERVICE</span>
                <strong>Processing request...</strong>
              </div>
            </div>
          )}

          {result.success && result.result && !executing && (
            <div className={styles.output}>
              <div className={styles.outputHeader}>
                <span>RESULT</span>
                <span>Completed</span>
              </div>

              <pre>{result.result}</pre>
            </div>
          )}
        </div>
      )}
    </section>
  );
}