import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  Factory,
  HeartHandshake,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  PackageCheck,
  Palette,
  Phone,
  Plus,
  Ruler,
  ScanLine,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createContext, type FormEvent, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  HERO_IMAGE,
  GARMENT_EXPLORER_IMAGE,
  STORY_IMAGE,
  DETAIL_IMAGE,
  capabilities,
  categories,
  certifications,
  contact,
  getCategory,
  processSteps,
  type Category,
} from "./lib/siteData";

type InquiryContextValue = {
  items: string[];
  addItem: (item: string) => void;
  removeItem: (item: string) => void;
};

const InquiryContext = createContext<InquiryContextValue | null>(null);

function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) throw new Error("useInquiry must be used inside InquiryProvider");
  return context;
}

function InquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>(() => {
    try {
      const saved = sessionStorage.getItem("nhl-inquiry-items");
      return saved ? JSON.parse(saved) as string[] : [];
    } catch {
      return [];
    }
  });
  const addItem = (item: string) => setItems((current) => current.includes(item) ? current : [...current, item]);
  const removeItem = (item: string) => setItems((current) => current.filter((entry) => entry !== item));
  useEffect(() => {
    try {
      sessionStorage.setItem("nhl-inquiry-items", JSON.stringify(items));
    } catch {
      // Session persistence is best effort in private browsing contexts.
    }
  }, [items]);
  return <InquiryContext.Provider value={{ items, addItem, removeItem }}>{children}</InquiryContext.Provider>;
}

function upsertMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    if (property) tag.setAttribute("property", name);
    else tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function SiteMeta({ title, description, path, type = "website", productCategory }: { title: string; description: string; path: string; type?: string; productCategory?: Category }) {
  useEffect(() => {
    document.title = title;
    const canonicalUrl = `https://nhlintl.com${path}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;
    upsertMeta("description", description);
    upsertMeta("og:type", type, true);
    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:url", canonicalUrl, true);
    upsertMeta("og:image", HERO_IMAGE, true);
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", HERO_IMAGE);
  }, [description, path, title, type]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NHL International",
    url: "https://nhlintl.com",
    logo: "https://nhlintl.com/wp-content/uploads/2026/07/LOGO_FINAL_TM__1_-removebg-preview.png",
    email: contact.email,
    telephone: contact.phone,
    address: { "@type": "PostalAddress", streetAddress: contact.address, addressCountry: "LK" },
  };
  const productSchema = productCategory ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productCategory.name,
    category: "Garment trims and accessories",
    description,
    image: DETAIL_IMAGE,
    brand: { "@type": "Brand", name: "NHL International" },
  } : null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema ? [organizationSchema, productSchema] : organizationSchema) }} />;
}

function Brand() {
  return (
    <Link href="/" className="brand" aria-label="NHL International home">
      <img className="brand-logo" src="/assets/HDLOGO-transparent.png" alt="NHL International" />
    </Link>
  );
}

function Header() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <div className="utility-bar">
        <div className="container-wide utility-inner">
          <span>Garment trims & accessories · Colombo, Sri Lanka</span>
          <div className="utility-right"><span>Global sourcing partner</span><span>Precision in every detail</span></div>
        </div>
      </div>
      <header className="header">
        <div className="container-wide header-inner">
          <Brand />
          <nav className="nav" aria-label="Primary navigation">
            <button className="nav-menu-trigger" type="button" aria-expanded={catalogOpen} onClick={() => setCatalogOpen((open) => !open)}>Catalog <ChevronDown size={14} /></button>
            <Link href="/home">About Us</Link>
            <Link href="/how-we-work/">How We Work</Link>
            <Link href="/certifications/">Certifications</Link>
            <Link href="/contact/" className="nav-cta">Send Inquiry</Link>
          </nav>
          <button className="header-toggle" type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {catalogOpen && <div className="mega-menu"><div className="container-wide mega-menu-grid">{categories.map((category) => <Link key={category.slug} className="mega-link" href={`/${category.slug}/`} onClick={() => setCatalogOpen(false)}><span>↗</span>{category.name}</Link>)}</div></div>}
        {mobileOpen && <div className="mobile-menu"><div className="container-wide">
          <Link href="/catalog/" onClick={() => setMobileOpen(false)}>Catalog <ArrowUpRight size={15} /></Link>
          <Link href="/home" onClick={() => setMobileOpen(false)}>About Us <ArrowUpRight size={15} /></Link>
          <Link href="/how-we-work/" onClick={() => setMobileOpen(false)}>How We Work <ArrowUpRight size={15} /></Link>
          <Link href="/certifications/" onClick={() => setMobileOpen(false)}>Certifications <ArrowUpRight size={15} /></Link>
          <Link href="/contact/" className="nav-cta" onClick={() => setMobileOpen(false)}>Send Inquiry <ArrowUpRight size={15} /></Link>
        </div></div>}
      </header>
    </>
  );
}

function Footer() {
  return <footer className="footer">
    <div className="container-wide footer-grid">
      <div><Brand /><p className="footer-intro">The silent partner behind the world’s leading apparel brands — precision-engineered garment trims and accessories.</p></div>
      <div><h3>Explore</h3><div className="footer-links"><Link href="/">Home</Link><Link href="/home">About Us</Link><Link href="/catalog/">Catalog</Link><Link href="/how-we-work/">How We Work</Link><Link href="/certifications/">Certifications</Link></div></div>
      <div><h3>Contact</h3><div className="footer-contact"><a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a><a href={`mailto:${contact.email}`}>{contact.email}</a><p>{contact.address}</p></div></div>
      <div><h3>Start a conversation</h3><p className="footer-intro">Request samples, specifications or a quotation tailored to your production schedule.</p><Link className="button-primary" href="/contact/">Send an Inquiry <ArrowRight size={15} /></Link></div>
    </div>
    <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} NHL International. All rights reserved.</span><span>Precision trims for the world's apparel makers.</span></div>
  </footer>;
}

function ArtPlaceholder({ src, alt, label = "Replace with final photography", className = "" }: { src: string; alt: string; label?: string; className?: string }) {
  return <div className={`art-frame ${className}`}><img src={src} alt={alt} loading="lazy" /><span className="art-label">{label}</span></div>;
}

function SectionLabel({ children }: { children: ReactNode }) { return <span className="eyebrow">{children}</span>; }

function Icon({ name }: { name: string }) {
  const icons: Record<string, LucideIcon> = { ruler: Ruler, factory: Factory, check: Check, package: PackageCheck, settings: Settings2, move: MoveUpRight, palette: Palette, scan: ScanLine, heart: HeartHandshake, boxes: Boxes };
  const Component = icons[name] ?? ShieldCheck;
  return <Component size={20} strokeWidth={1.7} />;
}

function CategoryCard({ category, withInquiry = false }: { category: Category; withInquiry?: boolean }) {
  const { addItem } = useInquiry();
  const number = String(categories.findIndex((entry) => entry.slug === category.slug) + 1).padStart(2, "0");
  return <article className="category-card">
    <Link href={`/${category.slug}/`} className={`category-visual tone-${category.tone}`} aria-label={`Explore ${category.name}`}>
      <span className="category-number">{number}</span>
      <img src={DETAIL_IMAGE} alt={`${category.name} trim placeholder image`} loading="lazy" />
      <span className="visual-placeholder">Placeholder visual</span>
    </Link>
    <div className="category-body"><h3>{category.name}</h3><p>{category.short}</p><div className="category-actions"><Link href={`/${category.slug}/`}>Explore <ArrowUpRight size={14} /></Link>{withInquiry && <button className="add-button" type="button" onClick={() => addItem(`${category.name} — initial range`)}><Plus size={14} />Add to inquiry</button>}</div></div>
  </article>;
}


type GarmentPlacement = { slug: string; left: string; top: string; zone: string };

const garmentPlacements: GarmentPlacement[] = [
  { slug: "beads", left: "39%", top: "27%", zone: "Collar and decorative surface" },
  { slug: "belts", left: "39%", top: "73%", zone: "Waist and fit" },
  { slug: "buckles", left: "52%", top: "73%", zone: "Waist adjustment" },
  { slug: "buttons", left: "43%", top: "36%", zone: "Front placket" },
  { slug: "d-rings", left: "28%", top: "49%", zone: "Side strap and pocket" },
  { slug: "drawcords", left: "44%", top: "19%", zone: "Hood and hem adjustment" },
  { slug: "elastic-items", left: "24%", top: "57%", zone: "Sleeve cuff and stretch" },
  { slug: "grippers", left: "47%", top: "41%", zone: "Pocket fastening" },
  { slug: "hook-bar-2", left: "52%", top: "74%", zone: "Waistband closure" },
  { slug: "laces", left: "74%", top: "83%", zone: "Lace and cord detail" },
  { slug: "loop-buttons", left: "40%", top: "31%", zone: "Cuff and tailored closure" },
  { slug: "paper-bags", left: "89%", top: "84%", zone: "Packaging beside the garment" },
  { slug: "reflective-tape", left: "20%", top: "53%", zone: "Performance visibility panel" },
  { slug: "shank", left: "47%", top: "35%", zone: "Button attachment" },
  { slug: "snap", left: "44%", top: "45%", zone: "Repeatable front closure" },
  { slug: "tapes-cords-2", left: "65%", top: "46%", zone: "Woven edge and pocket tape" },
  { slug: "toggles-2", left: "51%", top: "20%", zone: "Hood adjustment" },
  { slug: "zip-pullers-2", left: "50%", top: "41%", zone: "Zipper pull detail" },
  { slug: "zippers-2", left: "50%", top: "46%", zone: "Front and technical closure" },
];

function GarmentExplorer() {
  const [selectedSlug, setSelectedSlug] = useState(garmentPlacements[0].slug);
  const selectedPlacement = garmentPlacements.find((entry) => entry.slug === selectedSlug) ?? garmentPlacements[0];
  const selected = getCategory(selectedPlacement.slug) ?? categories[0];
  return <section className="section garment-explorer"><div className="container-wide"><div className="garment-reference-heading"><div><SectionLabel>Trim placement library</SectionLabel><h2 className="section-heading">See every trim<br />in context.</h2></div><p>Hover or tap a category to see where that NHL trim belongs on a real garment.</p></div><div className="garment-simple-map"><div className="garment-simple-board"><img className="garment-photo" src={GARMENT_EXPLORER_IMAGE} alt="Real garment showing NHL trim placement" /><div className="garment-board-label">NHL / trim placement study <span>19 categories</span></div><div className="garment-active-line" style={{ left: selectedPlacement.left, top: selectedPlacement.top }} aria-hidden="true"><span className="garment-active-dot">{String(garmentPlacements.findIndex((entry) => entry.slug === selectedSlug) + 1).padStart(2, "0")}</span><span className="garment-active-label">{selected.name}</span></div><div className="garment-selected-tag"><span>Now viewing</span><strong>{selected.name}</strong><small>{selectedPlacement.zone}</small></div></div><div className="garment-category-panel"><div className="garment-category-panel-head"><span>All NHL categories</span><strong>19</strong></div><div className="garment-category-chips">{garmentPlacements.map((placement, index) => { const category = getCategory(placement.slug); return <button key={placement.slug} className={selectedSlug === placement.slug ? "is-active" : ""} type="button" onMouseEnter={() => setSelectedSlug(placement.slug)} onFocus={() => setSelectedSlug(placement.slug)} onClick={() => setSelectedSlug(placement.slug)}><b>{String(index + 1).padStart(2, "0")}</b><span>{category?.name}</span></button>; })}</div><div className="garment-category-detail"><span>Placement</span><strong>{selectedPlacement.zone}</strong><p>{selected.short}</p><Link className="text-link" href={`/${selected.slug}/`}>Explore {selected.name} <ArrowUpRight size={14} /></Link></div></div></div><p className="garment-explorer-note"><strong>How it works:</strong> Hover or tap any NHL category to reveal its real garment placement. Paper Bags are shown as packaging beside the garment.</p></div></section>;
}

function HomePage() {
  return <>
    <SiteMeta title="NHL International — Precision Garment Trims" description="NHL International supplies precision garment trims and accessories to apparel manufacturers and fashion brands worldwide." path="/" />
    <main className="page-shell home-soft">
      <section className="hero hero-identity"><div className="hero-identity-image" style={{ backgroundImage: `url(${HERO_IMAGE})` }} aria-hidden="true"></div><div className="hero-identity-shade" aria-hidden="true"></div><div className="container-wide hero-identity-inner"><div className="hero-identity-content reveal"><SectionLabel>Precision for every collection</SectionLabel><h1 className="display">The finishing detail, made easier.</h1><p>Source the trims, hardware and accessories that bring a garment from first sample to finished product — with a partner who understands the detail.</p><div className="button-row"><Link className="button-primary" href="/catalog/">Explore the range <ArrowRight size={16} /></Link><Link className="button-hero-outline" href="/contact/">Start an inquiry <ArrowUpRight size={15} /></Link></div></div><div className="hero-identity-rail"><span><strong>19</strong><small>categories</small></span><span><strong>01</strong><small>sourcing partner</small></span><span><strong>∞</strong><small>ways to specify</small></span><span className="hero-identity-note">From first brief to final pack, keep every detail moving.</span></div></div></section>
      <section className="trust-strip"><div className="container-wide trust-grid"><div className="trust-item"><strong>Quality-led sourcing</strong><span>Clear communication from first brief to final pack</span></div><div className="trust-item"><strong>STANDARD 100</strong><span>Confidence in Textiles</span></div><div className="trust-item"><strong>Made in Green</strong><span>Supply chain traceability</span></div><div className="trust-item"><strong>19 categories</strong><span>Trims, hardware and accessories</span></div><div className="trust-item pending"><strong>Years in business — to confirm</strong><span>Placeholder stat · no verified number supplied</span></div></div></section>
      <GarmentExplorer />
      <section className="section home-story-feature"><div className="container-wide"><div className="home-story-feature-head"><div className="home-story-feature-heading"><SectionLabel>Our Story</SectionLabel><h2 className="section-heading">The details between first sample and final collection.</h2><p>We connect apparel brands with dependable garment accessories, clear communication and a considered path from development to delivery.</p></div><Link className="text-link" href="/home">Read more about NHL <ArrowRight size={15} /></Link></div><div className="home-story-feature-grid"><div className="home-story-feature-visual"><ArtPlaceholder src={STORY_IMAGE} alt="NHL International trim sourcing and development review" label="NHL International · sourcing in context" /><span className="home-story-feature-stamp">NHL<br /><small>International</small></span></div><div className="home-story-feature-copy"><span className="home-story-feature-kicker">A sourcing partner for the complete garment</span><p>At NHL International, our story is built on a passion for connecting global apparel brands with reliable, high-quality garment accessories. Headquartered in Ningbo, China, with strong market experience across Sri Lanka and Southeast Asia, we have established ourselves as a trusted sourcing and manufacturing partner for customers worldwide.</p><p>From zippers, buttons, labels and drawcords to a complete range of garment trims and packaging accessories, we are committed to delivering precision, consistency and value in every order.</p><div className="home-story-feature-bottom"><div><strong>19</strong><span>trim categories</span></div><div><strong>01</strong><span>considered partner</span></div><div><strong>∞</strong><span>ways to specify</span></div></div><div className="story-quote">“Build lasting partnerships through trust, innovation and excellence in every detail.”<small>— NHL International operational philosophy</small></div></div></div></div></section>
      <section className="section section-dark"><div className="container-wide"><SectionLabel>How We Work</SectionLabel><div className="section-head"><h2 className="section-heading">A clear process from inquiry to delivery.</h2><p className="section-copy" style={{ color: "rgba(255,255,255,.6)" }}>A concise, reliable path from the first brief to the final packed order.</p></div><div className="process-grid">{processSteps.map((step) => <div className="process-step" key={step.number}><span className="process-num">Step {step.number}</span><h3>{step.title}</h3><p>{step.body}</p></div>)}</div></div></section>
      <section className="section home-capabilities"><div className="container-wide"><div className="home-section-intro"><div><SectionLabel>Manufacturing capabilities</SectionLabel><h2 className="section-heading">Practical capability, close at hand.</h2></div><p className="section-copy">The equipment and support areas that help keep a trim brief moving with fewer surprises.</p></div><div className="capability-grid">{capabilities.map((capability) => <article className="capability-card" key={capability.title}><span className="icon-box"><Icon name={capability.icon} /></span><h3>{capability.title}</h3><p>{capability.body}</p></article>)}</div></div></section>
      <InquiryBanner />
    </main>
  </>;
}
function InquiryBanner() {
  return <section className="cta-band"><div className="container-wide cta-band-inner"><div><SectionLabel>Inquiry</SectionLabel><h2>Request samples or a quotation.</h2><p>Our sourcing team will share specifications, minimum order quantities and lead times tailored to your production schedule.</p></div><Link className="button-dark" href="/contact/">Send an Inquiry <ArrowUpRight size={15} /></Link></div></section>;
}

function CatalogPage() {
  const [query, setQuery] = useState("");
  const [showOnlyWithInquiry, setShowOnlyWithInquiry] = useState(false);
  const { items } = useInquiry();
  const filtered = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(query.toLowerCase()) || category.short.toLowerCase().includes(query.toLowerCase())).filter((category) => !showOnlyWithInquiry || items.some((item) => item.startsWith(category.name))), [items, query, showOnlyWithInquiry]);
  return <><SiteMeta title="Catalog — NHL International" description="Browse 19 categories of garment trims, hardware and accessories from NHL International." path="/catalog/" /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/">Home</Link> <ChevronRight size={12} style={{ display: "inline" }} /> Catalog</div><SectionLabel>Catalog · 19 Categories</SectionLabel><h1 className="display">Browse the full range.</h1><p>Explore every category of trims, hardware and accessories we supply to apparel manufacturers worldwide.</p></div></section><section className="section"><div className="container-wide"><div className="catalog-toolbar"><div className="search-wrap"><Search size={17} /><input aria-label="Search catalog" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories or materials" /></div><div className="filter-pills"><button type="button" className={`filter-pill ${!showOnlyWithInquiry ? "active" : ""}`} onClick={() => setShowOnlyWithInquiry(false)}><SlidersHorizontal size={13} style={{ display: "inline", marginRight: 5 }} />All categories</button><button type="button" className={`filter-pill ${showOnlyWithInquiry ? "active" : ""}`} onClick={() => setShowOnlyWithInquiry(true)}>In my inquiry ({items.length})</button></div><span className="catalog-count">{filtered.length} shown</span></div>{filtered.length ? <div className="category-grid">{filtered.map((category) => <CategoryCard key={category.slug} category={category} withInquiry />)}</div> : <p className="empty-state">No categories match that search. Try a broader term.</p>}</div></section><InquiryBanner /></main></>;
}

function CategoryPage({ slug }: { slug: string }) {
  const category = getCategory(slug);
  const { addItem } = useInquiry();
  if (!category) return <NotFoundPage />;
  const productNames = ["Core profile", "Clean edge", "Signature finish", "Custom development"];
  return <><SiteMeta title={`${category.name} — NHL International`} description={`${category.name} trims and accessories from NHL International. Request samples, specifications or a quotation.`} path={`/${category.slug}/`} type="product" productCategory={category} /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/catalog/">← Back to Catalog</Link></div><SectionLabel>Category</SectionLabel><h1 className="display">{category.name}</h1><p>{category.short}</p></div></section><section className="section"><div className="container-wide category-layout"><div><div className="category-feature-art"><ArtPlaceholder src={DETAIL_IMAGE} alt={`${category.name} product detail placeholder`} label="Replace with category photography" /></div><div style={{ marginTop: "1.1rem" }}><SectionLabel>Request samples or a quotation</SectionLabel><h2 className="section-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.7rem)" }}>{category.name}, specified for your collection.</h2><p className="category-intro">{category.sourceIntro ?? `Explore a focused range of ${category.name.toLowerCase()} for apparel manufacturers and fashion brands. Product material, size and finish options are shown as placeholders until the final technical sheet is supplied.`}</p>{category.sourceIntro && <div className="source-note">Source note: {category.sourceIntro}</div>}<div className="button-row"><Link className="button-primary" href="/contact/">Request a sample <ArrowRight size={15} /></Link><button className="button-secondary" type="button" onClick={() => window.alert("E-catalog placeholder — please supply the final PDF to connect this download.")}>Download e-catalog <ArrowUpRight size={15} /></button></div></div></div><aside><div className="info-card"><SectionLabel>Technical overview</SectionLabel><dl className="spec-list"><div className="spec-row"><dt>Material</dt><dd>To confirm</dd></div><div className="spec-row"><dt>Sizes</dt><dd>To confirm</dd></div><div className="spec-row"><dt>Finish</dt><dd>To confirm</dd></div><div className="spec-row"><dt>MOQ / lead time</dt><dd>On request</dd></div></dl></div></aside></div></section><section className="section section-muted"><div className="container-wide"><div className="section-head"><div><SectionLabel>Range preview</SectionLabel><h2 className="section-heading">A place for the details buyers need.</h2></div><p className="section-copy">These product tiles are clearly marked placeholders until the final category photography and specification sheet are supplied.</p></div><div className="product-grid">{productNames.map((product) => <article className="product-card" key={product}><div className="product-image"><img src={DETAIL_IMAGE} alt={`${category.name} ${product} placeholder`} loading="lazy" /><span className="visual-placeholder">Replace product image</span></div><div className="product-content"><h3>{category.name} · {product}</h3><dl className="spec-list"><div className="spec-row"><dt>Material</dt><dd>To confirm</dd></div><div className="spec-row"><dt>Finish</dt><dd>To confirm</dd></div></dl><button className="button-secondary" type="button" onClick={() => addItem(`${category.name} — ${product}`)}>Add to inquiry <Plus size={14} /></button></div></article>)}</div></div></section><InquiryBanner /></main></>;
}

function AboutPage() {
  return <><SiteMeta title="About Us — NHL International" description="Learn how NHL International connects apparel brands with reliable garment trims and accessories." path="/home" /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/">Home</Link> <ChevronRight size={12} style={{ display: "inline" }} /> About Us</div><SectionLabel>Our Story</SectionLabel><h1 className="display">Built on precision, sustained by trust.</h1><p>Connecting global apparel brands with reliable, high-quality garment accessories.</p></div></section><section className="section"><div className="container-wide story-grid"><div className="story-art"><ArtPlaceholder src={STORY_IMAGE} alt="Placeholder image for the NHL International sourcing story" /></div><div className="story-copy"><p>At NHL International, our story is built on a passion for connecting global apparel brands with reliable, high-quality garment accessories. Headquartered in Ningbo, China, with strong market experience across Sri Lanka and Southeast Asia, we have established ourselves as a trusted sourcing and manufacturing partner for customers worldwide.</p><p>From zippers, buttons, labels, and drawcords to a complete range of garment trims and packaging accessories, we are committed to delivering precision, consistency, and value in every order.</p><p>By combining industry expertise, a dependable supply chain, and a customer-first approach, we help brands streamline their sourcing while maintaining the highest standards of quality, competitive pricing, and on-time delivery.</p><div className="story-quote">Our mission remains the same — build lasting partnerships through trust, innovation, and excellence in every detail.</div></div></div></section><section className="section section-muted"><div className="container-narrow"><SectionLabel>Content confirmation</SectionLabel><h2 className="section-heading">A clear next content pass.</h2><p className="section-copy">The source site refers to Ningbo, China as the headquarters and lists a Kotte, Colombo address. Please confirm the preferred office and headquarters wording before launch. The redesign intentionally leaves years-in-business and capability numbers as placeholders because no verified figures were provided.</p><Link className="text-link" href="/contact/">Share the final details <ArrowRight size={15} /></Link></div></section><InquiryBanner /></main></>;
}

function HowWeWorkPage() {
  return <><SiteMeta title="How We Work — NHL International" description="A clear process from inquiry to delivery at NHL International." path="/how-we-work/" /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/">Home</Link> <ChevronRight size={12} style={{ display: "inline" }} /> How We Work</div><SectionLabel>Our Process</SectionLabel><h1 className="display">From first brief to final pack.</h1><p>A clear process from inquiry to delivery, with quality checks built into every step.</p></div></section><section className="section section-dark"><div className="container-wide"><div className="process-grid">{processSteps.map((step) => <div className="process-step" key={step.number}><span className="process-num">Step {step.number}</span><h3>{step.title}</h3><p>{step.body}</p></div>)}</div></div></section><section className="section"><div className="container-wide"><div className="section-head"><div><SectionLabel>Capabilities</SectionLabel><h2 className="section-heading">Technical confidence in every stage.</h2></div><p className="section-copy">The capability descriptions below preserve the visible wording from the current site while giving each service room to be understood.</p></div><div className="capability-grid">{capabilities.map((capability) => <article className="capability-card" key={capability.title}><span className="icon-box"><Icon name={capability.icon} /></span><h3>{capability.title}</h3><p>{capability.body}</p></article>)}</div></div></section><InquiryBanner /></main></>;
}

function CertificationsPage() {
  return <><SiteMeta title="Certifications — NHL International" description="Explore the textile safety and sustainability certifications referenced by NHL International." path="/certifications/" /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/">Home</Link> <ChevronRight size={12} style={{ display: "inline" }} /> Certifications</div><SectionLabel>Certified Quality, Globally Trusted</SectionLabel><h1 className="display">Quality you can specify.</h1><p>The current source site references these textile safety and sustainability standards.</p></div></section><section className="section"><div className="container-wide"><div className="cert-grid">{certifications.map((certification) => <article className="cert-card" key={certification.name}><img src={certification.image} alt={`${certification.name} certificate logo`} loading="lazy" /><h3>{certification.name}</h3><p>{certification.body}</p></article>)}</div><div className="source-note" style={{ marginTop: "2rem" }}>Certificate image files, certificate IDs and validity dates should be supplied for final verification before launch. The current source copy is retained here without adding unverified claim details.</div></div></section><InquiryBanner /></main></>;
}

function ContactPage() {
  const { items, removeItem } = useInquiry();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", country: "", category: "", quantity: "", message: "" });
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      sessionStorage.setItem("nhl-inquiry-draft", JSON.stringify({ ...form, items, submittedAt: new Date().toISOString() }));
    } catch {
      // Draft capture is best effort in private browsing contexts.
    }
    setSubmitted(true);
  };
  return <><SiteMeta title="Send an Inquiry — NHL International" description="Request samples or a quotation from NHL International's garment trims sourcing team." path="/contact/" /><main><section className="page-hero"><div className="container-wide"><div className="breadcrumb"><Link href="/">Home</Link> <ChevronRight size={12} style={{ display: "inline" }} /> Contact</div><SectionLabel>Get in touch</SectionLabel><h1 className="display">Send an Inquiry</h1><p>Share your requirements and our team will respond with samples, specifications and quotation details.</p></div></section><section className="section"><div className="container-wide contact-grid"><div className="contact-intro"><h2>Let's talk about the next detail.</h2><p>Tell us what you are developing, where you are sourcing from and what you need to validate. The more context you share, the more useful our response can be.</p><div className="contact-list"><div className="contact-item"><MapPin size={17} /><div><strong>Address</strong><span>{contact.address}</span></div></div><div className="contact-item"><Phone size={17} /><div><strong>Phone</strong><a href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a></div></div><div className="contact-item"><Mail size={17} /><div><strong>Email</strong><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div><div className="contact-item"><MessageCircle size={17} /><div><strong>WhatsApp</strong><a href={contact.whatsapp} target="_blank" rel="noreferrer">Message the sourcing team</a></div></div></div></div><div className="form-card">{submitted && <div className="form-success" role="status">Preview only: your details and selected items were saved to this browser session. No message or file was sent. Connect the final email or CRM destination before launch.</div>}{items.length > 0 && <div className="inquiry-list"><h3>Selected inquiry items</h3><ul>{items.map((item) => <li key={item}><span>{item}</span><button type="button" aria-label={`Remove ${item}`} onClick={() => removeItem(item)}><X size={13} /></button></li>)}</ul></div>}<form onSubmit={onSubmit}><div className="form-grid"><div className="form-field"><label htmlFor="name">Name *</label><input id="name" required value={form.name} onChange={(event) => update("name", event.target.value)} /></div><div className="form-field"><label htmlFor="company">Company *</label><input id="company" required value={form.company} onChange={(event) => update("company", event.target.value)} /></div><div className="form-field"><label htmlFor="email">Email *</label><input id="email" type="email" required value={form.email} onChange={(event) => update("email", event.target.value)} /></div><div className="form-field"><label htmlFor="country">Country *</label><input id="country" required value={form.country} onChange={(event) => update("country", event.target.value)} /></div><div className="form-field"><label htmlFor="category">Product category</label><select id="category" value={form.category} onChange={(event) => update("category", event.target.value)}><option value="">Select a category</option>{categories.map((category) => <option key={category.slug} value={category.name}>{category.name}</option>)}</select></div><div className="form-field"><label htmlFor="quantity">Estimated quantity</label><input id="quantity" value={form.quantity} onChange={(event) => update("quantity", event.target.value)} placeholder="e.g. 10,000 pcs" /></div><div className="form-field full"><label htmlFor="message">Message *</label><textarea id="message" required value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us about your trims, materials, finishes, timeline or sampling needs." /></div><div className="form-field full"><label htmlFor="artwork">Artwork or reference file</label><input id="artwork" className="file-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.ai,.eps" /><span style={{ color: "var(--muted)", fontSize: ".68rem" }}>File upload is ready in the UI; connect storage before launch.</span></div></div><div className="button-row"><button className="button-primary" type="submit">Send Inquiry <ArrowRight size={15} /></button><a className="button-secondary" href={contact.whatsapp} target="_blank" rel="noreferrer">WhatsApp <MessageCircle size={15} /></a></div></form></div></div></section></main></>;
}

function NotFoundPage() {
  return <><SiteMeta title="Page not found — NHL International" description="The page you requested could not be found." path="/404" /><main><section className="page-hero"><div className="container-wide"><SectionLabel>404</SectionLabel><h1 className="display">That detail is not in the range.</h1><p>Return to the homepage or browse the full catalog.</p><div className="button-row"><Link className="button-primary" href="/">Back home <ArrowRight size={15} /></Link><Link className="button-secondary" href="/catalog/">Browse catalog <ArrowUpRight size={15} /></Link></div></div></section></main></>;
}

function InquiryTray() {
  const { items } = useInquiry();
  if (!items.length) return null;
  return <div className="inquiry-tray" role="status"><span><strong>{items.length}</strong> {items.length === 1 ? "item" : "items"} ready for your inquiry</span><Link className="button-primary" href="/contact/">Review & send <ArrowRight size={14} /></Link></div>;
}

function Router() {
  const [location] = useLocation();
  const path = location.replace(/\/+$/, "") || "/";
  if (path === "/") return <HomePage />;
  if (path === "/catalog") return <CatalogPage />;
  if (path === "/home" || path === "/about-us") return <AboutPage />;
  if (path === "/how-we-work") return <HowWeWorkPage />;
  if (path === "/certifications") return <CertificationsPage />;
  if (path === "/contact") return <ContactPage />;
  const categorySlug = path.replace(/^\//, "");
  if (getCategory(categorySlug)) return <CategoryPage slug={categorySlug} />;
  return <NotFoundPage />;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><InquiryProvider><Header /><Router /><InquiryTray /><Footer /></InquiryProvider><Toaster /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
