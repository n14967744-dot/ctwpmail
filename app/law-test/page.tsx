import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { getLawTestRecipients } from "@/lib/law-test";
import { lawTestAddress } from "@/lib/law-test-types";
import styles from "./test.module.css";

export const metadata: Metadata = { title: "10 law firms · CTWP test", robots: { index: false, follow: false } };
async function TestHub() {
  await connection();
  const lawTestRecipients = await getLawTestRecipients();
  return <main className={styles.hub}>
    <header><img src="/ctwp-mark.webp" alt="CTWP" width="111" height="90" /><p className={styles.eyebrow}>Mail campaign · Test group</p><h1>10 firms.<br />One complete test.</h1><p>Try a personalized page, the route to our Bryan office, and the equipment-review form. These firms come from your existing October 26 law-firm research.</p><p className={styles.notice}>Use sample contact details. Test visits and submissions are saved separately. No messages are sent to these firms, and no sales stage changes.</p><a className={styles.download} href="/law-test/recipients.csv">Download the 10-firm CSV ↓</a></header>
    <ol className={styles.grid}>{lawTestRecipients.map(firm => <li key={firm.id}><div className={styles.meta}><span>{firm.id}</span><span>{firm.practice.replaceAll("-", " ")}</span></div><h2>{firm.name}</h2><p>{lawTestAddress(firm)}</p><div className={styles.links}><Link href={`/law-test/${firm.slug}`} prefetch={false}>Open firm page ↗</Link><Link href={`/law-test/${firm.slug}?src=qr&utm_campaign=law-test-10`} prefetch={false}>Test QR arrival ↗</Link></div><a className={styles.source} href={firm.sourceUrl} target="_blank" rel="noopener noreferrer">Research source ↗</a></li>)}</ol>
  </main>;
}

export default function Page() {
  return <Suspense fallback={<main className={styles.hub} aria-busy="true">Loading your test firms…</main>}><TestHub /></Suspense>;
}
