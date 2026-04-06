import { Shield, AlertTriangle, AlertOctagon, Loader2, ScanSearch, Pill, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export interface AnalysisCondition {
  name: string; prob: number; desc: string;
}
export interface Medicine {
  name: string; type: string; dosage: string; duration: string; online: string; store: string; usage: string;
}
export interface Remedy {
  title: string; desc: string;
}
export interface Doctor {
  name: string; spec: string; hosp: string; city: string; rating: number; reviews: number; exp: number; init: string; why: string;
}
export interface AnalysisResult {
  risk_level: 'safe' | 'at_risk' | 'critical';
  confidence: number;
  conditions: AnalysisCondition[];
  summary: string;
  emergency: string | null;
  advice: string[];
  medicines: Medicine[];
  remedies: Remedy[];
  doctors: Doctor[];
}

const riskConfig = {
  safe: { icon: Shield, label: 'Safe', badge: 'bg-teal-subtle text-teal border-primary/30', headerBg: 'bg-primary/[0.06]' },
  at_risk: { icon: AlertTriangle, label: 'At Risk', badge: 'bg-amber-subtle text-amber border-warning/30', headerBg: 'bg-warning/[0.06]' },
  critical: { icon: AlertOctagon, label: 'Critical', badge: 'bg-red-subtle text-red border-destructive/30', headerBg: 'bg-destructive/[0.06]' },
};

export default function AnalysisResults({ result, isLoading }: { result: AnalysisResult | null; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-navy3 border border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Analysing your symptoms...</p>
        <div className="flex flex-col gap-2 mt-2 text-xs text-muted-foreground">
          {['Identifying conditions', 'Assessing risk level', 'Building care plan', 'Finding doctors & pharmacies'].map((s, i) => (
            <div key={s} className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-primary' : 'bg-border'}`} />{s}</div>
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-navy3 border border-border rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <ScanSearch className="w-12 h-12 opacity-40" />
        <p className="text-sm">Results will appear here</p>
        <p className="text-xs">Upload images or describe symptoms to begin.</p>
      </div>
    );
  }

  const config = riskConfig[result.risk_level];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-navy3 border border-border rounded-2xl overflow-hidden flex flex-col gap-0">
      {/* Header */}
      <div className={`px-5 py-4 flex items-center gap-3 ${config.headerBg}`}>
        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${config.badge}`}>{config.label}</span>
        <span className="text-sm font-semibold text-foreground flex-1">{result.conditions[0]?.name || 'Health Assessment'}</span>
        <span className="text-xs text-muted-foreground">{result.confidence}% confidence</span>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5 overflow-y-auto max-h-[600px]">
        {/* Emergency */}
        {result.emergency && (
          <div className="bg-red-subtle border border-destructive/30 rounded-lg px-4 py-3 flex items-start gap-2 text-sm text-red">
            <AlertOctagon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span><strong>EMERGENCY:</strong> {result.emergency}</span>
          </div>
        )}

        {/* Summary */}
        <div>
          <Label>Analysis Summary</Label>
          <div className="bg-accent border border-border rounded-lg p-3.5 text-sm text-mid leading-relaxed">{result.summary}</div>
        </div>

        {/* Conditions */}
        {result.conditions.length > 0 && (
          <div>
            <Label>Predicted Conditions</Label>
            <div className="flex flex-col gap-2">
              {result.conditions.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground flex-1">{c.name}</span>
                  <div className="h-1 bg-border rounded-full w-20"><div className="h-full bg-primary rounded-full transition-all" style={{ width: `${c.prob}%` }} /></div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{c.prob}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advice */}
        {result.advice.length > 0 && (
          <div>
            <Label>Medical Advice</Label>
            <div className="bg-accent border border-border rounded-lg p-3.5 text-sm text-mid leading-loose">
              <ul className="list-disc pl-4 space-y-1">{result.advice.map(a => <li key={a}>{a}</li>)}</ul>
            </div>
          </div>
        )}

        {/* Medicines */}
        {result.medicines.length > 0 && (
          <div>
            <Label><Pill className="w-3 h-3 inline mr-1" />Medicines & Availability</Label>
            <div className="space-y-3">
              {result.medicines.map(m => (
                <div key={m.name} className="bg-accent border border-border rounded-lg p-3.5">
                  <div className="flex items-start justify-between mb-1">
                    <div><div className="text-sm font-semibold text-foreground">{m.name}</div><div className="text-[11px] text-muted-foreground">{m.type}</div></div>
                    <div className="text-right"><div className="text-xs text-mid">{m.dosage}</div><div className="text-[11px] text-muted-foreground">{m.duration}</div></div>
                  </div>
                  <p className="text-xs text-teal mt-2 leading-relaxed">💊 {m.usage}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">🌐 {m.online}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-teal-subtle text-teal border border-primary/20">🏪 {m.store}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Remedies */}
        {result.remedies.length > 0 && (
          <div>
            <Label>Home Remedies</Label>
            <div className="space-y-2">
              {result.remedies.map(r => (
                <div key={r.title} className="flex gap-2.5 items-start text-sm text-mid">
                  <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-[11px] flex-shrink-0">🌿</span>
                  <div><strong className="text-foreground">{r.title}:</strong> {r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doctors */}
        {result.doctors.length > 0 && (
          <div>
            <Label><Stethoscope className="w-3 h-3 inline mr-1" />{result.risk_level === 'critical' ? 'Specialist Doctors — Urgent' : 'Recommended Doctors'}</Label>
            <div className="space-y-2">
              {result.doctors.map(d => (
                <div key={d.name} className="bg-accent border border-border rounded-lg p-3.5 flex items-start gap-3 hover:border-primary/30 transition">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-teal flex-shrink-0">{d.init}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">Dr. {d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.spec} · {d.exp} yrs exp</div>
                    <div className="text-xs text-mid mt-0.5">{d.hosp}, {d.city}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber text-xs">{'★'.repeat(Math.round(d.rating))}</span>
                      <span className="text-[11px] text-muted-foreground">{d.rating} ({d.reviews} reviews)</span>
                    </div>
                  </div>
                  <a href="#book" className="px-3 py-1.5 bg-primary/10 text-teal text-xs font-semibold rounded-md hover:bg-primary/20 transition flex-shrink-0">Book ↓</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">{children}</div>;
}
