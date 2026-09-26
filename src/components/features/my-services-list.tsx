"use client";

import { useState } from "react";
import { ServiceFormDialog } from "@/components/features/service-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PriceTag } from "@/components/shared/price-tag";
import { CardGridSkeleton } from "@/components/shared/skeletons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeactivateService, useMyServices } from "@/hooks/use-my-services";
import type { Service } from "@/types/service";

export function MyServicesList() {
  const servicesQuery = useMyServices();
  const deactivateService = useDeactivateService();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined,
  );

  function openCreate() {
    setEditingService(undefined);
    setDialogOpen(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openCreate}>Add service</Button>
      </div>

      {servicesQuery.isLoading && <CardGridSkeleton count={3} />}
      {servicesQuery.isError && (
        <ErrorState onRetry={() => servicesQuery.refetch()} />
      )}

      {servicesQuery.isSuccess && servicesQuery.data.length === 0 && (
        <EmptyState
          title="No services yet"
          description="প্রথম সার্ভিস যোগ করে কাস্টমারদের কাছে দৃশ্যমান হও।"
          action={<Button onClick={openCreate}>Add your first service</Button>}
        />
      )}

      {servicesQuery.isSuccess && servicesQuery.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {servicesQuery.data.map((service) => (
            <div
              key={service.id}
              className="space-y-3 rounded-xl border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{service.title}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                {!service.isActive && (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </div>
              <PriceTag amount={service.price} size="sm" />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(service)}
                >
                  Edit
                </Button>
                {service.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={deactivateService.isPending}
                    onClick={() => deactivateService.mutate(service.id)}
                  >
                    Deactivate
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingService}
      />
    </div>
  );
}
