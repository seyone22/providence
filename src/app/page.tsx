import { Globe, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import {Button} from "@/app/components/ui/button";

export default function Home() {
  return (
      <main className="min-h-screen bg-gradient-to-b from-[#1a2b4c] to-[#0d1526] text-white flex flex-col">
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-[-40px]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
            <Globe size={16} />
            <span className="text-sm">Worldwide Car Imports</span>
          </div>

          <h2 className="font-serif text-5xl md:text-7xl font-bold tracking-tight mb-4">
            Your Dream Car,<br />
            <span className="text-blue-500">Delivered Globally</span>
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mb-10">
            We source, ship, and deliver any vehicle from anywhere in the world.
            Premium service, transparent pricing, door-to-door delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link href="/request">
              <Button className="bg-white text-[#1a2b4c] hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                Request a Car <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 w-full sm:w-auto bg-transparent">
              Calculate Import Cost
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            {[
              { icon: Globe, text: "200+ Countries" },
              { icon: ShieldCheck, text: "Fully Insured" },
              { icon: Truck, text: "Door-to-Door" },
            ].map((feature, i) => (
                <div key={i} className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-4 px-6 backdrop-blur-sm">
                  <feature.icon className="text-blue-400" />
                  <span className="font-medium">{feature.text}</span>
                </div>
            ))}
          </div>
        </div>
      </main>
  );
}