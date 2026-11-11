import type { Metadata } from "next";
import { AccountingLanding } from "@/components/AccountingLanding";
import { ACCOUNTING } from "@/lib/accounting";

/* Review page with a made-up business. The form does not send anything. */

export const metadata: Metadata = {
  title: "CTWP | Your Copier Company",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <AccountingLanding
      copy={ACCOUNTING}
      travel={{ miles: "2.4", minutes: "7" }}
      business={{ slug: "example-accounting-group", name: "Example Accounting Group", niche: "accounting", address: "3000 Briarcrest Dr", city: "Bryan", zip: "77802" }}
    />
  );
}
