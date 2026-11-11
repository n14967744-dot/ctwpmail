import { redirect } from "next/navigation";
import { VARIANTS } from "@/lib/campaign/content";

/* The first preview links pointed here. They now open the accounting example on the real page. */
export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export default async function Page({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  redirect(`/example-accounting-group?v=${variant in VARIANTS ? variant : "c"}`);
}
