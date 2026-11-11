import Link from "next/link";
import { VARIANTS, type Variant } from "./content";
import s from "./preview.module.css";

export default function Index() {
  return (
    <main className={s.index}>
      <p className={s.kicker}>Design preview</p>
      <h1>Accounting landing page: three versions</h1>
      <p>Same copy, images and sections in each. What changes is the look and the order. The business shown is a made-up sample, and the form sends nothing.</p>
      <ul>
        {(Object.keys(VARIANTS) as Variant[]).map((k) => (
          <li key={k}>
            <Link href={`/preview/accounting/${k}`}>
              <strong>Version {VARIANTS[k].label}: {VARIANTS[k].name}</strong>
              <span>{VARIANTS[k].note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
