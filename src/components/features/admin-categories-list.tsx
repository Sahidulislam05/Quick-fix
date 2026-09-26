"use client";

import { useState } from "react";
import { CategoryFormDialog } from "@/components/features/category-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardGridSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

export function AdminCategoriesList() {
  const categoriesQuery = useCategories();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Add category</Button>
      </div>

      {categoriesQuery.isLoading && <CardGridSkeleton count={6} />}
      {categoriesQuery.isError && (
        <ErrorState onRetry={() => categoriesQuery.refetch()} />
      )}

      {categoriesQuery.isSuccess && categoriesQuery.data.length === 0 && (
        <EmptyState
          title="No categories yet"
          description="প্রথম ক্যাটাগরি যোগ করো।"
        />
      )}

      {categoriesQuery.isSuccess && categoriesQuery.data.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesQuery.data.map((category) => (
            <div
              key={category.id}
              className="flex items-start gap-3 rounded-xl border bg-card p-4"
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-medium">{category.name}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {category.description}
                </p>
                {category._count && (
                  <p className="text-xs text-muted-foreground">
                    {category._count.services} services
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(category)}
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
      />
    </div>
  );
}
