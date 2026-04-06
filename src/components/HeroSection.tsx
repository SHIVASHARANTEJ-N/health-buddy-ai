import { motion } from 'framer-motion';
import { ScanSearch } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,hsl(var(--teal)/0.06),transparent_70%)]" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />

      <motion.div className="relative z-10 text-center max-w-3xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <div className="inline-flex items-center gap-2 bg-teal-subtle border border-primary/30 px-4 py-1.5 rounded-full text-xs text-teal font-medium tracking-wide mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
          AI-Powered Health Intelligence
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight">
          Your personal<br /><em className="text-teal italic">medical analyst</em><br />powered by AI
        </h1>

        <p className="text-base sm:text-lg text-mid leading-relaxed max-w-xl mx-auto mt-6 mb-8">
          Upload X-rays, scan reports, or describe your symptoms. Get instant risk assessment, disease prediction, prescriptions, and specialist recommendations.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#analyse" className="bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-semibold text-sm inline-flex items-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all hover:shadow-[0_8px_30px_hsl(var(--teal)/0.3)]">
            <ScanSearch className="w-4 h-4" /> Analyse Now — It's Free
          </a>
          <a href="#features" className="border border-border/50 text-foreground px-7 py-3.5 rounded-full font-medium text-sm hover:border-foreground/30 hover:bg-foreground/5 transition-all">
            Learn More
          </a>
        </div>

        <div className="flex items-center justify-center gap-12 mt-16 pt-8 border-t border-border">
          {[['50K+', 'Analyses Done'], ['98%', 'Accuracy Rate'], ['200+', 'Doctors Network']].map(([num, label]) => (
            <div key={label}>
              <div className="font-heading text-2xl text-foreground font-semibold">{num}</div>
              <div className="text-xs text-muted-foreground mt-0.5 tracking-wide">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
