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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-lg leading-none">{entry.title}</h3>
            <p className="text-sm text-muted-foreground">{formatDate(entry.createdAt)}</p>
          </div>
          <Badge variant={variant}>{capitalizeFirst(entry.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{entry.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary">{formatCurrency(entry.amount)}</p>
          </div>
          {isManager && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Created by</p>
              <p className="text-sm font-medium">{entry.createdBy.email}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-3 border-t">
        {isManager && entry.status === "pending" ? (
          <>
            <Button
              size="sm"
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => onApprove?.(entry._id)}
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={() => onReject?.(entry._id)}
            >
              <XCircle className="mr-1 h-4 w-4" />
              Reject
            </Button>
          </>
        ) : !isManager ? (
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => onDelete?.(entry._id)}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
