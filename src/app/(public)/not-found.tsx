import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export default function PublicNotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-heading text-6xl font-bold text-primary">404</span>
      <h1 className="text-xl font-bold">Not found</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        এটা খুঁজে পাওয়া যায়নি। হয়তো এটা মুছে ফেলা হয়েছে, বা লিংকটা ভুল।
      </p>
      <Button size="lg" render={<Link href="/services" />}>
        Browse services
      </Button>
    </Container>
  );
}
