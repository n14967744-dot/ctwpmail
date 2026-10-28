import { OFFICE_ADDRESS, OFFICE_HOURS } from "@/lib/site";
import { officeMapLinks } from "@/lib/office-map";
import styles from "./OfficeMap.module.css";

export function OfficeMap({ name = "", address = "" }: { name?: string; address?: string }) {
  const links = officeMapLinks(address);
  return <section className={styles.section} aria-labelledby="office-map-title">
    <div className={styles.heading}>
      <p className={styles.eyebrow}>Right here in Bryan</p>
      <h2 id="office-map-title">A local team.<br />A place to stop by.</h2>
      <p>See the equipment in person and meet the people who will help your firm.</p>
    </div>
    <div className={styles.card}>
      <iframe src={links.embed} title={address ? `Directions from ${name} to CTWP in Bryan` : "CTWP Bryan office map"} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      <div className={styles.body}>
        {address && <p className={styles.origin}>From {name}<span>{address}</span></p>}
        <div><strong>CTWP · Bryan office</strong><address>{OFFICE_ADDRESS}</address><p>{OFFICE_HOURS}</p></div>
        <a href={links.directions} target="_blank" rel="noopener noreferrer">{address ? "Directions from your firm" : "Get directions"} <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </section>;
}
