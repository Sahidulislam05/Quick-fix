import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-heading text-6xl font-bold text-primary">404</span>
      <h1 className="text-xl font-bold">Page not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        এই পেজটা খুঁজে পাওয়া যায়নি। হয়তো লিংকটা ভুল, অথবা পেজটা এখনো তৈরি হয়নি।
      </p>
      <Button size="lg" render={<Link href="/" />}>
        Go home
      </Button>
    </Container>
  );
}
