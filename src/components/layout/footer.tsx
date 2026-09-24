import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/shared/container";
import { PUBLIC_NAV_LINKS } from "@/constants/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Your trusted home service platform — book qualified technicians for
            plumbing, electrical, cleaning and more.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">Quick links</span>
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>

      <Container className="border-t py-4">
        <p className="text-xs text-muted-foreground">
          © {year} QuickFix. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
