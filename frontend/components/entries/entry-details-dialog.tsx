"use client";

import { memo } from "react";
import { Entry } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusBadgeVariant, capitalizeFirst } from "@/lib/utils";
import { Calendar, DollarSign, User, FileText, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EntryDetailsDialogProps {
  entry: Entry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function EntryDetailsDialogComponent({
  entry,
  open,
  onOpenChange,
  onDelete,
  onApprove,
  onReject,
}: EntryDetailsDialogProps) {
  const { isManager } = useAuth();

  if (!entry) return null;

  const variant = getStatusBadgeVariant(entry.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] shadow-elegant">
        <DialogHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-2">
                {entry.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant={variant} className="px-3 py-1">
                  {capitalizeFirst(entry.status)}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <FileText className="h-4 w-4 text-purple-600" />
              Description
            </div>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">
              {entry.description}
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign className="h-4 w-4 text-purple-600" />
              Amount
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {formatCurrency(entry.amount)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Created By */}
            {isManager && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="h-4 w-4 text-purple-600" />
                  Created By
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-xl">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {entry.createdBy.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{entry.createdBy.email}</span>
                </div>
              </div>
            )}

            {/* Created At */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Calendar className="h-4 w-4 text-purple-600" />
                Created At
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <p className="text-sm font-medium text-gray-700">{formatDate(entry.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            {isManager && entry.status === "pending" ? (
              <>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md"
                  onClick={() => {
                    onApprove?.(entry._id);
                    onOpenChange(false);
                  }}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Approve Entry
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-md"
                  onClick={() => {
                    onReject?.(entry._id);
                    onOpenChange(false);
                  }}
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Reject Entry
                </Button>
              </>
            ) : !isManager ? (
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => {
                  onDelete?.(entry._id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Entry
              </Button>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">
                  This entry has been {entry.status}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const EntryDetailsDialog = memo(EntryDetailsDialogComponent);
