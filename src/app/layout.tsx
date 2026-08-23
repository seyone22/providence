import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from "sonner";
import ConditionalFooter from "@/components/ConditionalFooter";
import MotionProvider from "@/components/MotionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.providenceauto.co.uk"),
  title: {
    default:
      "World’s Largest Borderless Showroom | Global Car Sourcing & Direct Import",
    template: "%s | Providence Auto",
  },
  description:
    "Source any car from 40+ global markets with Providence Auto. Physical offices and operations teams in the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka — tax-efficient vehicles delivered with zero logistical friction.",
  keywords: [
    "Global car sourcing",
    "direct car import service",
    "tax-efficient vehicle procurement",
    "borderless car showroom",
    "international car exporter",
    "car sourcing offices worldwide",
    "buy cars from overseas",
    "7-seater family SUVs",
    "luxury executive sedans",
    "premium electric vehicles",
    "high-performance supercars",
    "right-hand drive imports",
  ],
  authors: [{ name: "Providence Auto" }],
  creator: "Providence Auto",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.providenceauto.co.uk/",
    siteName: "Providence Auto",
    title: "World’s Largest Borderless Showroom | Global Car Sourcing",
    description:
      "Eight countries, our own people in every one. Save on luxury SUVs, sedans, and performance cars by cutting out the middleman. Direct delivery to your port.",
    images: [
      {
        url: "/logo.png",
        width: 1007,
        height: 967,
        alt: "Providence Auto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Providence Auto | Global Car Sourcing & Direct Import",
    description:
      "Source premium vehicles from 40+ global markets tax-efficiently.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for SEO/AEO
  //
  // The office list is duplicated from src/config/countries.ts on purpose: this
  // is the ROOT layout, so every page pays for whatever it imports, and the
  // country config pulls in lucide icon references it does not need here. Keep
  // the two in sync when an office is added or its country changes.
  const offices = [
    { name: "United Kingdom", region: "Europe", slug: "united-kingdom" },
    { name: "Japan", region: "East Asia", slug: "japan" },
    { name: "United Arab Emirates", region: "Middle East", slug: "uae" },
    { name: "India", region: "South Asia", slug: "india" },
    { name: "Thailand", region: "South-East Asia", slug: "thailand" },
    { name: "Australia", region: "Oceania", slug: "australia" },
    { name: "New Zealand", region: "Oceania", slug: "new-zealand" },
    { name: "Sri Lanka", region: "South Asia", slug: "sri-lanka" },
  ];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Providence Auto",
    url: "https://www.providenceauto.co.uk/",
    logo: "https://www.providenceauto.co.uk/logo.png",
    description:
      "International vehicle sourcing and export group with physical offices in the UK, Japan, the UAE, India, Thailand, Australia, New Zealand and Sri Lanka, sourcing premium vehicles from 40+ markets.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "468 Church Lane, Kingsbury",
      addressLocality: "London",
      postalCode: "NW9 8UA",
      addressCountry: "UK",
    },
    telephone: "+44 208 004 3000",
    areaServed: "Worldwide",
    subOrganization: offices.map((office) => ({
      "@type": "LocalBusiness",
      name: `Providence Auto ${office.name}`,
      url: `https://www.providenceauto.co.uk/source-cars-from/${office.slug}`,
      areaServed: office.region,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Global Car Sourcing",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "B2C Direct Car Import",
            description:
              "Direct vehicle sourcing for individual buyers to save on local dealer markups.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "B2B Dealership Inventory Scaling",
            description:
              "Bulk sourcing and logistical handling for car dealerships worldwide.",
          },
        },
      ],
    },
  };

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Luxury Sedans" },
      { "@type": "ListItem", position: 2, name: "7-Seater SUVs" },
      {
        "@type": "ListItem",
        position: 3,
        name: "Electric Vehicles (BEV/PHEV)",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "High-Performance Sports Cars",
      },
      { "@type": "ListItem", position: 5, name: "Executive Coupes" },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />
        {/* If JS is unavailable, show scroll-reveal content instead of leaving it hidden */}
        <noscript>
          <style>{`.pa-reveal,.pa-reveal-immediate{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {/* Reveal runtime — decoupled from React so reveals fire as the HTML
                parses (not after hydration). Motion via the Web Animations API so
                it never conflicts with hover/transition styles and the revealed
                state stays declaratively visible.

                Every revealable element ships at opacity:0, so anything that
                stops this runtime from running leaves real content invisible on a
                fully loaded page. IntersectionObserver alone is not enough of a
                guarantee: its callbacks ride the rendering lifecycle, so a phone
                whose main thread is busy hydrating can hold a section on screen
                and unrevealed for seconds. So the observer is backed by a
                synchronous sweep — a plain getBoundingClientRect test that needs
                no frame — run at parse time, on scroll, on resize and on load. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var EASE = 'cubic-bezier(0.16,1,0.3,1)';
  var pending = [];
  var io = null;
  function reveal(el){
    if(el.__par || el.classList.contains('pa-revealed')) return;
    el.__par = 1;
    el.classList.add('pa-revealed');
    if(io){ try{ io.unobserve(el); }catch(e){} }
    if(RM || typeof el.animate !== 'function') return;
    var y=el.getAttribute('data-ry')||0, x=el.getAttribute('data-rx')||0, s=el.getAttribute('data-rs')||1;
    var d=parseInt(el.getAttribute('data-rd')||'600',10), delay=parseInt(el.getAttribute('data-rdelay')||'0',10);
    try{
      el.animate(
        [
          {opacity:0, transform:'translate3d('+x+'px,'+y+'px,0) scale('+s+')'},
          {opacity:1, transform:'translate3d(0,0,0) scale(1)'}
        ],
        {duration:d, delay:delay, easing:EASE, fill:'backwards'}
      );
    }catch(e){}
  }
  io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){ if(es[i].isIntersecting) reveal(es[i].target); }
  }, {rootMargin:'0px 0px 15% 0px', threshold:0}) : null;
  function near(el){
    var r = el.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight || 0;
    if(r.top === 0 && r.bottom === 0 && r.left === 0) return false;
    return r.top < h * 1.15 && r.bottom > 0;
  }
  function sweep(){
    if(!pending.length) return;
    var rest = [], i, el;
    for(i=0;i<pending.length;i++){
      el = pending[i];
      if(el.classList.contains('pa-revealed')) continue;
      if(near(el)) reveal(el); else rest.push(el);
    }
    pending = rest;
  }
  var queued = false;
  function onScroll(){
    if(queued) return;
    queued = true;
    setTimeout(function(){ queued = false; sweep(); }, 120);
  }
  function add(el){
    if(el.classList.contains('pa-reveal-immediate')){ reveal(el); return; }
    if(!io){ reveal(el); return; }
    io.observe(el);
    pending.push(el);
  }
  function scan(root){
    var els=(root||document).querySelectorAll('.pa-reveal:not(.pa-revealed),.pa-reveal-immediate:not(.pa-revealed)');
    for(var i=0;i<els.length;i++) add(els[i]);
    sweep();
  }
  if(window.MutationObserver){
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        var nodes=muts[i].addedNodes;
        for(var j=0;j<nodes.length;j++){
          var n=nodes[j];
          if(n.nodeType===1){
            if(n.classList && (n.classList.contains('pa-reveal')||n.classList.contains('pa-reveal-immediate'))) add(n);
            if(n.querySelectorAll) scan(n);
          }
        }
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
  }
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', onScroll);
  addEventListener('load', sweep);
  function init(){ scan(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`,
          }}
        />
      </head>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K7GCCZXQ');`,
        }}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K7GCCZXQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <MotionProvider>
          <div className="flex-1">{children}</div>
          <ConditionalFooter />
        </MotionProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
