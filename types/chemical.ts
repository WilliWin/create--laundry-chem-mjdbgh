
export interface Chemical {
  id: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  unit: string;
  usageHistory: UsageRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  id: string;
  date: string;
  amount: number;
  notes?: string;
}

export interface ChemicalFormData {
  name: string;
  openingBalance: string;
  unit: string;
}
