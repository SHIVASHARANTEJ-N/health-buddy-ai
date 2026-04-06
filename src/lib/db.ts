// localStorage-based DB for users, appointments, search history
export interface User {
  mobile: string;
  name: string;
  fname: string;
  lname: string;
  age: string;
  gender: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  doctor: string;
  spec: string;
  hosp: string;
  city: string;
  date: string;
  time: string;
  consultType: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  phone: string;
  reason: string;
  fee: number;
  createdAt: string;
}

export interface SearchHistory {
  id: string;
  query: string;
  riskLevel: string;
  timestamp: string;
}

export const DB = {
  getUsers(): Record<string, User> {
    try { return JSON.parse(localStorage.getItem('mw_users') || '{}'); } catch { return {}; }
  },
  saveUsers(u: Record<string, User>) {
    localStorage.setItem('mw_users', JSON.stringify(u));
  },
  getSession(): User | null {
    try { return JSON.parse(localStorage.getItem('mw_session') || 'null'); } catch { return null; }
  },
  saveSession(s: User) {
    localStorage.setItem('mw_session', JSON.stringify(s));
  },
  clearSession() {
    localStorage.removeItem('mw_session');
  },
  getAppointments(mobile: string): Appointment[] {
    try { return JSON.parse(localStorage.getItem('mw_appts_' + mobile) || '[]'); } catch { return []; }
  },
  saveAppointment(mobile: string, appt: Appointment) {
    const appts = DB.getAppointments(mobile);
    appts.unshift(appt);
    localStorage.setItem('mw_appts_' + mobile, JSON.stringify(appts));
  },
  getSearchHistory(mobile: string): SearchHistory[] {
    try { return JSON.parse(localStorage.getItem('mw_history_' + mobile) || '[]'); } catch { return []; }
  },
  saveSearchHistory(mobile: string, entry: SearchHistory) {
    const history = DB.getSearchHistory(mobile);
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem('mw_history_' + mobile, JSON.stringify(history));
  },
};
