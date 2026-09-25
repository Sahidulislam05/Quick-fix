import { Suspense } from "react";
import { PaymentCancelContent } from "./cancel-content";

export default function PaymentCancelPage() {
  return (
    <Suspense>
      <PaymentCancelContent />
    </Suspense>
  );
}