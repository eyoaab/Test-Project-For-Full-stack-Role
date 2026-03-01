"use client";

import { Entry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusBadgeVariant, capitalizeFirst } from "@/lib/utils";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EntryTableProps {
  entries: Entry[];
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRowClick?: (entry: Entry) => void;
}

export function EntryTable({ entries, onDelete, onApprove, onReject, onRowClick }: EntryTableProps) {
  const { isManager } = useAuth();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No entries found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Title</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Description</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Status</th>
              {isManager && <th className="text-left p-4 font-medium hidden lg:table-cell">Created By</th>}
              <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {entries.map((entry) => {
              const variant = getStatusBadgeVariant(entry.status);
              return (
                <tr 
                  key={entry._id} 
                  className="hover:bg-purple-50/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(entry)}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-800 truncate max-w-[200px]">{entry.title}</div>
                    <div className="text-sm text-gray-500 md:hidden truncate max-w-[200px]">
                      {entry.description}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <div className="max-w-xs truncate text-sm text-gray-600">
                      {entry.description}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-primary">
                      {formatCurrency(entry.amount)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={variant}>{capitalizeFirst(entry.status)}</Badge>
                  </td>
                  {isManager && (
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-sm">{entry.createdBy.email}</div>
                    </td>
                  )}
                  <td className="p-4 hidden sm:table-cell">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(entry.createdAt)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {isManager && entry.status === "pending" ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove?.(entry._id);
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject?.(entry._id);
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      ) : !isManager ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(entry._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
