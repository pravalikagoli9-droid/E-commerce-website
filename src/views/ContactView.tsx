import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

export const ContactView: React.FC = () => {
  const { showToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Personal Fragrance Consultation');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Please fill out all inquiry fields.', 'error');
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
        showToast('Your consultation request has been sent.', 'success');
      } else {
        showToast('Failed to send inquiry. Please try again.', 'error');
      }
    } catch {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center space-y-3 border-b border-[#E8DED4] pb-8">
        <span className="text-xs tracking-[0.25em] uppercase text-[#C9878D] font-semibold">
          Personal Consultation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#392C2A]">
          Contact Our Concierge
        </h1>
        <p className="text-xs text-[#7D6B67] max-w-md mx-auto">
          Inquire regarding personalized fragrance consultations, custom orders, or product inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E8DED4] p-8 space-y-6 rounded-sm shadow-xs">
          <h2 className="font-serif text-2xl text-[#392C2A]">Send an Inquiry</h2>

          {isSuccess ? (
            <div className="p-6 bg-[#FAF7F2] border border-[#3E7B54] text-[#3E7B54] space-y-2 text-xs rounded-sm">
              <h3 className="font-serif text-lg text-[#392C2A] font-semibold">Inquiry Received by Customer Care</h3>
              <p className="text-[#7D6B67]">
                Your request has been routed to our concierge team. A response will be sent to your email within one business day.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-3 text-[#C9878D] hover:text-[#B56F75] underline uppercase tracking-wider text-[11px] font-semibold cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julian Montagu"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="julian@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Subject of Consultation</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] focus:outline-none focus:border-[#C9878D] rounded-sm"
                >
                  <option value="Personal Fragrance Consultation">Personal Fragrance Consultation</option>
                  <option value="Sartorial Fitting Appointment">Apparel & Sizing Inquiry</option>
                  <option value="Order Tracking & Shipping">Order Tracking & Shipping Support</option>
                  <option value="Corporate & VIP Gifting">Corporate & Event Gifting</option>
                  <option value="Press & Media Inquiries">Press & Media Inquiries</option>
                </select>
              </div>

              <div>
                <label className="block text-[#7D6B67] mb-1 uppercase tracking-wider font-semibold">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details regarding your request or specific requirements..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E8DED4] px-3.5 py-2.5 text-[#392C2A] placeholder-[#998] focus:outline-none focus:border-[#C9878D] rounded-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C9878D] hover:bg-[#B56F75] text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center justify-center gap-2 rounded-sm shadow-md"
              >
                <span>{isSubmitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Right: Contact Information */}
        <div className="lg:col-span-5 space-y-8 text-xs text-[#7D6B67]">
          <div className="bg-[#FFFDF9] border border-[#E8DED4] p-8 space-y-6 rounded-sm shadow-xs">
            <h3 className="font-serif text-xl text-[#392C2A]">Boutique Locations</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#392C2A] font-semibold">Paris Formulation Studio</p>
                  <p className="text-[#7D6B67]">18 Rue de la Paix, 75002 Paris, France</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#392C2A] font-semibold">Mumbai Flagship Boutique</p>
                  <p className="text-[#7D6B67]">The Heritage Wing, Apollo Bunder, Colaba, Mumbai 400001</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#392C2A] font-semibold">Concierge Email</p>
                  <p className="text-[#7D6B67] font-mono">concierge@elixirnoir.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#392C2A] font-semibold">Telephone Customer Support</p>
                  <p className="text-[#7D6B67] font-mono">+91 22 2840 9900</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C9878D] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#392C2A] font-semibold">Operating Hours</p>
                  <p className="text-[#7D6B67]">Monday – Saturday: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
