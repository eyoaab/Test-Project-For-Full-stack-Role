"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEntrySchema, type CreateEntryFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus } from "lucide-react";

interface CreateEntryDialogProps {
  onSubmit: (data: CreateEntryFormData) => Promise<void>;
}

export function CreateEntryDialog({ onSubmit }: CreateEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEntryFormData>({
    resolver: zodResolver(createEntrySchema),
  });

  const handleFormSubmit = async (data: CreateEntryFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      reset();
      setOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-white hover:opacity-90 transition-opacity h-11 px-6 shadow-md">
          <Plus className="mr-2 h-5 w-5" />
          Create Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] shadow-elegant">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              ✨ Create New Entry
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Fill in the details below. Your entry will be submitted for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
                Entry Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Office Supplies Purchase"
                {...register("title")}
                disabled={isLoading}
                className="h-11 border-purple-100 focus:border-purple-300 rounded-lg"
              />
              {errors.title && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Provide details about this entry..."
                rows={4}
                {...register("description")}
                disabled={isLoading}
                className="border-purple-100 focus:border-purple-300 rounded-lg resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                Amount ($)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                  disabled={isLoading}
                  className="h-11 pl-8 border-purple-100 focus:border-purple-300 rounded-lg"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span>⚠️</span> {errors.amount.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-purple-100 hover:bg-purple-50"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="gradient-primary text-white hover:opacity-90 transition-opacity"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
