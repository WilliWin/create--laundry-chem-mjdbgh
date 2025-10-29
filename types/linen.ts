
export interface Linen {
  id: string;
  name: string;
  type: 'towel' | 'bedsheet' | 'other';
  openingBalance: number;
  newCount: number;
  dirtyCount: number;
  thrownCount: number;
  currentBalance: number;
  history: LinenHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface LinenHistory {
  id: string;
  date: string;
  action: 'new' | 'dirty' | 'thrown';
  count: number;
  notes?: string;
}

export interface LinenFormData {
  name: string;
  type: 'towel' | 'bedsheet' | 'other';
  openingBalance: string;
}
