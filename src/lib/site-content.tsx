import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

import hero from "@/assets/hero-lab.jpg";
import dna from "@/assets/dna-bg.jpg";
import pip from "@/assets/pipette.jpg";

export type NewsPost = {
  id: string;
  slug: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  body: string;
  cover?: string;
};

export type GalleryImage = { id: string; url: string; caption?: string; name?: string; description?: string };

export type ContactInfo = {
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl?: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
};

export type DealOfWeek = {
  productId: string;        // links to PRODUCTS
  eyebrow: string;
  headline: string;         // can include the product name override
  blurb: string;
  price: number;
  oldPrice: number;
  discountLabel: string;    // e.g. "-30%"
};

interface SiteContentValue {
  news: NewsPost[];
  gallery: GalleryImage[];
  contact: ContactInfo;
  deal: DealOfWeek;
  practicalDates: string[]; // ISO date strings, set by admin/editor
  saveNews: (n: NewsPost) => void;
  deleteNews: (id: string) => void;
  addGallery: (img: GalleryImage) => void;
  deleteGallery: (id: string) => void;
  updateContact: (c: ContactInfo) => void;
  updateDeal: (d: DealOfWeek) => void;
  addPracticalDate: (iso: string) => void;
  removePracticalDate: (iso: string) => void;
  resetAll: () => void;
}

const KEY = "ab.site.content.v1";

const DEFAULTS: { news: NewsPost[]; gallery: GalleryImage[]; contact: ContactInfo; deal: DealOfWeek; practicalDates: string[] } = {
  news: [
    { id: "n1", slug: "science-camp-2026", tag: "Event", date: "May 12, 2026", title: "Science Camp 2026 Opens Registration", excerpt: "Our flagship 4-week holiday science camp returns for hands-on biotech discovery.", body: "Registration is now open for the 2026 edition of our flagship Science Camp. Over four weeks, students from secondary schools across West Africa will rotate through hands-on labs covering DNA extraction, microscopy, fermentation, and intro bioinformatics. Spots are limited — early-bird pricing closes June 30.", cover: hero },
    { id: "n2", slug: "diagnostics-cohort", tag: "Training", date: "Apr 28, 2026", title: "New Molecular Diagnostics Cohort", excerpt: "Internationally certified curriculum begins with 30 trainees from 6 countries.", body: "Our newest molecular diagnostics cohort kicked off this week with 30 trainees representing 6 African countries. The 12-week program covers PCR, qPCR, sequencing fundamentals and biosafety, leading to an internationally recognized certification.", cover: dna },
    { id: "n3", slug: "spring-catalogue", tag: "Equipment", date: "Apr 02, 2026", title: "Reagent Sale: Spring Catalogue", excerpt: "Discounts on PCR consumables, cell culture media and lab plasticware.", body: "Our spring catalogue is live with up to 30% off select reagents, consumables and lab plasticware. Bulk orders ship within 48 hours, and registered labs get an additional 5% loyalty discount.", cover: pip },
    { id: "n4", slug: "ebsu-mou", tag: "Partnership", date: "Mar 15, 2026", title: "MOU Signed With Ebonyi State University", excerpt: "Collaboration on translational research and graduate fellowships.", body: "We're proud to announce a new MOU with Ebonyi State University for joint translational research and graduate fellowships across molecular diagnostics, bioinformatics and applied microbiology.", cover: hero },
  ],
  gallery: [
    { id: "g1", url: hero, name: "Main Lab Floor", description: "Our flagship molecular biology lab in Abuja — equipped for PCR, sequencing and cell culture work." },
    { id: "g2", url: dna, name: "DNA Extraction Bench", description: "Where samples are prepped, quantified and queued for downstream genomics analysis." },
    { id: "g3", url: pip, name: "Precision Pipetting", description: "Trainees practising micropipette technique during a hands-on Molecular Diagnostics cohort." },
    { id: "g4", url: hero, name: "Cohort Briefing", description: "Pre-lab briefing for our international diagnostics fellowship — safety first, science second." },
    { id: "g5", url: pip, name: "Reagent Prep", description: "Reagent preparation room where every batch is QC-verified before leaving for the field." },
    { id: "g6", url: dna, name: "Sequencing Run", description: "A long-read sequencing run in progress — generating data for our pathogen surveillance work." },
    { id: "g7", url: dna, name: "Mobile Lab Build", description: "Final fit-out of one of our deployable mobile labs heading out to a partner site." },
    { id: "g8", url: hero, name: "Lab Inauguration", description: "Opening day for a partner-built molecular facility in Eastern Nigeria." },
    { id: "g9", url: pip, name: "Practical Session", description: "Trainees running their first independent PCR — every plate is theirs to own." },
  ],
  contact: {
    address: "Plot 234, Biotech Way, Abuja, Nigeria",
    phone: "+234 800 123 4567",
    email: "info@appliedbiotech.com",
    hours: "Mon–Fri · 8am – 6pm WAT",
    mapUrl: "",
    facebook: "https://facebook.com/appliedbiotech",
    twitter: "https://twitter.com/appliedbiotech",
    linkedin: "https://linkedin.com/company/appliedbiotech",
    instagram: "https://instagram.com/appliedbiotech",
  },
  deal: {
    productId: "3",
    eyebrow: "Deal of the Week",
    headline: "Microfuge Tube RNAse-free 1.5ml",
    blurb: "Premium-grade certified tubes — perfect for sensitive PCR and RNA work. Limited stock.",
    price: 8500,
    oldPrice: 12000,
    discountLabel: "-30%",
  },
  practicalDates: [],
};

const Ctx = createContext<SiteContentValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...DEFAULTS, ...parsed });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const saveNews = useCallback((n: NewsPost) => {
    setState((s) => {
      const exists = s.news.some((x) => x.id === n.id);
      return { ...s, news: exists ? s.news.map((x) => (x.id === n.id ? n : x)) : [n, ...s.news] };
    });
  }, []);

  const deleteNews = useCallback((id: string) => {
    setState((s) => ({ ...s, news: s.news.filter((x) => x.id !== id) }));
  }, []);

  const addGallery = useCallback((img: GalleryImage) => {
    setState((s) => ({ ...s, gallery: [img, ...s.gallery] }));
  }, []);

  const deleteGallery = useCallback((id: string) => {
    setState((s) => ({ ...s, gallery: s.gallery.filter((x) => x.id !== id) }));
  }, []);

  const updateContact = useCallback((c: ContactInfo) => {
    setState((s) => ({ ...s, contact: c }));
  }, []);

  const updateDeal = useCallback((d: DealOfWeek) => {
    setState((s) => ({ ...s, deal: d }));
  }, []);

  const addPracticalDate = useCallback((iso: string) => {
    setState((s) => s.practicalDates.includes(iso) ? s : { ...s, practicalDates: [...s.practicalDates, iso].sort() });
  }, []);

  const removePracticalDate = useCallback((iso: string) => {
    setState((s) => ({ ...s, practicalDates: s.practicalDates.filter((d) => d !== iso) }));
  }, []);

  const resetAll = useCallback(() => setState(DEFAULTS), []);

  return (
    <Ctx.Provider value={{ ...state, saveNews, deleteNews, addGallery, deleteGallery, updateContact, updateDeal, addPracticalDate, removePracticalDate, resetAll }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSiteContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSiteContent must be used within SiteContentProvider");
  return v;
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
