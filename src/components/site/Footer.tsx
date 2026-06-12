import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState, useEffect, useCallback } from "react";
import useFetch from "@/hooks/useFetch";

export function Footer() {
  const { fetchData } = useFetch();
  const [contact, setContact] = useState({
    address: "Applied Biotech Hub, Nigeria",
    phone: "+234 000 000 0000",
    email: "info@appliedbiotech.ng",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const loadContact = useCallback(async () => {
    try {
      const res = await fetchData("/api/v1/content");
      if (res && Array.isArray(res)) {
        const data = res.find((i: any) => i.key === "contact_info");
        if (data?.value) setContact({
          address: data.value.address || "Applied Biotech Hub, Nigeria",
          phone: data.value.phone || "+234 000 000 0000",
          email: data.value.email || "info@appliedbiotech.ng",
          facebook: data.value.facebookUrl || "",
          twitter: data.value.twitterUrl || "",
          linkedin: data.value.linkedinUrl || "",
          instagram: data.value.instagramUrl || "",
        });
      }
    } catch (err) {}
  }, [fetchData]);

  useEffect(() => { loadContact(); }, [loadContact]);

  const socials: { I: typeof Facebook; href: string }[] = [
    { I: Facebook, href: contact.facebook },
    { I: Twitter, href: contact.twitter },
    { I: Linkedin, href: contact.linkedin },
    { I: Instagram, href: contact.instagram },
  ];
  return (
    <footer className="relative bg-foreground text-background mt-20 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full gradient-brand blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-9 p-1" />
          </div>
          <p className="mt-4 text-sm text-background/70 leading-relaxed">
            Pioneering innovative biotechnology pathways to provide healthier and well-being.
          </p>
          <div className="flex gap-3 mt-5">
            {socials.map((s, i) => (
              <a key={i} href={s.href || "#"} target={s.href ? "_blank" : undefined} rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <s.I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Solutions</h4>
          <ul className="space-y-2.5 text-sm text-background/70">
            <li><Link to="/services/$slug" params={{ slug: "molecular-lab" }} className="hover:text-background transition-colors">Molecular Lab</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "equipment" }} className="hover:text-background transition-colors">Equipment & Reagents</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "training" }} className="hover:text-background transition-colors">Training</Link></li>
            <li><Link to="/services/$slug" params={{ slug: "consulting" }} className="hover:text-background transition-colors">Consulting</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm text-background/70">
            <li><Link to="/about" className="hover:text-background transition-colors">About Us</Link></li>
            <li><Link to="/rd-portfolio" className="hover:text-background transition-colors">R&D Portfolio</Link></li>
            <li><Link to="/ip-publications" className="hover:text-background transition-colors">IP & Publications</Link></li>
            <li><Link to="/careers" className="hover:text-background transition-colors">Careers</Link></li>
            <li><Link to="/news" className="hover:text-background transition-colors">News</Link></li>
            <li><Link to="/gallery" className="hover:text-background transition-colors">Gallery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-background/70">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent-cyan" /><span>{contact.address}</span></li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent-cyan" /><a href={`tel:${contact.phone}`} className="hover:text-background transition-colors">{contact.phone}</a></li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent-cyan" /><a href={`mailto:${contact.email}`} className="hover:text-background transition-colors">{contact.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-background/10 py-5 text-center text-xs text-background/50">
        © {new Date().getFullYear()} Applied Biotech. All rights reserved.
      </div>
    </footer>
  );
}