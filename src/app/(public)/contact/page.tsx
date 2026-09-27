import { Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/shared/container";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "QuickFix টিমের সাথে যোগাযোগ করো।",
};

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: "support@quickfix.com" },
  { icon: Phone, label: "Phone", value: "+880 1960854767" },
  { icon: MapPin, label: "Address", value: "Dhaka, Bangladesh" },
];

export default function ContactPage() {
  return (
    <>
      <Container className="flex flex-col items-center gap-4 py-16 text-center sm:py-24">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Contact Us
        </span>
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl">
          Get in touch
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Have a question or need help? Fill out the form below or reach us
          directly.
        </p>
      </Container>

      <Container className="grid gap-8 pb-20 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {CONTACT_DETAILS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl border bg-card p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        <ContactForm email={CONTACT_DETAILS[0].value} />
      </Container>
    </>
  );
}
