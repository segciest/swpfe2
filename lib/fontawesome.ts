// lib/fontawesome.ts
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// ⚠️ Quan trọng: Ngăn FontAwesome tự thêm CSS vì Next.js đã có styles riêng
config.autoAddCss = false;
