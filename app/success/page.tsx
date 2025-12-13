import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const metadata = {
  title: "Payment Successful | CardRoots",
  description: "Your digital card is ready. Share your eco-friendly card and view your tree planting confirmation.",
};

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}
