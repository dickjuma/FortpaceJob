import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import notify from '../../common/utils/notify';
import { validateContactForm } from '../../common/utils/validation';
import { useSiteSettings } from '../../common/hooks/useSiteSettings';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ContactPage() {
  const { data } = useSiteSettings();
  const company = data?.company || {};
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', phone: '' });
  const [sending, setSending] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateContactForm(form);
    const firstError = Object.values(fieldErrors)[0];
    if (firstError) {
      notify.error(firstError);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/cms/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || json.success === false) throw new Error(json.message || 'Failed to send');
      notify.success('Message sent. We will reply soon.');
      setForm({ name: '', email: '', subject: '', message: '', phone: '' });
    } catch (err) {
      notify.error(err.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#4C1D95] mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        <h1 className="text-3xl font-black text-zinc-900 mb-2">Contact us</h1>
        <p className="text-zinc-600 mb-6">
          Support, partnerships, or enterprise sales — we typically respond within one business day.
        </p>

        <a
          href={`mailto:${company.email || 'hello@fortespace.com'}`}
          className="inline-flex items-center gap-2 text-[#4C1D95] font-bold mb-10 hover:underline"
        >
          <Mail className="w-4 h-4" />
          {company.email || 'hello@fortespace.com'}
        </a>

        <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-zinc-200 p-6 md:p-8 shadow-sm space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Name</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full px-4 py-3 border border-zinc-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Email *</label>
              <input type="email" required name="email" value={form.email} onChange={onChange} className="w-full px-4 py-3 border border-zinc-200 rounded-xl" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Subject</label>
              <input name="subject" value={form.subject} onChange={onChange} className="w-full px-4 py-3 border border-zinc-200 rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} className="w-full px-4 py-3 border border-zinc-200 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Message *</label>
            <textarea required name="message" rows={5} value={form.message} onChange={onChange} className="w-full px-4 py-3 border border-zinc-200 rounded-xl resize-none" />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4C1D95] text-white font-bold rounded-xl hover:bg-[#22C55E] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </div>
  );
}


