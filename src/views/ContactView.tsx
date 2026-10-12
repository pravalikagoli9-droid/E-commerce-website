import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Private Olfactory Consultation');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please complete all inquiry fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        showToast('Your consultation request has been inscribed.', 'success');
      } else {
        showToast('Failed to dispatch inquiry.', 'error');
      }
    } catch {
      showToast('Connection error.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 border-b border-[#1C1C1C] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C5A880]">
          Private Consultation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-white">
          Contact The Atelier
        </h1>
        <p className="text-xs text-[#888] max-w-md mx-auto">
          Inquire regarding private bespoke formulations, corporate commissions, or private fitting appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[#0A0A0A] border border-[#1F1F1F] p-8 space-y-6">
          <h2 className="font-serif text-2xl text-white">Dispatch a Formal Inquiry</h2>

          {isSuccess ? (
            <div className="p-6 bg-[#121A14] border border-[#234A2E] text-[#86D49C] space-y-2 text-xs">
              <h3 className="font-serif text-lg text-white">Inquiry Received by Atelier Concierge</h3>
              <p>
                Your request has been routed to our senior curatorial staff. A discreet reply will be delivered to your email within one business day.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-3 text-white underline uppercase tracking-wider text-[11px]"
              >
                Send Another Inscription
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Montagu"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="julian@montagu.co.uk"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Subject of Consultation</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2B2B2B] px-3.5 py-2.5 text-white focus:outline-none focus:border-[#C5A880]"
                >
                  <option value="Private Olfactory Formulation">Private Bespoke Perfume Formulation</option>
                  <option value="Sartorial Fitting Appointment">Sartorial Wardrobe Private Fitting</option>
                  <option value="Order Tracking & White Glove Courier">Order Tracking & White Glove Courier</option>
                  <option value="Corporate & VIP Gifting">Corporate & VIP Gifting Suites</option>
                  <option value="Press & Archival Inquiries">Press & Curatorial Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-[#AAA] mb-1 uppercase tracking-wider">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your requirements or inquiry with complete precision..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-[#121212] border border-[#2B2B2B] px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#F0ECE8] hover:bg-white text-[#000000] text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Transmitting to Concierge...' : 'Inscribe Inquiry'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Atelier Physical Addresses */}
        <div className="lg:col-span-5 space-y-8 text-xs text-[#AAA]">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-8 space-y-6">
            <h3 className="font-serif text-xl text-white">Atelier Locations</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Paris Formulation Laboratory</p>
                  <p className="text-[#888]">18 Rue de la Paix, 75002 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Mumbai Flagship Sanctuary</p>
                  <p className="text-[#888]">The Heritage Wing, Apollo Bunder, Colaba, Mumbai 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Private Concierge Desk</p>
                  <p className="text-[#888] font-mono">concierge@elixirnoir.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Direct Telephone</p>
                  <p className="text-[#888] font-mono">+91 22 2840 9900</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Concierge Operating Hours</p>
                  <p className="text-[#888]">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
