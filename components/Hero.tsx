import Image from "next/image";
import { ClockIcon, PhoneIcon, PinIcon, RefreshIcon } from "./icons";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import styles from "./Hero.module.css";

const trust = [
  { icon: PinIcon, label: "Local service since 1979" },
  { icon: ClockIcon, label: "Fast local response" },
  { icon: RefreshIcon, label: "No auto-renewal traps" },
];

export function Hero({ practice }: { practice: string }) {
  return (
    <section className={styles.hero} id="save" aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.pill}>Prepared for {practice}</p>
          <h1 id="hero-heading" className={styles.headline}>
            See what your practice could save, and what could work better.
          </h1>
          <p className={styles.sub}>
            Get a custom print &amp; copier assessment tailored to your needs. Takes 2 minutes.
          </p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#save">
              See what I could save
            </a>
            <a className={styles.secondary} href="#solutions">
              Explore solutions for my practice
            </a>
          </div>
          <ul className={styles.trust}>
            {trust.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span className={styles.trustIcon}>
                  <Icon />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <figure className={styles.media} id="solutions">
          <Image
            className={styles.photo}
            src="/leroy.png"
            alt="Leroy, CTWP's Yorkie mascot"
            fill
            priority
            sizes="(max-width: 899px) 92vw, 480px"
          />
        </figure>
      </div>

      <div className={styles.dock}>
        <a className={styles.dockCall} href={PHONE_HREF}>
          <PhoneIcon className={styles.dockIcon} />
          Call
        </a>
        <a className={styles.dockSave} href="#save">
          See what I could save
        </a>
      </div>
    </section>
  );
}
