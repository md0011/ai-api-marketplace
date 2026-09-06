import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";

import { services } from "@/data/services";
import TryServiceForm from "@/components/TryServiceForm/TryServiceForm";

import styles from "./page.module.scss";

interface TryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TryServicePage({
  params,
}: TryPageProps) {
  const { id } = await params;

  const service = services.find((item) => item.id === id);

  if (!service) {
    return (
      <main className={styles.page}>
        <div className={styles.notFound}>
          <h1>Service not found</h1>

          <Link href="/#services">
            <ArrowLeft size={14} />
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link
          href={`/services/${service.id}`}
          className={styles.back}
        >
          <ArrowLeft size={14} />
          Back to {service.name}
        </Link>

        <div className={styles.header}>
          <div className={styles.icon}>
            <Zap size={18} />
          </div>

          <div>
            <span>{service.category}</span>
            <h1>Try {service.name}</h1>
          </div>
        </div>

        <div className={styles.layout}>
          <TryServiceForm service={service} />

          <aside className={styles.info}>
            <div className={styles.infoHeader}>
              <span>REQUEST INFO</span>

              <div className={styles.status}>
                <i />
                {service.status}
              </div>
            </div>

            <div className={styles.infoItem}>
              <span>Price</span>

              <strong>
                {service.price} {service.unit}
              </strong>
            </div>

            <div className={styles.infoItem}>
              <span>Response time</span>

              <strong>{service.responseTime}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Payment</span>

              <strong>Per request</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Execution</span>

              <strong>Agent ready</strong>
            </div>

            <div className={styles.notice}>
              <strong>Demo environment</strong>

              <p>
                This request currently runs locally.
                Blockchain payments will be added in
                the next stage.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}