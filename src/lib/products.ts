import pAgarose from "@/assets/prod-agarose.jpg";
import pFalcon from "@/assets/prod-falcon.jpg";
import pKit from "@/assets/prod-kit.jpg";
import pLab from "@/assets/prod-labcoat.jpg";
import pPip from "@/assets/prod-pipette.jpg";
import pPbs from "@/assets/prod-pbs.jpg";
import pGel from "@/assets/prod-gel.jpg";
import pMicro from "@/assets/prod-microfuge.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  img: string;
  tag?: string;
  rating: number;
  category: string;
  description: string;
  stock: number;
};

export const PRODUCTS: Product[] = [
  { id: "1", name: "50ml Falcon Tubes (Sterile, 25 pack)", price: 25000, oldPrice: 30000, img: pFalcon, tag: "HOT", rating: 5, category: "consumables", description: "Sterile, leak-proof 50ml conical tubes ideal for centrifugation, sample storage and reagent prep.", stock: 120 },
  { id: "2", name: "10ml Disposable Serological Pipettes", price: 25000, img: pPip, tag: "NEW", rating: 4, category: "consumables", description: "Individually wrapped, sterile, single-use serological pipettes with negative graduations.", stock: 220 },
  { id: "3", name: "Microfuge Tube 1.5ml RNAse-free", price: 8500, img: pMicro, tag: "SALE", rating: 5, category: "consumables", description: "Certified RNAse, DNAse and pyrogen-free 1.5ml tubes — perfect for sensitive PCR work.", stock: 540 },
  { id: "4", name: "Pre-cast Agarose Gel Cassette", price: 20000, img: pGel, rating: 4, category: "consumables", description: "Ready-to-run pre-cast gels for fast, consistent electrophoresis results.", stock: 60 },
  { id: "5", name: "Parafilm M Roll 2 IN x 250 ft", price: 25000, img: pPip, rating: 5, category: "consumables", description: "Self-sealing thermoplastic film for sealing flasks, plates, and tubes.", stock: 90 },
  { id: "6", name: "QIAamp DSP DNA Blood Mini Kit", price: 240000, img: pKit, rating: 5, category: "kits", description: "Spin-column based extraction of genomic DNA from whole blood — IVD-grade.", stock: 18 },
  { id: "7", name: "Lab Coat (ABNL Customized)", price: 10000, img: pLab, rating: 4, category: "apparel", description: "Branded, breathable cotton-poly lab coat with three pockets.", stock: 75 },
  { id: "8", name: "Pre-cast Gel", price: 20000, img: pGel, rating: 5, category: "consumables", description: "Pre-cast agarose gel cassettes — multiple well counts available.", stock: 45 },
  { id: "9", name: "50ml Falcon Tubes (Sterile)", price: 15000, img: pFalcon, rating: 4, category: "consumables", description: "Bulk pack of sterile 50ml falcon tubes.", stock: 330 },
  { id: "10", name: "10ml Serological Pipettes", price: 25000, img: pPip, rating: 5, category: "consumables", description: "Sterile, individually wrapped 10ml pipettes.", stock: 200 },
  { id: "11", name: "Agarose (Molecular Grade)", price: 100000, img: pAgarose, rating: 5, category: "reagents", description: "Molecular-biology-grade agarose powder for high-resolution DNA analysis.", stock: 40 },
  { id: "12", name: "PBS 10L 10X Powdered Concentrate", price: 250000, img: pPbs, rating: 4, category: "reagents", description: "Phosphate-buffered saline 10X powdered concentrate, makes 10L.", stock: 22 },
  { id: "13", name: "10ml Disposable Pipettes (pack)", price: 25000, img: pPip, rating: 4, category: "consumables", description: "Disposable serological pipettes, pack of 50.", stock: 180 },
  { id: "14", name: "Benchtop Microcentrifuge (12,000 rpm)", price: 850000, img: pMicro, tag: "NEW", rating: 5, category: "equipment", description: "Compact benchtop microcentrifuge with brushless motor and 24-place rotor.", stock: 8 },
  { id: "15", name: "Adjustable Micropipette 100–1000 µL", price: 95000, oldPrice: 120000, img: pPip, tag: "SALE", rating: 5, category: "equipment", description: "Single-channel adjustable volume micropipette with autoclavable lower assembly.", stock: 24 },
  { id: "16", name: "Mini Gel Electrophoresis System", price: 420000, img: pGel, rating: 4, category: "equipment", description: "Compact horizontal gel electrophoresis tank with combs and integrated UV-safe tray.", stock: 12 },
  { id: "17", name: "Pipette Tip Box Refill (1000 µL)", price: 18000, img: pPip, rating: 4, category: "accessories", description: "Universal-fit refill tips, sterile, low-retention. 96 tips per rack.", stock: 200 },
  { id: "18", name: "Tube Rack — 80 Position", price: 9500, img: pFalcon, rating: 4, category: "accessories", description: "Autoclavable polypropylene rack for 1.5/2.0 mL microtubes.", stock: 140 },
  { id: "19", name: "Lab Notebook (Hard-bound, 200 pages)", price: 6500, img: pLab, rating: 5, category: "accessories", description: "Numbered, archival-grade research notebook with carbonless duplicate pages.", stock: 90 },
  { id: "20", name: "RNA Isolation Mini Kit", price: 195000, img: pKit, tag: "HOT", rating: 5, category: "kits", description: "High-yield total RNA purification from cells and tissues — 50 preps.", stock: 22 },
  { id: "21", name: "Safety Goggles (Anti-fog)", price: 7500, img: pLab, rating: 4, category: "apparel", description: "Wrap-around anti-fog safety goggles with adjustable strap.", stock: 110 },
];

export const CATEGORIES = [
  { slug: "reagents", name: "Reagents" },
  { slug: "consumables", name: "Consumables" },
  { slug: "equipment", name: "Equipment" },
  { slug: "apparel", name: "Apparel" },
  { slug: "kits", name: "Kits" },
  { slug: "accessories", name: "Accessories" },
];

export function fmt(n: number) {
  return "₦" + n.toLocaleString("en-NG") + ".00";
}

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
