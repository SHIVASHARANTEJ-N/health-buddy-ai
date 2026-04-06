import { Activity, LogOut, Menu, X, Droplet } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user ? ((user.fname?.[0] || '') + (user.lname?.[0] || '')).toUpperCase() : '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Activity className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-xl text-foreground">Medi<span className="text-teal">Wise</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-mid hover:text-foreground transition font-medium">Features</a>
        <a href="#analyse" className="text-sm text-mid hover:text-foreground transition font-medium">Analysis</a>
        <a href="#book" className="text-sm text-mid hover:text-foreground transition font-medium">Book Doctor</a>
        <a href="https://www.friends2support.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-mid hover:text-destructive transition font-medium flex items-center gap-1">
          <Droplet className="w-3.5 h-3.5" /> Blood Bank
        </a>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 bg-secondary border border-border rounded-full px-2.5 py-1.5 cursor-pointer hover:border-primary/30 transition" onClick={() => { if (confirm('Sign out of MediWise?')) logout(); }}>
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">{initials}</div>
            <span className="text-xs text-mid max-w-[80px] truncate hidden sm:inline">{user.fname}</span>
            <LogOut className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5 text-mid" /> : <Menu className="w-5 h-5 text-mid" />}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-xl border-b border-border flex flex-col p-4 gap-3 md:hidden">
          <a href="#features" className="text-sm text-mid py-2" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#analyse" className="text-sm text-mid py-2" onClick={() => setMenuOpen(false)}>Analysis</a>
          <a href="#book" className="text-sm text-mid py-2" onClick={() => setMenuOpen(false)}>Book Doctor</a>
          <a href="https://www.friends2support.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-destructive py-2 flex items-center gap-1" onClick={() => setMenuOpen(false)}>
            <Droplet className="w-3.5 h-3.5" /> Blood Requirement
          </a>
        </div>
      )}
    </nav>
  );
}
