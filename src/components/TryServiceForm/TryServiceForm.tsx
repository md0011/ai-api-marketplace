"use client";

import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Check,
  CircleDollarSign,
  LoaderCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { APIService } from "@/types/service";

import styles from "./TryServiceForm.module.scss";

interface PaymentState {
  required: boolean;
  paid: boolean;
  method: string;
  network: string;
  asset: string;
  amount: string;
  message: string;
}

export default function TryServiceForm({
  service,
}: {
  service: APIService;
}) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [payment, setPayment] = useState<PaymentState | null>(null);

  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [executing, setExecuting] = useState(false);

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
    setPayment(null);

    try {
      const response = await fetch("/api/services/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service.id,
          input: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setPayment(data.payment);
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

  async function handleApprovePayment() {
    setPaymentLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payments/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service.id,
          input: prompt.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment approval failed.");
      }

      setPayment(data.payment);
      setPaymentLoading(false);
      setExecuting(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setResult(data.result);
      setExecuting(false);
    } catch (err) {
      setPaymentLoading(false);
      setExecuting(false);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    }
  }

  const paymentPending = payment?.required && !payment.paid;

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
        <div className={styles.field}>
          <label className={styles.label} htmlFor="prompt">
            What would you like the service to do?
          </label>

          <textarea
            id="prompt"
            className={styles.textarea}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={
              service.category === "Media"
                ? "Example: A premium product photograph of a black running shoe on a minimal studio background..."
                : "Describe what you want this service to do..."
            }
            rows={8}
            disabled={loading || paymentLoading || executing}
          />
        </div>

        {error && (
          <p className={styles.error}>{error}</p>
        )}

        <button
          type="submit"
          className={styles.submit}
          disabled={loading || paymentLoading || executing}
        >
          {loading ? (
            <>
              <LoaderCircle
                size={15}
                className={styles.spinner}
              />
              Finding service...
            </>
          ) : (
            <>
              Request service
              <ArrowUpRight size={15} />
            </>
          )}
        </button>

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
                <span>Service</span>
                <strong>{service.name}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  {payment.amount} {payment.asset}
                </strong>
              </div>

              <div>
                <span>Network</span>
                <strong>Hedera Testnet</strong>
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
                    size={15}
                    className={styles.spinner}
                  />
                  Confirming payment...
                </>
              ) : (
                <>
                  Approve payment
                  <ArrowUpRight size={15} />
                </>
              )}
            </button>

            <p className={styles.demoNotice}>
              Demo payment only. Real Hedera settlement will be
              connected in the next stage.
            </p>
          </div>
        )}

        {payment?.paid && !executing && (
          <div className={styles.confirmed}>
            <div className={styles.confirmedIcon}>
              <ShieldCheck size={15} />
            </div>

            <div>
              <span>PAYMENT CONFIRMED</span>
              <strong>
                {payment.amount} {payment.asset} approved
              </strong>
            </div>

            <Check size={15} />
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
              <strong>
                Processing {service.name} request...
              </strong>
            </div>
          </div>
        )}

        {result && !executing && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <div className={styles.resultTitle}>
                <span className={styles.resultLabel}>
                  Execution result
                </span>

                <strong>{service.name}</strong>
              </div>

              <span className={styles.resultStatus}>
                <Check size={12} />
                Completed
              </span>
            </div>

            <pre className={styles.resultText}>{result}</pre>
          </div>
        )}
      </form>
    </section>
  );
}