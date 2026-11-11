import { redirect } from "next/navigation";

/* The first preview links pointed here. They now open the accounting example on the real page. */
export function generateStaticParams() {
  return ["a", "b", "c"].map((variant) => ({ variant }));
}

export default function Page() {
  redirect("/example-accounting-group");
}
