import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { DEFAULT_PRACTICE, practiceFromParam } from "@/lib/site";

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ practice?: string | string[] }>;
}) {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<Hero practice={DEFAULT_PRACTICE} />}>
          <PracticeHero searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}

async function PracticeHero({
  searchParams,
}: {
  searchParams: Promise<{ practice?: string | string[] }>;
}) {
  const params = await searchParams;
  return <Hero practice={practiceFromParam(params.practice)} />;
}
