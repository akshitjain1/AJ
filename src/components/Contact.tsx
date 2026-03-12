'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, ArrowUpRight, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { personal } from '@/data/portfolio';

const headReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Construct mailto link as a simple fallback (no backend required)
    const subject = encodeURIComponent(form.subject || 'Portfolio Contact');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.open(`mailto:${personal.email}?subject=${subject}&body=${body}`);
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          variants={headReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20"
        >
          <div>
            <motion.p variants={headItem} className="section-label mb-3">10 — Contact</motion.p>
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              LET&apos;S WORK
              <br />
              TOGETHER
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            Let&apos;s build something impactful together — whether it&apos;s an ML model, a web app, or your next big idea.
          </motion.p>
        </motion.div>

        {/* Two-column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:gap-16">
          {/* Left — Form */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            onSubmit={handleSubmit}
            className="bg-white border border-zinc-200 rounded-2xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                Subject
              </label>
              <select
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select a topic...</option>
                <option value="Machine Learning Project">Machine Learning Project</option>
                <option value="Web Development">Web Development</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Internship / Job Opportunity">Internship / Job Opportunity</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell me about your project or what you need help with..."
                className="form-input resize-none"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={status === 'sending' || status === 'sent'}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white font-semibold text-sm px-6 py-4 rounded-xl hover:bg-zinc-800 transition-all shadow-md hover:shadow-[0_8px_30px_-8px_rgba(10,10,10,0.4)] focus:ring-4 focus:ring-zinc-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'idle' && (
                <>
                  <Send size={14} />
                  Send Message
                </>
              )}
              {status === 'sending' && (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </>
              )}
              {status === 'sent' && (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Message Sent!
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Right — Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Contact cards */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-5">
                Contact Details
              </p>
              <div className="flex flex-col gap-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                    <Mail size={14} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Email</p>
                    <p className="text-sm font-medium text-zinc-800 hover-underline">{personal.email}</p>
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-600 ml-auto transition-colors" />
                </a>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center">
                    <MapPin size={14} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Location</p>
                    <p className="text-sm font-medium text-zinc-800">{personal.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-5">
                Social Links
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: Github, label: 'GitHub', href: personal.social.github, handle: '@akshitjain1', hover: 'hover-twitter' },
                  { icon: Linkedin, label: 'LinkedIn', href: personal.social.linkedin, handle: 'Akshit Jain', hover: 'hover-linkedin' },
                  { icon: Twitter, label: 'Twitter', href: personal.social.twitter, handle: '@akshitjain', hover: 'hover-twitter' },
                  { icon: Instagram, label: 'Instagram', href: personal.social.instagram, handle: '@akshitjain__1', hover: 'hover-instagram' },
                ].map(({ icon: Icon, label, href, handle, hover }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 group transition-all p-1 rounded-lg ${hover}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                      <Icon size={13} className="text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-400">{label}</span>
                      <p className="text-sm font-medium text-zinc-700 group-hover:text-inherit">{handle}</p>
                    </div>
                    <ArrowUpRight size={12} className="text-zinc-300 group-hover:text-inherit ml-auto transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="border border-emerald-200 rounded-2xl p-6 bg-emerald-50 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <p className="text-sm font-semibold text-emerald-800">Available for opportunities</p>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Open to internships, collaborations, and full-time roles in ML engineering and software development.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
