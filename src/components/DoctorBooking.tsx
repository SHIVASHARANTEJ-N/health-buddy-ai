import { useState } from 'react';
import { CalendarDays, Check } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DB } from '@/lib/db';
import { toast } from 'sonner';

const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({ day: d.toLocaleDateString('en', { weekday: 'short' }), date: d.getDate(), full: d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }) });
  }
  return dates;
};

const SLOTS = ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '5:00 PM'];

const DOCTORS = [
  { name: 'Rajesh Kumar', spec: 'General Physician', hosp: 'Apollo Hospitals', city: 'Hyderabad', rating: 4.7, exp: 12, init: 'RK' },
  { name: 'Priya Sharma', spec: 'Dermatologist', hosp: 'KIMS Hospital', city: 'Hyderabad', rating: 4.8, exp: 15, init: 'PS' },
  { name: 'Venkat Reddy', spec: 'Cardiologist', hosp: 'NIMS Hospital', city: 'Hyderabad', rating: 4.9, exp: 22, init: 'VR' },
  { name: 'Anjali Deshmukh', spec: 'Pulmonologist', hosp: 'Yashoda Hospitals', city: 'Hyderabad', rating: 4.8, exp: 18, init: 'AD' },
];

export default function DoctorBooking() {
  const { user } = useAuth();
  const dates = generateDates();
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [consultType, setConsultType] = useState<'inperson' | 'video'>('inperson');
  const [patientName, setPatientName] = useState(user?.name || '');
  const [patientAge, setPatientAge] = useState(user?.age || '');
  const [patientGender, setPatientGender] = useState(user?.gender || '');
  const [phone, setPhone] = useState(user ? '+91 ' + user.mobile : '');
  const [reason, setReason] = useState('');
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const fee = consultType === 'inperson' ? 500 : 350;

  const handleBook = () => {
    if (!selectedSlot) { toast.error('Please select a time slot'); return; }
    if (!patientName.trim()) { toast.error('Patient name is required'); return; }

    const id = 'APT-' + Date.now().toString().slice(-6);
    setBookingId(id);

    if (user) {
      DB.saveAppointment(user.mobile, {
        id, doctor: DOCTORS[selectedDoc].name, spec: DOCTORS[selectedDoc].spec,
        hosp: DOCTORS[selectedDoc].hosp, city: DOCTORS[selectedDoc].city,
        date: dates[selectedDate].full, time: selectedSlot, consultType,
        patientName, patientAge, patientGender, phone, reason, fee,
        createdAt: new Date().toISOString(),
      });
    }
    setBooked(true);
    toast.success('Appointment booked successfully!');
  };

  const inputClass = "w-full bg-accent border border-border rounded-md px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground";

  if (booked) {
    return (
      <section id="book" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-teal-subtle border-2 border-primary flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-teal" />
          </div>
          <h2 className="font-heading text-3xl text-foreground mb-2">Appointment Confirmed!</h2>
          <p className="text-sm text-mid mb-4">Your appointment has been booked successfully.</p>
          <span className="inline-block bg-teal-subtle text-teal border border-primary/30 px-4 py-1 rounded-full text-sm font-semibold mb-6">{bookingId}</span>
          <div className="bg-navy3 rounded-xl p-5 text-left space-y-2 text-sm">
            <div className="flex justify-between text-mid"><span>Doctor</span><span className="text-foreground font-medium">Dr. {DOCTORS[selectedDoc].name}</span></div>
            <div className="flex justify-between text-mid"><span>Date</span><span className="text-foreground font-medium">{dates[selectedDate].full}</span></div>
            <div className="flex justify-between text-mid"><span>Time</span><span className="text-foreground font-medium">{selectedSlot}</span></div>
            <div className="flex justify-between text-mid"><span>Type</span><span className="text-foreground font-medium capitalize">{consultType}</span></div>
            <div className="flex justify-between text-mid border-t border-border pt-2 mt-2"><span className="font-semibold">Total</span><span className="text-foreground font-semibold">₹{fee}</span></div>
          </div>
          <button onClick={() => setBooked(false)} className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition">Done</button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-xs text-teal uppercase tracking-widest font-semibold mb-3">Book Appointment</div>
        <h2 className="font-heading text-3xl sm:text-4xl text-foreground">Find the right <em className="text-teal italic">specialist</em></h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          {/* Doctor List */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">Select a specialist and book your appointment.</p>
            {DOCTORS.map((d, i) => (
              <div key={d.name} onClick={() => setSelectedDoc(i)} className={`bg-navy2 border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition ${selectedDoc === i ? 'border-primary bg-primary/[0.04]' : 'border-border hover:border-primary/30'}`}>
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-teal">{d.init}</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">Dr. {d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.spec} · {d.exp} yrs · {d.hosp}</div>
                  <div className="text-xs text-amber mt-1">{'★'.repeat(Math.round(d.rating))} <span className="text-muted-foreground">{d.rating}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Booking Form */}
          <div className="bg-navy3 border border-border rounded-2xl p-6 space-y-4">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2 pb-3 border-b border-border">
              <CalendarDays className="w-4 h-4 text-teal" /> Appointment Details
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Select date</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dates.map((d, i) => (
                  <button key={i} onClick={() => setSelectedDate(i)} className={`flex-shrink-0 px-4 py-2.5 border rounded-lg text-center transition min-w-[56px] ${selectedDate === i ? 'border-primary bg-primary/10 text-teal' : 'border-border bg-accent text-mid hover:border-primary/30'}`}>
                    <div className="text-[10px] tracking-wide">{d.day}</div>
                    <div className="text-base font-semibold">{d.date}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Select time slot</label>
              <div className="grid grid-cols-3 gap-1.5">
                {SLOTS.map(s => (
                  <button key={s} onClick={() => setSelectedSlot(s)} className={`py-2 border rounded-md text-xs transition ${selectedSlot === s ? 'border-primary bg-primary/10 text-teal font-semibold' : 'border-border bg-accent text-mid hover:border-primary/30'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground font-medium mb-2 block">Consultation type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['inperson', 'video'] as const).map(t => (
                  <button key={t} onClick={() => setConsultType(t)} className={`border rounded-lg py-3 text-center transition ${consultType === t ? 'border-primary bg-primary/[0.06]' : 'border-border bg-accent hover:border-primary/30'}`}>
                    <div className={`text-sm font-semibold ${consultType === t ? 'text-teal' : 'text-foreground'}`}>{t === 'inperson' ? 'In-Person' : 'Video Call'}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">₹{t === 'inperson' ? 500 : 350}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground font-medium mb-1 block">Full name</label><input className={inputClass} value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Patient name" /></div>
              <div><label className="text-xs text-muted-foreground font-medium mb-1 block">Age</label><input className={inputClass} type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} placeholder="Age" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground font-medium mb-1 block">Phone</label><input className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" /></div>
              <div><label className="text-xs text-muted-foreground font-medium mb-1 block">Gender</label>
                <select className={inputClass + " appearance-none"} value={patientGender} onChange={e => setPatientGender(e.target.value)}>
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div><label className="text-xs text-muted-foreground font-medium mb-1 block">Reason for visit</label><textarea className={inputClass + " resize-none min-h-[60px]"} value={reason} onChange={e => setReason(e.target.value)} placeholder="Symptoms or reason..." /></div>

            <div className="bg-accent border border-border rounded-lg p-3.5 text-sm">
              <div className="flex justify-between text-mid"><span>Consultation fee</span><span>₹{fee}</span></div>
              <div className="flex justify-between text-muted-foreground text-xs mt-1"><span>Booking fee</span><span>₹0 (Free)</span></div>
              <div className="flex justify-between text-foreground font-semibold border-t border-border mt-2 pt-2"><span>Total</span><span>₹{fee}</span></div>
            </div>

            <button onClick={handleBook} className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all hover:shadow-[0_6px_24px_hsl(var(--teal)/0.25)]">
              <CalendarDays className="w-4 h-4" /> Confirm Appointment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
