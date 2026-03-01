"use client";

import { Entry } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, getStatusBadgeVariant, capitalizeFirst } from "@/lib/utils";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface EntryCardProps {
  entry: Entry;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function EntryCard({ entry, onDelete, onApprove, onReject }: EntryCardProps) {
  const { isManager } = useAuth();
  const variant = getStatusBadgeVariant(entry.status);

  return (
    <Card className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-0 shadow-smooth bg-white overflow-hidden">
      <div className={`h-1.5 ${
        entry.status === 'pending' ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
        entry.status === 'approved' ? 'bg-gradient-to-r from-emerald-400 to-green-600' :
        'bg-gradient-to-r from-red-400 to-rose-600'
      }`} />
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <h3 className="font-bold text-lg leading-tight text-gray-800">{entry.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">{formatDate(entry.createdAt)}</span>
            </div>
          </div>
          <Badge variant={variant} className="shrink-0 px-3 py-1 text-xs font-semibold">
            {capitalizeFirst(entry.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{entry.description}</p>
        <div className="mt-5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Amount</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              {formatCurrency(entry.amount)}
            </p>
          </div>
          {isManager && (
            <div className="text-right space-y-1">
              <p className="text-xs text-gray-500 font-medium">Created by</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {entry.createdBy.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{entry.createdBy.email}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4 border-t border-gray-100 bg-gray-50/50">
        {isManager && entry.status === "pending" ? (
          <>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-sm"
              onClick={() => onApprove?.(entry._id)}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-sm"
              onClick={() => onReject?.(entry._id)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </>
        ) : !isManager ? (
          <Button
            size="sm"
            variant="outline"
            className="ml-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => onDelete?.(entry._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
