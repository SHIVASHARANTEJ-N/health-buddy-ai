import { useState, useRef, useCallback } from 'react';
import { Upload, X, Mic, MicOff, Search, Loader2, Languages } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DB } from '@/lib/db';
import AnalysisResults, { AnalysisResult } from './AnalysisResults';

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'te', label: 'తెలుగు (Telugu)' }, { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' }, { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'mr', label: 'मराठी (Marathi)' }, { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' }, { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', label: 'اردو (Urdu)' },
];

export default function AnalysisTool() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [language, setLanguage] = useState('en');
  const [ageGroup, setAgeGroup] = useState('adult');
  const [location, setLocation] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages = Array.from(files).filter(f => f.type.startsWith('image/')).map(f => ({
      file: f, preview: URL.createObjectURL(f)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleVoice = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('Speech recognition not supported in this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-IN' : language + '-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setSymptoms(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const runAnalysis = useCallback(async () => {
    if (!symptoms.trim() && !images.length) { alert('Please describe symptoms or upload an image.'); return; }
    setIsAnalysing(true);
    setResult(null);

    // Simulate AI analysis with structured response
    await new Promise(r => setTimeout(r, 2500));

    const lang = LANGUAGES.find(l => l.code === language)?.label || 'English';
    
    // Generate a mock but realistic analysis result
    const mockResult: AnalysisResult = generateMockAnalysis(symptoms, ageGroup, location, lang);
    
    setResult(mockResult);
    setIsAnalysing(false);

    // Save to search history
    if (user) {
      DB.saveSearchHistory(user.mobile, {
        id: 'SH-' + Date.now(),
        query: symptoms || 'Image analysis',
        riskLevel: mockResult.risk_level,
        timestamp: new Date().toISOString(),
      });
    }
  }, [symptoms, images, language, ageGroup, location, user]);

  return (
    <section id="analyse" className="py-20 px-6 bg-navy2">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-3">AI Analysis</div>
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground">Describe your <em className="text-teal italic">symptoms</em></h2>
        <p className="text-sm text-mid mt-3 max-w-lg">Upload medical images, type or speak your symptoms for instant AI health assessment.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Input Panel */}
          <div className="bg-navy3 border border-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal" /> Input Panel
            </div>

            {/* Upload Zone */}
            <div
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/[0.02] transition"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
              onDragLeave={e => { e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); handleFiles(e.dataTransfer.files); }}
            >
              <div className="w-12 h-12 bg-teal-subtle rounded-xl flex items-center justify-center mx-auto mb-3">
                <Upload className="w-5 h-5 text-teal" />
              </div>
              <div className="text-sm font-medium text-foreground">Drop medical images here</div>
              <div className="text-xs text-muted-foreground mt-1">X-rays, scans, prescriptions, lab reports</div>
              <div className="flex flex-wrap gap-1 justify-center mt-3">
                {['JPG', 'PNG', 'WEBP'].map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-foreground/5 text-muted-foreground border border-border">{t}</span>
                ))}
              </div>
              <input ref={fileRef} type="file" className="hidden" accept="image/*" multiple onChange={e => handleFiles(e.target.files)} />
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img.preview} alt="upload" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-background/80 rounded-full flex items-center justify-center">
                      <X className="w-3 h-3 text-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-teal flex-shrink-0" />
              <select value={language} onChange={e => setLanguage(e.target.value)} className="flex-1 bg-accent border border-border rounded-md px-3 py-2 text-sm text-foreground outline-none focus:border-primary appearance-none">
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>

            {/* Symptoms Textarea */}
            <div className="relative">
              <textarea
                className="w-full bg-accent border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none min-h-[120px] placeholder:text-muted-foreground"
                placeholder="Describe your symptoms, paste lab results, or speak using the mic button..."
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                maxLength={2000}
              />
              <div className="flex items-center justify-between mt-1 px-1">
                <button onClick={toggleVoice} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition ${isRecording ? 'bg-destructive/20 text-destructive border border-destructive/30' : 'bg-teal-subtle text-teal border border-primary/30 hover:bg-primary/20'}`}>
                  {isRecording ? <><MicOff className="w-3 h-3" /> Stop Recording</> : <><Mic className="w-3 h-3" /> Voice Input</>}
                </button>
                <span className="text-[11px] text-muted-foreground">{symptoms.length} / 2000</span>
              </div>
            </div>

            {/* Age & Location */}
            <div className="grid grid-cols-2 gap-3">
              <select value={ageGroup} onChange={e => setAgeGroup(e.target.value)} className="bg-accent border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary appearance-none">
                <option value="child">Child (0-12)</option>
                <option value="teen">Teen (13-17)</option>
                <option value="adult">Adult (18-59)</option>
                <option value="senior">Senior (60+)</option>
              </select>
              <input value={location} onChange={e => setLocation(e.target.value)} className="bg-accent border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground" placeholder="City / Region" />
            </div>

            {/* Analyse Button */}
            <button
              onClick={runAnalysis}
              disabled={isAnalysing}
              className="bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all hover:shadow-[0_6px_24px_hsl(var(--teal)/0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalysing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing...</> : <><Search className="w-4 h-4" /> Analyse Symptoms</>}
            </button>
          </div>

          {/* Results Panel */}
          <AnalysisResults result={result} isLoading={isAnalysing} />
        </div>
      </div>
    </section>
  );
}

function generateMockAnalysis(symptoms: string, age: string, location: string, lang: string): AnalysisResult {
  const text = symptoms.toLowerCase();
  let riskLevel: 'safe' | 'at_risk' | 'critical' = 'safe';

  if (text.includes('chest pain') || text.includes('breathing') || text.includes('unconscious') || text.includes('blood')) {
    riskLevel = 'critical';
  } else if (text.includes('fever') || text.includes('cough') || text.includes('pain') || text.includes('infection')) {
    riskLevel = 'at_risk';
  }

  const results: Record<string, AnalysisResult> = {
    safe: {
      risk_level: 'safe',
      confidence: 88,
      conditions: [{ name: 'Common Cold / Mild Allergy', prob: 82, desc: 'Likely viral upper respiratory infection or seasonal allergies.' }],
      summary: 'Your symptoms suggest a mild condition that can be managed with over-the-counter medication and home care. No immediate medical attention needed.',
      emergency: null,
      advice: ['Stay hydrated with warm fluids', 'Get adequate rest for 2-3 days', 'Monitor symptoms — consult a doctor if they worsen'],
      medicines: [
        { name: 'Cetirizine 10mg', type: 'Antihistamine', dosage: '1 tablet daily', duration: '5 days', online: '1mg / Netmeds / PharmEasy', store: 'Any local pharmacy', usage: 'Relieves allergy symptoms like runny nose, sneezing, and itching by blocking histamine.' },
        { name: 'Paracetamol 500mg', type: 'Analgesic / Antipyretic', dosage: '1 tablet every 6hrs if needed', duration: 'As needed', online: 'Amazon Pharmacy / Tata 1mg', store: 'Available at all pharmacies', usage: 'Reduces fever and relieves mild pain by acting on the brain\'s heat-regulating centre.' },
      ],
      remedies: [
        { title: 'Steam Inhalation', desc: 'Inhale steam with a few drops of eucalyptus oil for 10 min, twice daily to clear nasal congestion.' },
        { title: 'Honey & Ginger Tea', desc: 'Mix 1 tsp honey + fresh ginger in warm water. Soothes throat and boosts immunity.' },
        { title: 'Turmeric Milk', desc: 'Warm milk with 1/2 tsp turmeric before bed. Anti-inflammatory and aids recovery.' },
      ],
      doctors: [],
    },
    at_risk: {
      risk_level: 'at_risk',
      confidence: 79,
      conditions: [
        { name: 'Upper Respiratory Infection', prob: 75, desc: 'Bacterial or viral infection requiring medical attention.' },
        { name: 'Viral Fever', prob: 60, desc: 'Possible viral infection causing persistent fever.' },
      ],
      summary: 'Your symptoms indicate a moderate health concern. Medical consultation is recommended. Prescription medication may be needed.',
      emergency: null,
      advice: ['Consult a physician within 24-48 hours', 'Keep track of body temperature', 'Avoid self-medicating with antibiotics', 'Stay isolated if symptoms suggest infection'],
      medicines: [
        { name: 'Azithromycin 500mg', type: 'Antibiotic (Rx)', dosage: '1 tablet daily', duration: '3 days', online: 'Requires prescription — 1mg / PharmEasy', store: 'Prescription pharmacy', usage: 'Fights bacterial infections by stopping bacterial protein synthesis. Effective for respiratory infections.' },
        { name: 'Montair LC', type: 'Anti-allergic + Bronchodilator', dosage: '1 tablet at night', duration: '7 days', online: 'Netmeds / Tata 1mg', store: 'Local pharmacy with Rx', usage: 'Combines montelukast and levocetirizine to reduce airway inflammation and allergy symptoms.' },
      ],
      remedies: [
        { title: 'Saltwater Gargle', desc: 'Gargle with warm salt water 3-4 times daily to reduce throat inflammation.' },
        { title: 'Tulsi & Black Pepper', desc: 'Boil 8-10 tulsi leaves with black pepper. Effective natural anti-infective.' },
      ],
      doctors: [
        { name: 'Rajesh Kumar', spec: 'General Physician', hosp: 'Apollo Hospitals', city: location || 'Hyderabad', rating: 4.7, reviews: 342, exp: 12, init: 'RK', why: 'Specialist in respiratory infections' },
        { name: 'Priya Sharma', spec: 'Pulmonologist', hosp: 'KIMS Hospital', city: location || 'Hyderabad', rating: 4.8, reviews: 218, exp: 15, init: 'PS', why: 'Expert in lung and breathing disorders' },
      ],
    },
    critical: {
      risk_level: 'critical',
      confidence: 91,
      conditions: [
        { name: 'Acute Cardiac Event', prob: 72, desc: 'Possible cardiac emergency requiring immediate attention.' },
        { name: 'Pulmonary Distress', prob: 65, desc: 'Severe respiratory compromise detected.' },
      ],
      summary: 'Your symptoms indicate a potentially life-threatening condition. Seek emergency medical care IMMEDIATELY. Do not delay.',
      emergency: 'Call 108 (Emergency) or go to nearest emergency room immediately. Do not drive yourself.',
      advice: ['Call emergency services (108) immediately', 'Do not exert yourself physically', 'Chew an aspirin 325mg if chest pain suspected', 'Keep someone with you at all times'],
      medicines: [
        { name: 'Aspirin 325mg', type: 'Emergency Antiplatelet', dosage: 'Chew 1 tablet immediately', duration: 'One-time emergency', online: 'Not applicable — use what\'s available', store: 'Any pharmacy — OTC', usage: 'Thins blood to prevent clot formation during suspected heart attack. Chew for faster absorption.' },
        { name: 'Sorbitrate 5mg', type: 'Nitrate (Emergency)', dosage: 'Sublingual as directed', duration: 'Emergency use', online: 'Prescription required', store: 'Hospital pharmacy', usage: 'Relaxes blood vessels to improve blood flow to the heart. Place under tongue for rapid relief.' },
      ],
      remedies: [
        { title: 'Stay Calm', desc: 'Sit upright in a comfortable position. Deep slow breaths. Panic worsens cardiac symptoms.' },
      ],
      doctors: [
        { name: 'Venkat Reddy', spec: 'Cardiologist', hosp: 'NIMS Hospital', city: location || 'Hyderabad', rating: 4.9, reviews: 520, exp: 22, init: 'VR', why: 'Senior cardiologist with emergency care expertise' },
        { name: 'Anjali Deshmukh', spec: 'Emergency Medicine', hosp: 'Yashoda Hospitals', city: location || 'Hyderabad', rating: 4.8, reviews: 380, exp: 18, init: 'AD', why: 'Emergency medicine specialist' },
        { name: 'Suresh Babu', spec: 'Interventional Cardiologist', hosp: 'Care Hospitals', city: location || 'Hyderabad', rating: 4.9, reviews: 450, exp: 20, init: 'SB', why: 'Expert in angioplasty and cardiac interventions' },
      ],
    },
  };

  return results[riskLevel];
}
