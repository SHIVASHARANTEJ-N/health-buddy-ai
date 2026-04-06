import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, LogIn, UserPlus, ArrowLeft, Send } from 'lucide-react';
import { DB, User } from '@/lib/db';
import { useAuth } from '@/lib/auth-context';

type Step = 'choose' | 'login' | 'login-otp' | 'register' | 'register-otp';

export default function AuthScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState<Step>('choose');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const generateOTP = () => {
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    alert(`Your OTP is: ${code}`);
    return code;
  };

  const handleOtpChange = (idx: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[idx] = v;
    setOtp(newOtp);
    if (v && idx < 3) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleLoginSendOTP = () => {
    setError('');
    if (mobile.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    const users = DB.getUsers();
    if (!users[mobile]) { setError('No account found. Please register first.'); return; }
    generateOTP();
    setOtp(['', '', '', '']);
    setStep('login-otp');
  };

  const handleLoginVerify = () => {
    setError('');
    const entered = otp.join('');
    if (entered.length !== 4) { setError('Enter all 4 digits.'); return; }
    if (entered !== generatedOtp) { setError('Incorrect OTP.'); setOtp(['', '', '', '']); return; }
    const users = DB.getUsers();
    login(users[mobile]);
  };

  const handleRegisterSendOTP = () => {
    setError('');
    if (!fname.trim()) { setError('First name is required.'); return; }
    if (mobile.length !== 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    if (!age || Number(age) < 1 || Number(age) > 120) { setError('Enter valid age (1-120).'); return; }
    if (!gender) { setError('Please select gender.'); return; }
    const users = DB.getUsers();
    if (users[mobile]) { setError('Account already exists. Please sign in.'); return; }
    generateOTP();
    setOtp(['', '', '', '']);
    setStep('register-otp');
  };

  const handleRegisterVerify = () => {
    setError('');
    const entered = otp.join('');
    if (entered.length !== 4) { setError('Enter all 4 digits.'); return; }
    if (entered !== generatedOtp) { setError('Incorrect OTP.'); setOtp(['', '', '', '']); return; }
    const users = DB.getUsers();
    const newUser: User = {
      mobile, name: fname + (lname ? ' ' + lname : ''), fname, lname, age, gender,
      createdAt: new Date().toISOString()
    };
    users[mobile] = newUser;
    DB.saveUsers(users);
    login(newUser);
  };

  const inputClass = "w-full bg-secondary border border-border rounded-md px-3.5 py-3 font-body text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground";

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-teal-subtle rounded-2xl p-8 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/5 pointer-events-none" />

        <div className="flex items-center gap-2.5 mb-8 relative">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-2xl text-foreground">Medi<span className="text-teal">Wise</span></span>
        </div>

        <AnimatePresence mode="wait">
          {step === 'choose' && (
            <motion.div key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-2xl text-foreground mb-1">Welcome</h2>
              <p className="text-sm text-muted-foreground mb-8">Sign in or create an account for AI health analysis.</p>
              <button onClick={() => { setStep('login'); setError(''); setMobile(''); }} className="w-full bg-primary text-primary-foreground rounded-md py-3 font-body font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition mb-3">
                <LogIn className="w-4 h-4" /> Sign In with Mobile
              </button>
              <div className="flex items-center gap-3 my-4 text-muted-foreground text-xs"><div className="flex-1 h-px bg-border" />or<div className="flex-1 h-px bg-border" /></div>
              <button onClick={() => { setStep('register'); setError(''); setMobile(''); }} className="w-full bg-secondary text-foreground border border-border rounded-md py-3 font-body font-semibold flex items-center justify-center gap-2 hover:border-primary/30 transition">
                <UserPlus className="w-4 h-4" /> Create New Account
              </button>
            </motion.div>
          )}

          {step === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-2xl text-foreground mb-1">Sign In</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your registered mobile number.</p>
              <div className="relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 text-sm text-muted-foreground border-r border-border bg-secondary rounded-l-md min-w-[50px]">+91</div>
                <input className={inputClass + " pl-16"} type="tel" maxLength={10} placeholder="10-digit mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} />
              </div>
              {error && <p className="text-xs text-destructive mb-2">{error}</p>}
              <button onClick={handleLoginSendOTP} className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition mt-2">
                <Send className="w-4 h-4" /> Send OTP
              </button>
              <button onClick={() => { setStep('choose'); setError(''); }} className="mt-4 text-sm text-muted-foreground flex items-center gap-1 mx-auto hover:text-teal transition"><ArrowLeft className="w-3 h-3" /> Back</button>
            </motion.div>
          )}

          {step === 'login-otp' && (
            <motion.div key="login-otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-2xl text-foreground mb-1">Verify OTP</h2>
              <p className="text-sm text-muted-foreground mb-5">OTP sent to <span className="text-teal font-medium">+91 {mobile}</span></p>
              <div className="flex gap-3 justify-center mb-4">
                {otp.map((d, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el; }} className="w-14 h-16 bg-secondary border border-border rounded-md text-2xl font-semibold text-center text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" type="tel" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(e, i)} />
                ))}
              </div>
              {error && <p className="text-xs text-destructive text-center mb-2">{error}</p>}
              <button onClick={handleLoginVerify} className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold hover:opacity-90 transition">Verify & Sign In</button>
              <button onClick={() => { setStep('login'); setError(''); }} className="mt-4 text-sm text-muted-foreground flex items-center gap-1 mx-auto hover:text-teal transition"><ArrowLeft className="w-3 h-3" /> Change Number</button>
            </motion.div>
          )}

          {step === 'register' && (
            <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-2xl text-foreground mb-1">Create Account</h2>
              <p className="text-sm text-muted-foreground mb-5">One account per mobile number.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputClass} placeholder="First name" value={fname} onChange={e => setFname(e.target.value)} />
                <input className={inputClass} placeholder="Last name" value={lname} onChange={e => setLname(e.target.value)} />
              </div>
              <div className="relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center px-3 text-sm text-muted-foreground border-r border-border bg-secondary rounded-l-md min-w-[50px]">+91</div>
                <input className={inputClass + " pl-16"} type="tel" maxLength={10} placeholder="Mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputClass} type="number" min={1} max={120} placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                <select className={inputClass + " appearance-none"} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Gender</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              {error && <p className="text-xs text-destructive mb-2">{error}</p>}
              <button onClick={handleRegisterSendOTP} className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold hover:opacity-90 transition mt-1">Send OTP to Verify</button>
              <button onClick={() => { setStep('choose'); setError(''); }} className="mt-4 text-sm text-muted-foreground flex items-center gap-1 mx-auto hover:text-teal transition"><ArrowLeft className="w-3 h-3" /> Back</button>
            </motion.div>
          )}

          {step === 'register-otp' && (
            <motion.div key="register-otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="font-heading text-2xl text-foreground mb-1">Verify Number</h2>
              <p className="text-sm text-muted-foreground mb-5">OTP sent to <span className="text-teal font-medium">+91 {mobile}</span></p>
              <div className="flex gap-3 justify-center mb-4">
                {otp.map((d, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el; }} className="w-14 h-16 bg-secondary border border-border rounded-md text-2xl font-semibold text-center text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" type="tel" maxLength={1} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(e, i)} />
                ))}
              </div>
              {error && <p className="text-xs text-destructive text-center mb-2">{error}</p>}
              <button onClick={handleRegisterVerify} className="w-full bg-primary text-primary-foreground rounded-md py-3 font-semibold hover:opacity-90 transition">Create Account</button>
              <button onClick={() => { setStep('register'); setError(''); }} className="mt-4 text-sm text-muted-foreground flex items-center gap-1 mx-auto hover:text-teal transition"><ArrowLeft className="w-3 h-3" /> Edit Details</button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
