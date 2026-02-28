import { useEffect, useState } from "react";
import { useEntriesStore } from "@/store/useEntriesStore";
import { entriesApi, handleApiError } from "@/lib/api";
import { useAuth } from "./useAuth";
import { Entry, CreateEntryData, UpdateEntryStatusData, EntryFilters } from "@/types";
import { toast } from "sonner";

export function useEntries() {
  const { token, isManager } = useAuth();
  const {
    entries,
    isLoading,
    error,
    filters,
    setEntries,
    addEntry,
    updateEntry,
    removeEntry,
    setLoading,
    setError,
    setFilters,
  } = useEntriesStore();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    const newStats = {
      total: entries.length,
      pending: entries.filter((e) => e.status === "pending").length,
      approved: entries.filter((e) => e.status === "approved").length,
      rejected: entries.filter((e) => e.status === "rejected").length,
    };
    setStats(newStats);
  }, [entries]);

  const fetchEntries = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      let data: Entry[];
      if (isManager) {
        data = await entriesApi.getAllEntries(token, filters);
      } else {
        data = await entriesApi.getMyEntries(token);
      }

      setEntries(data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entryData: CreateEntryData) => {
    if (!token) return;

    try {
      const newEntry = await entriesApi.createEntry(entryData, token);
      addEntry(newEntry);
      toast.success("Entry created successfully");
      return newEntry;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateStatus = async (id: string, statusData: UpdateEntryStatusData) => {
    if (!token) return;

    try {
      const updatedEntry = await entriesApi.updateEntryStatus(id, statusData, token);
      updateEntry(id, updatedEntry);
      toast.success(`Entry ${statusData.status}`);
      return updatedEntry;
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteEntry = async (id: string) => {
    if (!token) return;

    try {
      await entriesApi.deleteEntry(id, token);
      removeEntry(id);
      toast.success("Entry deleted successfully");
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
      throw err;
    }
  };

  const applyFilters = (newFilters: EntryFilters) => {
    setFilters(newFilters);
  };

  return {
    entries,
    isLoading,
    error,
    stats,
    filters,
    fetchEntries,
    createEntry,
    updateStatus,
    deleteEntry,
    applyFilters,
  };
}
