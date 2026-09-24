import Link from "next/link";
import { CategoryCard } from "@/components/features/category-card";
import { ServiceCard } from "@/components/features/service-card";
import { TechnicianCard } from "@/components/features/technician-card";
import SplitText from "@/components/reactbits/SplitText";
import { AnimatedNumber } from "@/components/shared/animated-number";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-fetch";
import { fetchTechniciansForSSG } from "@/lib/technicians-ssg";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";
import type { Service } from "@/types/service";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Browse services",
    description: "ক্যাটাগরি বা সার্চ দিয়ে দরকারি সার্ভিস খুঁজে বের করো।",
  },
  {
    step: "2",
    title: "Book a technician",
    description: "সময় ঠিক করে বুকিং রিকোয়েস্ট পাঠাও।",
  },
  {
    step: "3",
    title: "Pay securely",
    description: "টেকনিশিয়ান accept করলে SSLCommerz দিয়ে পেমেন্ট করো।",
  },
  {
    step: "4",
    title: "Get it done",
    description: "কাজ শেষে রিভিউ দিয়ে অভিজ্ঞতা শেয়ার করো।",
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
      {/* Hero */}
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
      </Container>

      {/* Categories */}
      {categories.length > 0 && (
        <Container className="py-12 sm:py-16">
          <SectionHeading
            eyebrow="Categories"
            title="What do you need help with?"
            className="mb-10"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.slice(0, 10).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      )}

      {/* Featured services */}
      {services.length > 0 && (
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
      )}

      {/* Top-rated technicians */}
      {technicians.length > 0 && (
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
      )}

      {/* How it works */}
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

      {/* Stats */}
      <Container className="py-12 sm:py-16">
        <Reveal>
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
        </Reveal>
      </Container>

      {/* CTA */}
      <Container className="pb-20">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:py-16">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="max-w-md text-sm text-primary-foreground/90">
            আজই একটা বুকিং দিয়ে শুরু করো, অথবা টেকনিশিয়ান হিসেবে যোগ দাও।
          </p>
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
              render={<Link href="/auth/register" />}
            >
              Sign up free
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
