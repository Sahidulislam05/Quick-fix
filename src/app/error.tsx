"use client";

import { useEffect } from "react";
import { Container } from "@/components/shared/container";
import { ErrorState } from "@/components/shared/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] items-center justify-center">
      <ErrorState
        title="Something went wrong"
        message="একটা অপ্রত্যাশিত সমস্যা হয়েছে। আবার চেষ্টা করো।"
        onRetry={reset}
      />
    </Container>
  );
}
