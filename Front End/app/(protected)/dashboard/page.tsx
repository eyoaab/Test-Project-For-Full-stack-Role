"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEntries } from "@/hooks/useEntries";
import { EntryTable } from "@/components/entries/entry-table";
import { EntryCard } from "@/components/entries/entry-card";
import { CreateEntryDialog } from "@/components/entries/create-entry-dialog";
import { StatsCard } from "@/components/entries/stats-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, CheckCircle, XCircle, Clock, Search, LayoutGrid, List, Loader2 } from "lucide-react";
import { EntryStatus } from "@/types";
import { CreateEntryFormData } from "@/lib/validations";
import { toast } from "sonner";

export default function DashboardPage() {
  const { isManager } = useAuth();
  const { entries, stats, isLoading, fetchEntries, createEntry, updateStatus, deleteEntry, applyFilters } = useEntries();
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all");

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteEntry(id);
    } catch (error) {
    }
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isManager ? "All Entries" : "My Entries"}
          </h1>
          <p className="text-muted-foreground">
            {isManager
              ? "Manage and approve entries from all users"
              : "Create and manage your entries"}
          </p>
        </div>
        {!isManager && <CreateEntryDialog onSubmit={handleCreateEntry} />}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Entries"
          value={stats.total}
          icon={FileText}
          color="bg-blue-600"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-yellow-600"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="bg-green-600"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="bg-red-600"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isManager ? "Search by title, description, or user email..." : "Search entries..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EntryStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
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
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
