import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MSG: Message = {
  role: 'assistant',
  content: "Hello! I'm MediWise AI assistant. I can help with:\n\n• Medicine information & prescriptions\n• Symptom guidance\n• Home remedies\n• Doctor recommendations\n\nHow can I help you today?"
};

// Simple local response generation
function generateResponse(input: string): string {
  const text = input.toLowerCase();

  if (text.includes('headache') || text.includes('head pain')) {
    return "For headaches, you can try:\n\n**Paracetamol 500mg** — Take 1 tablet every 6 hours as needed.\n💊 *Reduces pain by acting on the brain's pain-processing centre.*\n\n**Home Remedies:**\n🌿 Apply peppermint oil to temples\n🌿 Stay hydrated, drink plenty of water\n🌿 Rest in a dark, quiet room\n\n⚠️ If headaches are severe, persistent, or accompanied by vision changes, please consult a doctor immediately.";
  }
  if (text.includes('fever') || text.includes('temperature')) {
    return "For fever management:\n\n**Paracetamol 500mg** — 1 tablet every 6 hours (max 4/day)\n💊 *Lowers body temperature by acting on the hypothalamus.*\n\n**Home Remedies:**\n🌿 Sponge bath with lukewarm water\n🌿 Drink tulsi (holy basil) tea with honey\n🌿 Stay hydrated with ORS or coconut water\n\n⚠️ Seek medical help if fever exceeds 103°F or persists beyond 3 days.";
  }
  if (text.includes('cold') || text.includes('cough') || text.includes('sneezing')) {
    return "For cold & cough:\n\n**Cetirizine 10mg** — 1 tablet daily for sneezing/runny nose\n💊 *Blocks histamine to reduce allergy & cold symptoms.*\n\n**Honey Ginger tea** — Natural cough suppressant\n🌿 Boil ginger in water, add honey and lemon\n🌿 Steam inhalation with eucalyptus oil\n🌿 Turmeric milk before bed\n\n📍 Available at: Any local pharmacy, 1mg, Netmeds";
  }
  if (text.includes('stomach') || text.includes('digestion') || text.includes('acidity')) {
    return "For stomach issues:\n\n**Pantoprazole 40mg** — 1 tablet before breakfast\n💊 *Reduces stomach acid production for relief from acidity and heartburn.*\n\n**Home Remedies:**\n🌿 Drink cold buttermilk with cumin\n🌿 Chew fennel seeds after meals\n🌿 Banana helps coat the stomach lining\n\n📍 Available at: All pharmacies, PharmEasy, Tata 1mg";
  }
  if (text.includes('medicine') || text.includes('drug') || text.includes('tablet')) {
    return "I can help with medicine information! Please tell me:\n\n1. What specific medicine are you asking about?\n2. Or describe your symptoms and I'll suggest appropriate medication.\n\n⚠️ Always consult a doctor before starting any new medication.";
  }
  if (text.includes('doctor') || text.includes('specialist') || text.includes('hospital')) {
    return "To find the right doctor:\n\n1. Go to the **Book Doctor** section above\n2. Select a specialist based on your condition\n3. Choose a convenient date and time\n\nFor emergencies, call **108** (Ambulance) or **112** (Emergency).";
  }

  return "Thank you for your question. Based on what you've described, I'd recommend:\n\n1. **Describe your symptoms in detail** in the Analysis section for a thorough assessment\n2. Include any relevant medical history\n3. Upload any reports or images if available\n\nI'm here to help with general health guidance. For specific medical advice, please consult a qualified healthcare professional.\n\nIs there anything specific I can help you with?";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const chatEnd = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));

    const response = generateResponse(userMsg.content);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const toggleVoice = () => {
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const r = new SR();
    r.lang = 'en-IN'; r.continuous = false; r.interimResults = true;
    r.onresult = (e: any) => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; setInput(t); };
    r.onend = () => setIsRecording(false);
    r.start();
    recognitionRef.current = r;
    setIsRecording(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-navy2 px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center"><Bot className="w-4 h-4 text-teal" /></div>
                <div><div className="text-sm font-semibold text-foreground">MediWise AI</div><div className="text-[10px] text-teal">Online • Ask anything</div></div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition"><X className="w-4 h-4" /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-1"><Bot className="w-3 h-3 text-teal" /></div>}
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-foreground rounded-bl-md'}`}>
                    {m.content}
                  </div>
                  {m.role === 'user' && <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1"><User className="w-3 h-3 text-primary-foreground" /></div>}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center"><Bot className="w-3 h-3 text-teal" /></div>
                  <div className="bg-secondary rounded-xl px-4 py-3 text-sm text-muted-foreground">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex items-center gap-2">
              <button onClick={toggleVoice} className={`p-2 rounded-lg transition ${isRecording ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
                placeholder="Ask about medicines, symptoms..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} disabled={!input.trim()} className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_8px_30px_hsl(var(--teal)/0.4)] hover:-translate-y-1 transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </>
  );
}
