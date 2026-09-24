import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/shared/container";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/30">
      <Container className="flex h-16 items-center">
        <Logo />
      </Container>
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
