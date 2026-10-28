import styles from "./BrandCarousel.module.css";

const brands = [
  { name: "Kyocera", src: "https://www.ctwp.com/wp-content/uploads/2024/11/kyocera-logo.jpg" },
  { name: "Canon", src: "https://www.ctwp.com/wp-content/uploads/2024/11/cannon.jpg" },
  { name: "Konica Minolta", src: "https://www.ctwp.com/wp-content/uploads/2024/11/Logo_Konica_Minolta.svg-768x446.png" },
  { name: "Xerox", src: "https://www.ctwp.com/wp-content/uploads/2024/11/xerox-platinum-authorized-dealer-768x654.png" },
  { name: "Lexmark", src: "https://www.ctwp.com/wp-content/uploads/2024/11/LexmarkLogo_RGB_1200-768x161.jpg" },
  { name: "KIP", src: "https://www.ctwp.com/wp-content/uploads/2024/11/KIP-Logo-Circle.png" },
];

export function BrandCarousel() {
  return <div className={styles.carousel} role="region" aria-label="Brands CTWP carries">
    <div className={styles.heading}><h3>Brands we carry</h3></div>
    <div className={styles.group}>
      {brands.map(brand => <div className={styles.brand} key={brand.name}><img src={brand.src} alt={brand.name} width="180" height="80" /></div>)}
    </div>
  </div>;
}
