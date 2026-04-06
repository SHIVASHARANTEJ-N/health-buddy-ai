import { Shield, AlertTriangle, AlertOctagon, Upload, Mic, Languages, MessageCircle, Stethoscope, Pill } from 'lucide-react';

const riskCards = [
  { icon: Shield, label: 'Safe', desc: 'OTC medicine, home remedies & medical advice', bg: 'bg-teal-subtle', color: 'text-teal' },
  { icon: AlertTriangle, label: 'At Risk', desc: 'Doctor prescription & specialist recommendations', bg: 'bg-amber-subtle', color: 'text-amber' },
  { icon: AlertOctagon, label: 'Critical', desc: 'Emergency doctors, hospitals & urgent care', bg: 'bg-red-subtle', color: 'text-red' },
];

const features = [
  { icon: Upload, title: 'Multi-Input Analysis', desc: 'Upload X-rays, scan reports, prescriptions, or describe symptoms via text and voice.', bg: 'bg-teal-subtle', color: 'text-teal' },
  { icon: Languages, title: 'Multilingual Support', desc: 'Speak or type in your preferred language. AI understands and responds accordingly.', bg: 'bg-amber-subtle', color: 'text-amber' },
  { icon: Stethoscope, title: 'Disease Prediction', desc: 'Accurate disease identification from images and symptom descriptions.', bg: 'bg-teal-subtle', color: 'text-teal' },
  { icon: Pill, title: 'Medicine & Availability', desc: 'Prescriptions with online & nearby store availability and usage info.', bg: 'bg-amber-subtle', color: 'text-amber' },
  { icon: MessageCircle, title: 'AI Health Chatbot', desc: 'Ask follow-up questions and get personalized health guidance.', bg: 'bg-teal-subtle', color: 'text-teal' },
  { icon: Mic, title: 'Voice Input', desc: 'Describe symptoms by speaking. Speech-to-text powered analysis.', bg: 'bg-red-subtle', color: 'text-red' },
];

export default function FeaturesSection() {
  return (
    <>
      <div className="bg-navy2 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3">
          {riskCards.map(r => (
            <div key={r.label} className="flex items-center gap-4 px-6 py-5 border-b md:border-b-0 md:border-r border-border last:border-0 hover:bg-navy3 transition">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${r.bg} ${r.color}`}>
                <r.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{r.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-3">Features</div>
          <h2 className="font-heading text-3xl sm:text-4xl text-foreground">Why <em className="text-teal italic">MediWise</em>?</h2>
          <p className="text-sm text-mid mt-3 max-w-lg">Advanced AI-powered health analysis with comprehensive care recommendations.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {features.map(f => (
              <div key={f.title} className="bg-navy2 border border-border rounded-xl p-6 hover:border-primary/30 hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.bg} ${f.color} relative`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-semibold text-foreground mb-2 relative">{f.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed relative">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
