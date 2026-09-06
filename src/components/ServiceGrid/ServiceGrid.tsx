"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { services } from "@/data/services";
import { ServiceCategory } from "@/types/service";
import ServiceCard from "@/components/ServiceCard/ServiceCard";

import styles from "./ServiceGrid.module.scss";

const categories = [
  "All",
  "AI",
  "Research",
  "Data",
  "Media",
  "Developer",
] as const;

type Category = (typeof categories)[number];

export default function ServiceGrid() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        category === "All" ||
        service.category === (category as ServiceCategory);

      const searchText = [
        service.name,
        service.provider,
        service.description,
        service.category,
        ...service.capabilities,
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchText.includes(
        query.toLowerCase(),
      );

      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <section id="services" className={styles.section}>
      <div className={styles.heading}>
        <div>
          <span>DISCOVER</span>
          <h2>Services for agents</h2>
        </div>

        <p>
          Browse agent-ready APIs and services.
          Pay only when your agent uses them.
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.search}>
          <Search size={15} />
          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search services..."
          />
        </div>

        <div className={styles.categories}>
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item ? styles.active : ""
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className={styles.empty}>
          No services found.
        </div>
      )}
    </section>
  );
}