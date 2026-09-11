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
  transaction?: string;
  payer?: string;
}

interface ScoutAgent {
  agentId: string;
  name: string | null;
  description: string | null;
  mcpEndpoint: string | null;
  mcpVersion: string | null;
  x402Support: boolean;
}

interface AgentResult {
  success: boolean;
  serviceId: string;
  service: string;
  provider: string;
  price: string;
  unit: string;
  reasoning: string;
  evaluatedServices: number;
  result: string;
  payment: PaymentState;
  agents?: ScoutAgent[];
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

  const isGraphService = result?.serviceId === "agentscout";

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
        <>
          <div className={styles.discoveryBadge}>
            <Sparkles size={13} />
            <span>
              Agent discovered {result.evaluatedServices} services
            </span>
          </div>

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
                    : isGraphService && result.success
                      ? "GRAPH QUERY COMPLETE"
                      : result.payment.paid
                        ? "EXECUTION COMPLETE"
                        : "SERVICE SELECTED"}
                </span>

                <strong>{result.service}</strong>
              </div>

              <div className={styles.price}>
                {isGraphService
                  ? "THE GRAPH · LIVE"
                  : `${result.price} ${result.unit}`}
              </div>
            </div>

            <div className={styles.reasoning}>
              <div className={styles.reasoningHeader}>
                <span>AGENT DECISION</span>
                <strong>
                  {result.evaluatedServices} services evaluated
                </strong>
              </div>

              <p>{result.reasoning}</p>
            </div>

            {isGraphService && result.success && !executing && (
              <div className={styles.reasoning}>
                <div className={styles.reasoningHeader}>
                  <span>DATA SOURCE</span>
                  <strong>Live Graph data</strong>
                </div>

                <p>
                  AgentScout queried The Graph Agent0 data to discover
                  and rank ERC-8004 agents by capabilities and trust
                  signals. No HBAR payment was required for this query.
                </p>
              </div>
            )}

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
              </div>
            )}

            {result.payment.paid && !executing && (
              <div className={styles.confirmed}>
                <div className={styles.confirmedIcon}>
                  <ShieldCheck size={15} />
                </div>

                <div>
                  <span>PAYMENT SETTLED</span>
                  <strong>
                    {result.payment.amount} {result.payment.asset} settled on Hedera
                  </strong>

                  {result.payment.transaction && (
                    <div style={{ marginTop: "10px" }}>
                      <span>Transaction</span>
                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                          wordBreak: "break-all",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      >
                        {result.payment.transaction}
                      </strong>

                      <a
                        href={`https://hashscan.io/testnet/transaction/${encodeURIComponent(
                          result.payment.transaction,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          marginTop: "8px",
                          color: "#fff",
                          textDecoration: "none",
                        }}
                      >
                        View transaction
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  )}

                  {result.payment.payer && (
                    <div style={{ marginTop: "10px" }}>
                      <span>Payer</span>
                      <strong
                        style={{
                          display: "block",
                          marginTop: "4px",
                          fontFamily: "monospace",
                          fontSize: "12px",
                        }}
                      >
                        {result.payment.payer}
                      </strong>
                    </div>
                  )}
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

            {result.success &&
              result.serviceId === "agentscout" &&
              result.agents &&
              result.agents.length > 0 &&
              !executing && (
                <div className={styles.agentDiscovery}>
                  <div className={styles.outputHeader}>
                    <span>THE GRAPH · AGENT0</span>
                    <span>
                      {result.agents.length} matches
                    </span>
                  </div>

                  <div className={styles.agentList}>
                    {result.agents.map((agent) => (
                      <div
                        key={agent.agentId}
                        className={styles.agentCard}
                      >
                        <div className={styles.agentCardTop}>
                          <div>
                            <strong className={styles.agentName}>
                              {agent.name ?? `Agent ${agent.agentId}`}
                            </strong>

                            <span className={styles.agentId}>
                              ERC-8004 · {agent.agentId}
                            </span>
                          </div>

                          <div className={styles.agentBadges}>
                            <span className={styles.badge}>
                              MCP ✓
                            </span>

                            {agent.x402Support && (
                              <span className={styles.badge}>
                                x402 ✓
                              </span>
                            )}
                          </div>
                        </div>

                        {agent.description && (
                          <p>{agent.description}</p>
                        )}

                        <div className={styles.agentMeta}>
                          <span>
                            MCP {agent.mcpVersion ?? "supported"}
                          </span>

                          {agent.mcpEndpoint && (
                            <span>
                              Endpoint available
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {result.success &&
              result.serviceId !== "agentscout" &&
              result.result &&
              !executing && (
                <div className={styles.output}>
                  <div className={styles.outputHeader}>
                    <span>RESULT</span>
                    <span>Completed</span>
                  </div>

                  <pre>{result.result}</pre>
                </div>
              )}
          </div>
        </>
      )}

   
    </section>
  );
}