import { Activity, Droplet } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy2 border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-teal" />
            <span className="font-heading text-xl text-foreground">Medi<span className="text-teal">Wise</span></span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">AI-powered health analysis and care recommendation platform. Helping patients make informed decisions.</p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-4">Services</h4>
          <div className="flex flex-col gap-2">
            <a href="#analyse" className="text-xs text-muted-foreground hover:text-teal transition">Symptom Analysis</a>
            <a href="#analyse" className="text-xs text-muted-foreground hover:text-teal transition">X-Ray Reading</a>
            <a href="#book" className="text-xs text-muted-foreground hover:text-teal transition">Book Doctors</a>
            <a href="https://www.friends2support.org/" target="_blank" rel="noopener noreferrer" className="text-xs text-destructive hover:text-red transition flex items-center gap-1"><Droplet className="w-3 h-3" /> Blood Requirement</a>
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-4">Info</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-xs text-muted-foreground hover:text-teal transition">About MediWise</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-teal transition">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-teal transition">Terms of Use</a>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-border flex flex-wrap justify-between items-center gap-2">
        <span className="text-xs text-muted-foreground">© 2026 MediWise. All rights reserved.</span>
        <span className="text-[10px] bg-red-subtle text-red border border-destructive/30 px-2.5 py-0.5 rounded-full">AI tool — Not a substitute for professional medical advice</span>
      </div>
    </footer>
  );
}
