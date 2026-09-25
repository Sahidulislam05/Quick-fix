import { Suspense } from "react";
import { PaymentSuccessContent } from "./success-content";

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccessContent />
    </Suspense>
  );
}
