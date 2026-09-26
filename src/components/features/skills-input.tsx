"use client";

import { X } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type SkillsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
};

export function SkillsInput({ value, onChange }: SkillsInputProps) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill();
    }
  }

  function removeSkill(skill: string) {
    onChange(value.filter((s) => s !== skill));
  }

  return (
    <div className="space-y-2">
      <Input
        placeholder="একটা স্কিল লিখে Enter চাপো (যেমন: Pipe Repair)"
        className="h-10"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                aria-label={`Remove ${skill}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
