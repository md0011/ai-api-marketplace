export type ServiceCategory =
  | "AI"
  | "Research"
  | "Data"
  | "Media"
  | "Developer";

export interface APIService {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: ServiceCategory;
  price: string;
  unit: string;
  responseTime: string;
  status: "online" | "offline";
  capabilities: string[];
}