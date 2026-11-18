export type Category = {
  name: string;
  slug: string;
  short: string;
  sourceIntro?: string;
  tone: string;
};

export const HERO_IMAGE = "/assets/home-factory.webp";
export const STORY_IMAGE = "/manus-storage/async-images/NB0wTzKVGqJWjZB5Ntotj6/image-2.webp";
export const DETAIL_IMAGE = "/manus-storage/async-images/NB0wTzKVGqJWjZB5Ntotj6/image-3.webp";
export const GARMENT_EXPLORER_IMAGE = "/manus-storage/async-images/WcoNv0Hg9bnSSPDjbrcimm/image-1.webp";
export const GARMENT_OUTERWEAR_IMAGE = "/manus-storage/async-images/QDOWcEtPsT7DkH0HHpwHP9/image-1.webp";
export const GARMENT_TAILORING_IMAGE = "/manus-storage/async-images/QDOWcEtPsT7DkH0HHpwHP9/image-2.webp";
export const GARMENT_BOTTOMS_IMAGE = "/manus-storage/async-images/QDOWcEtPsT7DkH0HHpwHP9/image-3.webp";

export const categories: Category[] = [
  { name: "Beads", slug: "beads", short: "Decorative accents for expressive collections.", tone: "sand" },
  { name: "Belts", slug: "belts", short: "Structured belts and waistband components.", tone: "olive" },
  { name: "Buckles", slug: "buckles", short: "Hardware designed for secure, refined fastening.", tone: "steel" },
  { name: "Buttons", slug: "buttons", short: "Buttons for everyday essentials and elevated detail.", tone: "brass" },
  { name: "D Rings", slug: "d-rings", short: "Reliable D-ring hardware for straps and adjustability.", tone: "slate" },
  { name: "Drawcords", slug: "drawcords", short: "Functional cords for fit, movement and finish.", tone: "clay" },
  { name: "Elastic Items", slug: "elastic-items", short: "Stretch components built around garment performance.", tone: "rose" },
  { name: "Grippers", slug: "grippers", short: "Practical fastening pieces for dependable wear.", tone: "ink" },
  { name: "Hook & Bar", slug: "hook-bar-2", short: "Low-profile closure hardware for clean silhouettes.", tone: "graphite" },
  { name: "Laces", slug: "laces", short: "Flat, oval and round profiles for apparel and footwear.", tone: "linen" },
  { name: "Loop Buttons", slug: "loop-buttons", short: "Tailored loop-button details with a considered finish.", tone: "moss" },
  { name: "Paper Bags", slug: "paper-bags", short: "Packaging accessories that carry the collection through.", tone: "paper" },
  { name: "Reflective Tape", slug: "reflective-tape", short: "Visibility-focused trims for performance applications.", tone: "silver" },
  { name: "Shank", slug: "shank", short: "Shank-style components for dependable attachment.", tone: "rust" },
  { name: "Snap", slug: "snap", short: "Snap fasteners made for repeatable performance.", tone: "blue" },
  { name: "Tapes & Cords", slug: "tapes-cords-2", short: "Woven and braided components for utility and identity.", tone: "navy" },
  { name: "Toggles", slug: "toggles-2", short: "Adjustable toggle solutions for outerwear and activewear.", tone: "ochre" },
  { name: "Zip Pullers", slug: "zip-pullers-2", short: "Small details that give a zipper its final character.", tone: "plum" },
  { name: "Zippers", slug: "zippers-2", short: "Zippers for apparel, accessories and technical applications.", sourceIntro: "The current source page is labelled Zippers but carries a laces description. Zipper-specific copy is marked for confirmation.", tone: "charcoal" },
];

export const processSteps = [
  { number: "01", title: "Design & Development", body: "We review your requirements, artwork, and technical specifications to develop the ideal trim solution for your garment.", icon: "ruler" },
  { number: "02", title: "Tooling & Production", body: "Using advanced manufacturing processes, we produce trims with consistent quality, precision, and durability.", icon: "factory" },
  { number: "03", title: "Quality Assurance", body: "Every production batch undergoes strict inspections for dimensions, colour, finish, strength, and performance.", icon: "check" },
  { number: "04", title: "Packaging & Global Delivery", body: "Products are securely packed and shipped worldwide with complete export documentation and on-time delivery.", icon: "package" },
];

export const capabilities = [
  { title: "Button Attaching Machine", body: "Button attaching machines test and verify secure attachment to customer specifications.", icon: "settings" },
  { title: "Pull Test Machine", body: "Critical trims undergo pull strength testing for secure attachment, durability and compliance.", icon: "move" },
  { title: "DTM (Colour Matching)", body: "Dyed-to-Match colour development uses Pantone references and physical swatches.", icon: "palette" },
  { title: "Quality Inspection", body: "Quality is monitored from raw material inspection through final pre-shipment verification.", icon: "scan" },
  { title: "After-Sales Service", body: "Responsive support continues after shipment with prompt resolution of quality concerns.", icon: "heart" },
  { title: "Packaging", body: "Export-standard packing, labels, barcodes and cartons can be customized to requirements.", icon: "boxes" },
];

export const certifications = [
  { name: "Confidence in Textiles", image: "https://nhlintl.com/wp-content/uploads/2026/07/oeko-tex-confidence-in-textiles-standard-100-logo-vector.png", body: "Verified under the Confidence in Textiles label, ensuring textile products are independently tested for harmful substances and meet internationally recognized safety and quality standards." },
  { name: "Made in Green", image: "https://nhlintl.com/wp-content/uploads/2026/07/8_Logo_Oeko-Tex_Made-in-Green.jpg", body: "Certified under Made in Green, confirming products are manufactured in environmentally responsible facilities under socially responsible working conditions, with full supply chain traceability." },
  { name: "STANDARD 100 Certified", image: "https://nhlintl.com/wp-content/uploads/2026/07/Oeko-Tex-Standard-100-Logo-2-1024x672.jpg", body: "Certified to the STANDARD 100 standard, verifying that every component of the textile product has been tested for harmful substances and complies with strict international safety requirements." },
];

export const contact = {
  phone: "+94 77 578 1519",
  email: "sales@nhltrims.com",
  address: "4th Floor, No 192/10, 9th Lane, Nawala Road, Kotte, Colombo, Sri Lanka",
  whatsapp: "https://wa.me/+447748220601",
};

export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
