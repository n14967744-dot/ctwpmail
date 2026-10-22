import Image from "next/image";
import { PhoneIcon } from "./icons";
import { MobileMenu } from "./MobileMenu";
import { PHONE_HREF } from "@/lib/site";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <MobileMenu />
        <a className={styles.brand} href="#review">
          <Image
            className={styles.logo}
            src="/ctwp-header-logo.png"
            alt="CTWP Your Copier Company"
            width={720}
            height={180}
            priority
          />
        </a>
        <div className={styles.actions}>
          <a className={styles.review} href="#review">
            Get my review
          </a>
          <a className={styles.call} href={PHONE_HREF} aria-label="Call (210) 284-3727">
            <PhoneIcon className={styles.callIcon} />
          </a>
        </div>
      </div>
    </header>
  );
}
