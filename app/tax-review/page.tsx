import type { Metadata } from "next";
import { AccountingLanding } from "@/components/AccountingLanding";
import { TAX } from "@/lib/accounting";

/* Review page with a made-up business. The form does not send anything. */

export const metadata: Metadata = {
  title: "CTWP | Your Copier Company",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AccountingLanding
      copy={TAX}
      travel={{ miles: "2.4", minutes: "7" }}
      business={{ slug: "example-tax-service", name: "Example Tax Service", niche: "accounting", address: "3000 Briarcrest Dr", city: "Bryan", zip: "77802" }}
    />
  );
}
