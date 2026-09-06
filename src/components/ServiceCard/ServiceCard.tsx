import {
  ArrowUpRight,
  Clock3,
  Zap,
} from "lucide-react";
import { APIService } from "@/types/service";
import styles from "./ServiceCard.module.scss";
import Link from "next/link";

interface ServiceCardProps {
  service: APIService;
}

export default function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div className={styles.icon}>
          <Zap size={16} />
        </div>

        <span className={styles.status}>
          <i />
          {service.status}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.category}>
          {service.category}
        </div>

        <h3>{service.name}</h3>

        <p>{service.description}</p>
      </div>

      <div className={styles.meta}>
        <div>
          <strong>{service.price}</strong>
          <span>{service.unit}</span>
        </div>

        <div className={styles.response}>
          <Clock3 size={13} />
          {service.responseTime}
        </div>
      </div>

      <Link
        href={`/services/${service.id}`}
        className={styles.explore}
      >
        Explore service
        <ArrowUpRight size={14} />
      </Link>
    </article>
  );
}