import {
  Clock,
  HeartHandshake,
  Lock,
  RotateCcw,
  ShieldCheck,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/features/category-card";
import { ServiceCard } from "@/components/features/service-card";
import { TechnicianCard } from "@/components/features/technician-card";
import SplitText from "@/components/reactbits/SplitText";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { Container } from "@/components/shared/container";
import { FaqItem } from "@/components/shared/faq-item";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import { fetchTechniciansForSSG } from "@/lib/technicians-ssg";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Service } from "@/types/service";

const TRUST_STRIP = [
  { icon: ShieldCheck, label: "Verified Technicians" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Clock, label: "Fast Response" },
  { icon: Tag, label: "Transparent Pricing" },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Browse services",
    description:
      "Search by category or keyword to find the right service for your home.",
  },
  {
    step: "2",
    title: "Book a technician",
    description: "Pick a time that works for you and send a booking request.",
  },
  {
    step: "3",
    title: "Pay securely",
    description:
      "Once the technician accepts, pay safely online through SSLCommerz.",
  },
  {
    step: "4",
    title: "Get it done",
    description:
      "After the job is complete, leave a review to share your experience.",
  },
];

const WHY_CHOOSE_US = [
  {
    icon: ShieldCheck,
    title: "Verified technicians",
    description:
      "Every technician builds a public profile with real experience and skills before taking bookings.",
  },
  {
    icon: Lock,
    title: "Secure payments",
    description:
      "Payments are processed through SSLCommerz, and you're only charged after a technician accepts.",
  },
  {
    icon: Star,
    title: "Real customer reviews",
    description:
      "Ratings come from customers who actually completed a booking — no fake reviews.",
  },
  {
    icon: RotateCcw,
    title: "Easy cancellation",
    description:
      "Change your mind? Cancel any booking before the job starts, right from your dashboard.",
  },
];

const FAQS = [
  {
    question: "How do I book a technician?",
    answer:
      "Browse services, pick a technician, choose a date and time, and submit a booking request. Once the technician accepts, you can pay online.",
  },
  {
    question: "Is payment on QuickFix secure?",
    answer:
      "Yes — all payments are processed through SSLCommerz, and you're only charged after your technician accepts the booking.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "You can cancel any booking before the technician marks it as in-progress, right from your dashboard.",
  },
  {
    question: "How are technicians verified on QuickFix?",
    answer:
      "Technicians create a profile with their experience and skills, and build a public rating from real customer reviews over time.",
  },
  {
    question: "How do I become a technician?",
    answer:
      "Sign up with a Technician account, complete your profile, add your services, and start receiving booking requests.",
  },
];

export default async function HomePage() {
  const [categoriesResult, servicesResult, techniciansResult] =
    await Promise.all([
      serverFetch<{ categories: Category[] }>("/categories").catch(() => null),
      serverFetch<Service[]>("/services?limit=6").catch(() => null),
      fetchTechniciansForSSG({
        limit: 4,
        sortBy: "avgRating",
        sortOrder: "desc",
      }).catch(() => null),
    ]);

  const categories = categoriesResult?.data.categories ?? [];
  const services = servicesResult?.data ?? [];
  const totalServices = servicesResult?.meta?.total ?? services.length;
  const technicians = techniciansResult?.technicians ?? [];
  const totalTechnicians = techniciansResult?.meta?.total ?? technicians.length;
  const statCount = technicians.length > 0 ? 3 : 2;

  return (
    <>
      {/* ১) Hero */}
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center"
        >
          <div className="h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl sm:h-[560px] sm:w-[560px]" />
        </div>

        <Container className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Home Service Platform
          </span>
          <SplitText
            text="Book trusted technicians for every home repair"
            tag="h1"
            textAlign="center"
            className="max-w-2xl text-4xl font-bold sm:text-5xl lg:text-6xl"
          />
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            QuickFix connects you with verified plumbers, electricians, and
            cleaners near you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="2xl" render={<Link href="/services" />}>
              Browse Services
            </Button>
            <Button
              size="2xl"
              variant="outline"
              render={<Link href="/auth/register" />}
            >
              Become a Technician
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 text-xs text-muted-foreground sm:text-sm">
            {TRUST_STRIP.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5"
                >
                  <Icon className="size-4 text-primary" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </Container>
      </div>

      {/* ২) How it works */}
      <Reveal>
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="Process"
            title="How QuickFix works"
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="space-y-2 rounded-xl border bg-card p-5"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </span>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Reveal>

      {/* ৩) Categories */}
      {categories.length > 0 && (
        <Reveal>
          <Container className="py-12 sm:py-16">
            <SectionHeading
              eyebrow="Categories"
              title="What do you need help with?"
              className="mb-10"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.slice(0, 10).map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </Container>
        </Reveal>
      )}

      {/* ৪) Featured services */}
      {services.length > 0 && (
        <Reveal>
          <Container className="py-12 sm:py-16">
            <SectionHeading
              eyebrow="Featured"
              title="Recently listed services"
              className="mb-10"
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/services" />}
              >
                View all services
              </Button>
            </div>
          </Container>
        </Reveal>
      )}

      {/* ৫) Why choose us */}
      <Reveal>
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="Why QuickFix"
            title="Built for peace of mind"
            className="mb-10"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="space-y-2 rounded-xl border bg-card p-5"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Reveal>

      {/* ৬) Top-rated technicians */}
      {technicians.length > 0 && (
        <Reveal>
          <Container className="py-12 sm:py-16">
            <SectionHeading
              eyebrow="Top rated"
              title="Meet our trusted technicians"
              className="mb-10"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {technicians.map((technician) => (
                <TechnicianCard key={technician.id} technician={technician} />
              ))}
            </div>
          </Container>
        </Reveal>
      )}

      {/* ৭) Stats */}
      <Reveal>
        <Container className="py-12 sm:py-16">
          <div
            className={cn(
              "grid gap-4 rounded-2xl border bg-card p-8",
              statCount === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            <div className="text-center">
              <AnimatedNumber
                value={categories.length}
                className="font-heading text-3xl font-bold"
              />
              <p className="text-sm text-muted-foreground">
                Service categories
              </p>
            </div>
            <div className="text-center">
              <AnimatedNumber
                value={totalServices}
                className="font-heading text-3xl font-bold"
              />
              <p className="text-sm text-muted-foreground">Services listed</p>
            </div>
            {technicians.length > 0 && (
              <div className="text-center">
                <AnimatedNumber
                  value={totalTechnicians}
                  className="font-heading text-3xl font-bold"
                />
                <p className="text-sm text-muted-foreground">
                  Verified technicians
                </p>
              </div>
            )}
          </div>
        </Container>
      </Reveal>

      {/* ৮) For technicians */}
      <Reveal>
        <Container className="py-12 sm:py-16">
          <div className="grid items-center gap-8 rounded-2xl border bg-card p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                For Technicians
              </span>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Grow your business with QuickFix
              </h2>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>• Reach customers actively looking for your service</li>
                <li>• Set your own schedule and pricing</li>
                <li>• Get paid securely, job after job</li>
              </ul>
            </div>
            <Button
              size="xl"
              className="w-full lg:w-auto"
              render={<Link href="/auth/register" />}
            >
              Become a Technician
            </Button>
          </div>
        </Container>
      </Reveal>

      {/* ৯) FAQ */}
      <Reveal>
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently asked questions"
            className="mb-10"
          />
          <div className="mx-auto max-w-2xl space-y-3">
            {FAQS.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </Container>
      </Reveal>

      {/* ১০) Final CTA */}
      <Reveal>
        <Container className="pb-20">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="max-w-md text-sm text-primary-foreground/90">
              Book your first service today and see why customers trust
              QuickFix.
            </p>
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/services" />}
            >
              Browse Services
            </Button>
          </div>
        </Container>
      </Reveal>
    </>
  );
}
