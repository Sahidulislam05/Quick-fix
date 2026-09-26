"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateCategoryAdmin,
  useUpdateCategoryAdmin,
} from "@/hooks/use-admin";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/lib/validations/category";
import type { Category } from "@/types/category";

type CategoryFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
};

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: CategoryFormDialogProps) {
  const createCategory = useCreateCategoryAdmin();
  const updateCategory = useUpdateCategoryAdmin();
  const isEdit = Boolean(category);
  const isPending = createCategory.isPending || updateCategory.isPending;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", description: "", icon: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name ?? "",
        description: category?.description ?? "",
        icon: category?.icon ?? "",
      });
    }
  }, [open, category, form]);

  async function onSubmit(values: CategoryFormValues) {
    const result = isEdit
      ? await updateCategory
          .mutateAsync({ id: category?.id ?? "", payload: values })
          .catch(() => null)
      : await createCategory.mutateAsync(values).catch(() => null);
    if (!result) return;
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit category" : "Add a new category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="category-icon">Icon</Label>
              <Input
                id="category-icon"
                placeholder="🔧"
                className="h-10 text-center"
                {...form.register("icon")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                className="h-10"
                {...form.register("name")}
              />
            </div>
          </div>
          {(form.formState.errors.icon || form.formState.errors.name) && (
            <p className="text-xs text-destructive">
              {form.formState.errors.icon?.message ??
                form.formState.errors.name?.message}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="category-description">Description</Label>
            <Textarea
              id="category-description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              {isEdit ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
