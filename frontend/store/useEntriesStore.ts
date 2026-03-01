import { create } from "zustand";
import { Entry, EntryFilters } from "@/types";

interface EntriesState {
  entries: Entry[];
  isLoading: boolean;
  error: string | null;
  filters: EntryFilters;
  setEntries: (entries: Entry[]) => void;
  addEntry: (entry: Entry) => void;
  updateEntry: (id: string, updatedEntry: Partial<Entry>) => void;
  removeEntry: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: EntryFilters) => void;
  clearFilters: () => void;
}

export const useEntriesStore = create<EntriesState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,
  filters: {},
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((state) => ({ entries: [entry, ...state.entries] })),
  updateEntry: (id, updatedEntry) =>
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry._id === id ? { ...entry, ...updatedEntry } : entry
      ),
    })),
  removeEntry: (id) =>
    set((state) => ({
      entries: state.entries.filter((entry) => entry._id !== id),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
}));
