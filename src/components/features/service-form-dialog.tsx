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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/use-categories";
import { useCreateService, useUpdateService } from "@/hooks/use-my-services";
import {
  serviceSchema,
  type ServiceFormValues,
} from "@/lib/validations/service";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

type ServiceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
}: ServiceFormDialogProps) {
  const categoriesQuery = useCategories();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const isEdit = Boolean(service);
  const isPending = createService.isPending || updateService.isPending;

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      categoryId: "",
      title: "",
      description: "",
      price: 0,
      location: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        categoryId: service?.categoryId ?? "",
        title: service?.title ?? "",
        description: service?.description ?? "",
        price: service ? Number(service.price) : 0,
        location: service?.location ?? "",
      });
    }
  }, [open, service, form]);

  async function onSubmit(values: ServiceFormValues) {
    const payload = { ...values, location: values.location || undefined };
    const result = isEdit
      ? await updateService
          .mutateAsync({ id: service?.id ?? "", payload })
          .catch(() => null)
      : await createService.mutateAsync(payload).catch(() => null);
    if (!result) return;
    onOpenChange(false);
  }

  const categoryId = form.watch("categoryId");
  const selectedCategory = (categoriesQuery.data ?? []).find(
    (category) => category.id === categoryId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit service" : "Add a new service"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={categoryId}
              onValueChange={(value) =>
                form.setValue("categoryId", value ?? "", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger className="h-10 w-full">
                <span
                  className={cn(
                    "truncate",
                    !selectedCategory && "text-muted-foreground",
                  )}
                >
                  {selectedCategory
                    ? `${selectedCategory.icon} ${selectedCategory.name}`
                    : "Choose a category"}
                </span>
              </SelectTrigger>
            </Select>
            {form.formState.errors.categoryId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service-title">Title</Label>
            <Input
              id="service-title"
              className="h-10"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service-description">Description</Label>
            <Textarea
              id="service-description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="service-price">Price (৳)</Label>
              <Input
                id="service-price"
                type="number"
                min={0}
                className="h-10"
                {...form.register("price", { valueAsNumber: true })}
              />
              {form.formState.errors.price && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="service-location">Location (optional)</Label>
              <Input
                id="service-location"
                className="h-10"
                {...form.register("location")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              )}
              {isEdit ? "Save changes" : "Create service"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
