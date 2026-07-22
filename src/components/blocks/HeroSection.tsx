"use client";

import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const textReveal = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
      delay: i * 0.1,
    },
  }),
};

export function HeroSection() {
  return (
    <section className="bg-white text-navy px-6 py-24 md:py-32 lg:py-40 border-b-2 border-navy relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border-2 border-navy px-3 py-1 bg-navy text-white text-xs font-bold uppercase tracking-widest"
          >
            <Activity className="w-4 h-4" />
            <span>Immersive Journeys</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter overflow-hidden flex flex-col">
            <motion.span custom={0} variants={textReveal} initial="hidden" animate="visible">Premium</motion.span>
            <motion.span custom={1} variants={textReveal} initial="hidden" animate="visible">Tourism</motion.span>
            <motion.span custom={2} variants={textReveal} initial="hidden" animate="visible">Supremacy.</motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-slate max-w-xl font-medium leading-relaxed"
          >
            Uncompromising curated travel and exclusive cultural domiciliation. Designed exclusively for explorers demanding absolute authenticity in Morocco.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Magnetic>
              <Button asChild size="lg" className="text-base w-full sm:w-auto z-20">
                <Link href="/request-access">
                  Apply for Access <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg" className="text-base w-full sm:w-auto z-20">
                <Link href="#services">
                  View Experiences
                </Link>
              </Button>
            </Magnetic>
          </motion.div>
        </div>
        
        <div className="flex-1 hidden md:block relative">
          <motion.div 
            initial={{ rotate: -3, opacity: 0, scale: 0.9 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
            className="aspect-square bg-navy relative overflow-hidden border-4 border-navy shadow-[16px_16px_0px_0px_rgba(74,85,104,1)] group"
          >
            <Image 
              src="/morocco_hero.png" 
              alt="Premium Moroccan Architecture"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-125 saturate-50"
              priority
            />
            <div className="absolute inset-0 bg-navy/20 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 border border-white/20 pointer-events-none m-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
