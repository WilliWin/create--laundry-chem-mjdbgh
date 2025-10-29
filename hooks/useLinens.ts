
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linen, LinenHistory } from '@/types/linen';

const STORAGE_KEY = '@laundry_linens';

export function useLinens() {
  const [linens, setLinens] = useState<Linen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinens();
  }, []);

  const loadLinens = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setLinens(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading linens:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLinens = async (newLinens: Linen[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newLinens));
      setLinens(newLinens);
    } catch (error) {
      console.error('Error saving linens:', error);
    }
  };

  const addLinen = async (name: string, type: 'towel' | 'bedsheet' | 'other', openingBalance: number) => {
    const newLinen: Linen = {
      id: Date.now().toString(),
      name,
      type,
      openingBalance,
      newCount: 0,
      dirtyCount: 0,
      thrownCount: 0,
      currentBalance: openingBalance,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveLinens([...linens, newLinen]);
  };

  const updateLinen = async (id: string, updates: Partial<Linen>) => {
    const updated = linens.map(linen =>
      linen.id === id ? { ...linen, ...updates, updatedAt: new Date().toISOString() } : linen
    );
    await saveLinens(updated);
  };

  const deleteLinen = async (id: string) => {
    const filtered = linens.filter(linen => linen.id !== id);
    await saveLinens(filtered);
  };

  const recordLinenAction = async (
    linenId: string,
    action: 'new' | 'dirty' | 'thrown',
    count: number,
    date: string,
    notes?: string
  ) => {
    const linen = linens.find(l => l.id === linenId);
    if (!linen) return;

    const historyRecord: LinenHistory = {
      id: Date.now().toString(),
      date,
      action,
      count,
      notes,
    };

    let newBalance = linen.currentBalance;
    let newCount = linen.newCount;
    let dirtyCount = linen.dirtyCount;
    let thrownCount = linen.thrownCount;

    switch (action) {
      case 'new':
        newCount += count;
        newBalance += count;
        break;
      case 'dirty':
        dirtyCount += count;
        break;
      case 'thrown':
        thrownCount += count;
        newBalance -= count;
        break;
    }

    const updatedLinen = {
      ...linen,
      newCount,
      dirtyCount,
      thrownCount,
      currentBalance: newBalance,
      history: [...linen.history, historyRecord],
      updatedAt: new Date().toISOString(),
    };

    const updated = linens.map(l => l.id === linenId ? updatedLinen : l);
    await saveLinens(updated);
  };

  return {
    linens,
    loading,
    addLinen,
    updateLinen,
    deleteLinen,
    recordLinenAction,
  };
}
