import Image from "next/image";
import { PhoneIcon } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#save">
          <Image
            className={styles.logoWide}
            src="/ctwp-header-logo.png"
            alt="CTWP Your Copier Company"
            width={720}
            height={180}
            priority
          />
          <Image
            className={styles.logoMark}
            src="/ctwp-square-logo.png"
            alt="CTWP"
            width={512}
            height={512}
            priority
          />
        </a>

        <div className={styles.desktop}>
          <p className={styles.tagline}>Your local copier company</p>
          <span className={styles.rule} aria-hidden="true" />
          <a className={styles.phone} href={PHONE_HREF}>
            <PhoneIcon className={styles.phoneIcon} />
            <span className={styles.phoneText}>
              <span className={styles.phoneName}>Ryan</span>
              <span className={styles.phoneNumber}>{PHONE_DISPLAY}</span>
            </span>
          </a>
          <a className={styles.cta} href="#save">
            See what I could save
          </a>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
