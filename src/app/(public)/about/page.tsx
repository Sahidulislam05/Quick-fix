import { HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description: "QuickFix-এর মিশন, ভ্যালুজ এবং আমরা কীভাবে কাজ করি জানো।",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Safety",
    description:
      "Every technician on QuickFix builds a public profile before taking on work, so you always know who's coming to your home.",
  },
  {
    icon: Sparkles,
    title: "Quality Service",
    description:
      "Ratings and reviews come from real completed bookings, helping you choose with confidence.",
  },
  {
    icon: HeartHandshake,
    title: "Fair Pricing",
    description:
      "Prices are set upfront by each technician — no hidden fees, no last-minute surprises.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "We're building a platform where skilled technicians and homeowners can find each other easily.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Container className="flex flex-col items-center gap-4 py-16 text-center sm:py-24">
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          About Us
        </span>
        <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl lg:text-5xl">
          Making home repairs simple, honest, and reliable
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          QuickFix is a home service marketplace that connects homeowners with
          verified technicians — plumbers, electricians, cleaners, and more.
        </p>
      </Container>

      <Reveal>
        <Container className="py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Our mission
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Finding a technician you can trust shouldn't be hard
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                Too many home repairs get delayed because it's hard to find
                someone reliable, available, and fairly priced. QuickFix fixes
                that by putting verified technicians, transparent pricing, and
                secure payments in one place.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8">
              <p className="text-sm text-muted-foreground">
                Whether you need a leaking pipe fixed today or a full home
                cleaning scheduled for next week, QuickFix helps you book it,
                track it, and pay for it — all from one dashboard.
              </p>
            </div>
          </div>
        </Container>
      </Reveal>

      <Reveal>
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="What we stand for"
            title="Our values"
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="space-y-2 rounded-xl border bg-card p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Reveal>

      <Reveal>
        <Container className="pb-20">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to book your first service?
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                render={<Link href="/services" />}
              >
                Browse Services
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                render={<Link href="/contact" />}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </Reveal>
    </>
  );
}
