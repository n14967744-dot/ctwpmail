import { notFound } from "next/navigation";
import { Preview } from "../Preview";
import { VARIANTS, type Variant } from "../content";

export function generateStaticParams() {
  return Object.keys(VARIANTS).map((variant) => ({ variant }));
}

export default async function Page({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (!(variant in VARIANTS)) notFound();
  return <Preview variant={variant as Variant} />;
}
