"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEntries } from "@/hooks/useEntries";
import { EntryTable } from "@/components/entries/entry-table";
import { EntryCard } from "@/components/entries/entry-card";
import { CreateEntryDialog } from "@/components/entries/create-entry-dialog";
import { EntryDetailsDialog } from "@/components/entries/entry-details-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, LayoutGrid, List, Loader2 } from "lucide-react";
import { Entry, EntryStatus } from "@/types";
import { CreateEntryFormData } from "@/lib/validations";

export default function EntriesPage() {
  const { isManager } = useAuth();
  const { entries, isLoading, fetchEntries, createEntry, updateStatus, deleteEntry } = useEntries();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateEntry = async (data: CreateEntryFormData) => {
    await createEntry(data);
    fetchEntries();
  };

  const handleApprove = async (id: string) => {
    try {
      await updateStatus(id, { status: "approved" });
    } catch (error) {
    }
  };

  const handleReject = async (id: string) => {
    try {
      await updateStatus(id, { status: "rejected" });
    } catch (error) {
    }
  };

  const handleDelete = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;
    try {
      await deleteEntry(entryToDelete);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    } catch (error) {
    }
  };

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setDetailsDialogOpen(true);
  };

  const filteredEntries = (Array.isArray(entries) ? entries : []).filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (isManager && entry.createdBy.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            {isManager ? "All Entries" : "My Entries"}
          </h1>
          <p className="text-gray-600 text-base">
            {isManager
              ? "View and manage entries from all users"
              : "Create and manage your personal entries"}
          </p>
        </div>
        {!isManager && <CreateEntryDialog onSubmit={handleCreateEntry} />}
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-2xl shadow-smooth p-6 border border-purple-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
            <Input
              placeholder={isManager ? "Search by title, description, or user email..." : "Search entries..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-purple-100 focus:border-purple-300 rounded-xl"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EntryStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[200px] h-12 border-purple-100 rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
              className={viewMode === "table" ? "gradient-primary text-white h-12 w-12" : "h-12 w-12 border-purple-100 hover:bg-purple-50"}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "gradient-primary text-white h-12 w-12" : "h-12 w-12 border-purple-100 hover:bg-purple-50"}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Entries Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : viewMode === "table" ? (
        <EntryTable
          entries={filteredEntries}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          onRowClick={handleEntryClick}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No entries found</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onDelete={handleDelete}
                onApprove={handleApprove}
                onReject={handleReject}
                onClick={handleEntryClick}
              />
            ))
          )}
        </div>
      )}

      <EntryDetailsDialog
        entry={selectedEntry}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
