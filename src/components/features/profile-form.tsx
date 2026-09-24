"use client";

import { Loader2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateProfile } from "@/hooks/use-profile";

export function ProfileForm() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    updateProfile.mutate({ name, phone });
  }

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm space-y-4 rounded-xl border bg-card p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">Full name</Label>
        <Input
          id="profile-name"
          className="h-10"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="profile-phone">Phone</Label>
        <Input
          id="profile-phone"
          className="h-10"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Email</Label>
        <p className="text-sm text-muted-foreground">
          {user.email} (can&apos;t be changed)
        </p>
      </div>
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending && (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        )}
        Save changes
      </Button>
    </form>
  );
}
