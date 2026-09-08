export type ServiceCategory =
  | "AI"
  | "Research"
  | "Data"
  | "Media"
  | "Developer";

export interface ServicePayment {
  method: "x402";
  network: "hedera-testnet";
  asset: "HBAR";
  amount: string;
}

export interface APIService {
  id: string;
  name: string;
  provider: string;
  description: string;
  category: ServiceCategory;
  price: string;
  unit: string;
  status: "online" | "offline";
  responseTime: string;
  capabilities: string[];
  payment: ServicePayment;
}