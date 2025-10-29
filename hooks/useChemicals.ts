
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chemical, UsageRecord } from '@/types/chemical';

const STORAGE_KEY = '@laundry_chemicals';

export function useChemicals() {
  const [chemicals, setChemicals] = useState<Chemical[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChemicals();
  }, []);

  const loadChemicals = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setChemicals(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading chemicals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveChemicals = async (newChemicals: Chemical[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newChemicals));
      setChemicals(newChemicals);
    } catch (error) {
      console.error('Error saving chemicals:', error);
    }
  };

  const addChemical = async (name: string, openingBalance: number, unit: string) => {
    const newChemical: Chemical = {
      id: Date.now().toString(),
      name,
      openingBalance,
      currentBalance: openingBalance,
      unit,
      usageHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveChemicals([...chemicals, newChemical]);
  };

  const updateChemical = async (id: string, updates: Partial<Chemical>) => {
    const updated = chemicals.map(chem =>
      chem.id === id ? { ...chem, ...updates, updatedAt: new Date().toISOString() } : chem
    );
    await saveChemicals(updated);
  };

  const deleteChemical = async (id: string) => {
    const filtered = chemicals.filter(chem => chem.id !== id);
    await saveChemicals(filtered);
  };

  const addUsage = async (chemicalId: string, amount: number, date: string, notes?: string) => {
    const chemical = chemicals.find(c => c.id === chemicalId);
    if (!chemical) return;

    const usageRecord: UsageRecord = {
      id: Date.now().toString(),
      date,
      amount,
      notes,
    };

    const newBalance = chemical.currentBalance - amount;
    const updatedChemical = {
      ...chemical,
      currentBalance: newBalance,
      usageHistory: [...chemical.usageHistory, usageRecord],
      updatedAt: new Date().toISOString(),
    };

    const updated = chemicals.map(c => c.id === chemicalId ? updatedChemical : c);
    await saveChemicals(updated);
  };

  const getLowStockChemicals = () => {
    return chemicals.filter(chem => chem.currentBalance <= 1);
  };

  return {
    chemicals,
    loading,
    addChemical,
    updateChemical,
    deleteChemical,
    addUsage,
    getLowStockChemicals,
  };
}
