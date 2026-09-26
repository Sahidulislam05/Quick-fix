"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SkillsInput } from "@/components/features/skills-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUpdateTechnicianProfile } from "@/hooks/use-technician-profile";
import { useTechnician } from "@/hooks/use-technicians";
import {
  technicianProfileSchema,
  type TechnicianProfileFormValues,
} from "@/lib/validations/technician-profile";

export function TechnicianProfileForm() {
  const { data: user } = useCurrentUser();
  const technicianQuery = useTechnician(user?.id ?? "");
  const updateProfile = useUpdateTechnicianProfile();

  const form = useForm<TechnicianProfileFormValues>({
    resolver: zodResolver(technicianProfileSchema),
    defaultValues: { bio: "", experienceYears: 0, skills: [] },
  });

  useEffect(() => {
    const profile = technicianQuery.data?.technicianProfile;
    if (profile) {
      form.reset({
        bio: profile.bio ?? "",
        experienceYears: profile.experienceYears,
        skills: profile.skills,
      });
    }
  }, [technicianQuery.data, form]);

  function onSubmit(values: TechnicianProfileFormValues) {
    updateProfile.mutate(values);
  }

  if (technicianQuery.isLoading) {
    return <p className="text-sm text-muted-foreground">লোড হচ্ছে...</p>;
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="max-w-lg space-y-4 rounded-xl border bg-card p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="নিজের কাজের অভিজ্ঞতা নিয়ে কয়েক লাইন লেখো"
          {...form.register("bio")}
        />
        {form.formState.errors.bio && (
          <p className="text-xs text-destructive">
            {form.formState.errors.bio.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="experienceYears">Experience (years)</Label>
        <Input
          id="experienceYears"
          type="number"
          min={0}
          className="h-10"
          {...form.register("experienceYears", { valueAsNumber: true })}
        />
        {form.formState.errors.experienceYears && (
          <p className="text-xs text-destructive">
            {form.formState.errors.experienceYears.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Skills</Label>
        <SkillsInput
          value={form.watch("skills")}
          onChange={(next) =>
            form.setValue("skills", next, { shouldValidate: true })
          }
        />
        {form.formState.errors.skills && (
          <p className="text-xs text-destructive">
            {form.formState.errors.skills.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending && (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        )}
        Save profile
      </Button>
    </form>
  );
}
