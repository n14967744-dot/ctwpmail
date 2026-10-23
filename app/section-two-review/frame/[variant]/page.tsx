import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionTwo } from "@/components/sections/SectionTwo";
import styles from "../../review.module.css";

export const metadata: Metadata = { title: "CTWP | Section two preview", robots: { index: false, follow: false } };
export function generateStaticParams() { return ["a", "b"].map(variant => ({ variant })); }
export default async function Page({ params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  if (variant !== "a" && variant !== "b") notFound();
  return <main className={styles.preview}>
    <header className={styles.context}>
      <img src="/ctwp-header-logo.png" alt="CTWP, Your Copier Company" width="154" height="48"/>
      <p>Prepared for<br/><strong>University Dental Associates</strong></p>
    </header>
    <SectionTwo layout={variant === "a" ? "columns" : "rows"}/>
    <section id="quote" className={styles.quote} aria-labelledby="review-next">
      <p className={styles.small}>Next step · preview only</p>
      <h2 id="review-next">Your quote conversation starts here.</h2>
      <p>The approved page will continue into the existing quote form. Nothing is submitted in this design review.</p>
      <a href="#office-benefits">Back to the benefits ↑</a>
    </section>
  </main>;
}
