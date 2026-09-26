"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/skeletons";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers, useSetUserActiveStatus } from "@/hooks/use-admin";
import type { User } from "@/types/user";

const PAGE_SIZE = 8;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AdminUsersTable() {
  const usersQuery = useAdminUsers();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [target, setTarget] = useState<User | null>(null);

  if (usersQuery.isLoading) return <TableSkeleton rows={5} columns={4} />;
  if (usersQuery.isError)
    return <ErrorState onRetry={() => usersQuery.refetch()} />;

  const users = usersQuery.data ?? [];
  const filtered = users.filter((user) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name or email"
        className="h-10 max-w-sm"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1); // সার্চ বদলালে প্রথম পেজে ফিরে যাও
        }}
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No users found"
          description="সার্চ বদলে আবার চেষ্টা করো।"
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback>{initials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.activeStatus === "BLOCKED"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {user.activeStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setTarget(user)}
                        >
                          {user.activeStatus === "BLOCKED" ? "Unban" : "Ban"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      <BanUserDialog
        user={target}
        onOpenChange={(open) => !open && setTarget(null)}
      />
    </div>
  );
}

function BanUserDialog({
  user,
  onOpenChange,
}: {
  user: User | null;
  onOpenChange: (open: boolean) => void;
}) {
  const setStatus = useSetUserActiveStatus();
  const willBan = user?.activeStatus !== "BLOCKED";

  function confirm() {
    if (!user) return;
    setStatus.mutate(
      { userId: user.id, activeStatus: willBan ? "BLOCKED" : "ACTIVE" },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {willBan ? "Ban this user?" : "Unban this user?"}
          </DialogTitle>
          <DialogDescription>
            {user?.name}{" "}
            {willBan
              ? "প্ল্যাটফর্মে লগইন করতে পারবে না।"
              : "আবার প্ল্যাটফর্ম ব্যবহার করতে পারবে।"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={willBan ? "destructive" : "default"}
            disabled={setStatus.isPending}
            onClick={confirm}
          >
            {setStatus.isPending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            {willBan ? "Yes, ban" : "Yes, unban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
