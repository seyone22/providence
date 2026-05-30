import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import {GoogleTagManager} from '@next/third-parties/google';
import {Toaster} from "sonner";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "World’s Largest Borderless Showroom | Global Car Sourcing & Direct Import",
        template: "%s | Providence Auto",
    },
    description: "Source any car from 40+ global markets with Providence Auto. We provide tax-efficient, premium pre-owned vehicles delivered with zero logistical friction.",
    keywords: [
        "Global car sourcing", "direct car import service", "tax-efficient vehicle procurement",
        "borderless car showroom", "luxury car exporter London", "buy cars from overseas",
        "7-seater family SUVs", "luxury executive sedans", "premium electric vehicles",
        "high-performance supercars", "right-hand drive imports"
    ],
    authors: [{name: "Providence Auto"}],
    creator: "Providence Auto",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://providenceauto.co.uk/",
        siteName: "Providence Auto",
        title: "World’s Largest Borderless Showroom | Global Car Sourcing",
        description: "Save on luxury SUVs, sedans, and performance cars by cutting out the middleman. Direct delivery to your port.",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "Providence Auto Global Car Sourcing",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Providence Auto | Global Car Sourcing & Direct Import",
        description: "Source premium vehicles from 40+ global markets tax-efficiently.",
        images: ["/og-image.jpg"],
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
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        "name": "Providence Auto",
        "url": "https://providenceauto.co.uk/",
        "logo": "https://providenceauto.co.uk/logo.png",
        "description": "Global borderless showroom sourcing premium vehicles from 40+ markets.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "468 Church Lane, Kingsbury",
            "addressLocality": "London",
            "postalCode": "NW9 8UA",
            "addressCountry": "UK"
        },
        "telephone": "+44 208 004 3000",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Global Car Sourcing",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "B2C Direct Car Import",
                        "description": "Direct vehicle sourcing for individual buyers to save on local dealer markups."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "B2B Dealership Inventory Scaling",
                        "description": "Bulk sourcing and logistical handling for car dealerships worldwide."
                    }
                }
            ]
        }
    };

    const categorySchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Luxury Sedans"},
            {"@type": "ListItem", "position": 2, "name": "7-Seater SUVs"},
            {"@type": "ListItem", "position": 3, "name": "Electric Vehicles (BEV/PHEV)"},
            {"@type": "ListItem", "position": 4, "name": "High-Performance Sports Cars"},
            {"@type": "ListItem", "position": 5, "name": "Executive Coupes"}
        ]
    };

    return (
        <html lang="en">
        <head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(organizationSchema)}}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(categorySchema)}}
            />
            {/* If JS is unavailable, show scroll-reveal content instead of leaving it hidden */}
            <noscript>
                <style>{`.pa-reveal,.pa-reveal-immediate{opacity:1 !important;transform:none !important}`}</style>
            </noscript>
            {/* Reveal runtime — decoupled from React so reveals fire as the HTML
                parses (not after hydration). One IntersectionObserver; motion via
                the Web Animations API so it never conflicts with hover/transition
                styles and the revealed state stays declaratively visible. */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `(function(){
  var RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var EASE = 'cubic-bezier(0.16,1,0.3,1)';
  function reveal(el){
    if(el.__par || el.classList.contains('pa-revealed')) return;
    el.__par = 1;
    el.classList.add('pa-revealed');
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
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){ if(es[i].isIntersecting){ var t=es[i].target; reveal(t); io.unobserve(t); } }
  }, {rootMargin:'0px 0px -8% 0px', threshold:0}) : null;
  function add(el){
    if(el.classList.contains('pa-reveal-immediate')){ reveal(el); return; }
    if(!io){ reveal(el); return; }
    io.observe(el);
  }
  function scan(root){
    var els=(root||document).querySelectorAll('.pa-reveal:not(.pa-revealed),.pa-reveal-immediate:not(.pa-revealed)');
    for(var i=0;i<els.length;i++) add(els[i]);
  }
  function init(){
    scan();
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
      }).observe(document.body||document.documentElement,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();`,
                }}
            />
        </head>
        <GoogleTagManager gtmId="GTM-K7GCCZXQ"/>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <MotionProvider>
            <div className="flex-1">
                {children}
            </div>
            <Footer/>
        </MotionProvider>
        <Toaster position="bottom-right" richColors/>
        </body>
        </html>
    );
}