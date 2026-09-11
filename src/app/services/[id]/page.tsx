import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Clock3, Zap } from "lucide-react";

import { services } from "@/data/services";

import styles from "./page.module.scss";

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <span>404</span>
          <h1>Service not found</h1>
          <p>
            The service you're looking for doesn't exist.
          </p>

          <Link href="/#services">
            <ArrowLeft size={15} />
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/#services" className={styles.back}>
          <ArrowLeft size={14} />
          Back to marketplace
        </Link>

        <div className={styles.layout}>
          <section className={styles.main}>
            <div className={styles.icon}>
              <Zap size={20} />
            </div>

            <div className={styles.category}>
              {service.category}
            </div>

            <h1>{service.name}</h1>

            <p className={styles.description}>
              {service.description}
            </p>

            <div className={styles.provider}>
              <span>PROVIDED BY</span>
              <strong>{service.provider}</strong>
            </div>

            <div className={styles.capabilities}>
              <span className={styles.label}>
                CAPABILITIES
              </span>

              <div className={styles.capabilityList}>
                {service.capabilities.map((capability) => (
                  <div
                    className={styles.capability}
                    key={capability}
                  >
                    <Check size={13} />
                    {capability}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className={styles.panel}>
            <div className={styles.panelHeader}>
              <span>API SERVICE</span>

              <div className={styles.status}>
                <i />
                {service.status}
              </div>
            </div>

            <div className={styles.price}>
              <span>PRICE PER REQUEST</span>

              <strong>{service.price}</strong>

              <small>{service.unit}</small>
            </div>

            <div className={styles.stats}>
              <div>
                <span>Response time</span>

                <strong>
                  <Clock3 size={13} />
                  {service.responseTime}
                </strong>
              </div>

              <div>
                <span>Payment</span>
                <strong>Per request</strong>
              </div>

              <div>
                <span>Agent ready</span>
                <strong>Yes</strong>
              </div>
            </div>

            <Link href="/agent" className={styles.primaryAction}>
              Use with Agent
              <ArrowUpRight size={15} />
            </Link>

            <p className={styles.note}>
              Payments will be handled automatically
              through the marketplace.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}