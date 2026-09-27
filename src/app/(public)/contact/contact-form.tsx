"use client";

import { Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !senderEmail.trim() || !message.trim()) {
      toast.error("সব ফিল্ড পূরণ করো");
      return;
    }

    setSending(true);

    const subject = encodeURIComponent(`Message from ${name} via QuickFix`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${senderEmail})`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setTimeout(() => setSending(false), 800);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-card p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          className="h-10"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          className="h-10"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-message">Message</Label>
        <Textarea
          id="contact-message"
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={sending}>
        {sending && (
          <Loader2 data-icon="inline-start" className="animate-spin" />
        )}
        Send Message
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        This opens your default email app with the message pre-filled.
      </p>
    </form>
  );
}
