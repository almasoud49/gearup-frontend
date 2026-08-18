'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  MapPinIcon,
  Mail01Icon,
  CallIcon,
  Facebook01Icon,
  InstagramIcon,
  TwitterIcon,
  Linkedin01Icon,
  Message01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import Header from '@/app/(public)/_components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { unsplashUrl } from '@/lib/images';

const INFO = [
  {
    icon: MapPinIcon,
    title: 'Visit us',
    lines: ['123 Adventure Lane', 'Sylhet, Bangladesh'],
  },
  {
    icon: Mail01Icon,
    title: 'Email us',
    lines: ['support@gearup.com', 'We reply within 24 hours'],
  },
  {
    icon: CallIcon,
    title: 'Call us',
    lines: ['+880 1700-000000', 'Mon–Sat, 9am – 6pm'],
  },
];

const SOCIALS = [
  { icon: Facebook01Icon, label: 'Facebook', href: 'https://facebook.com' },
  { icon: InstagramIcon, label: 'Instagram', href: 'https://instagram.com' },
  { icon: TwitterIcon, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin01Icon, label: 'LinkedIn', href: 'https://linkedin.com' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in your name, email and message.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent! We will get back to you soon.');
    }, 900);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative isolate overflow-hidden bg-indigo-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center bg-blend-multiply"
          style={{
            backgroundImage: `url("${unsplashUrl('photo-1502680390469-be75c86b636f', 2000)}")`,
            backgroundColor: '#1e1b4b',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-950/95 via-indigo-950/60 to-indigo-900/10" />
        <div className="animate-float pointer-events-none absolute left-1/2 top-10 -z-10 -translate-x-1/2 select-none whitespace-nowrap text-[18vw] font-extrabold uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.12)]">
          Contact
        </div>
        <div className="animate-float pointer-events-none absolute -left-24 bottom-0 -z-10 size-80 rounded-full bg-sky-400/40 blur-3xl mix-blend-screen" />
        <div className="pointer-events-none absolute -right-16 top-0 -z-10 size-72 rounded-full border border-white/15 mix-blend-soft-light blur-[2px]" />

        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            Contact
          </p>
          <h1 className="animate-fade-up animation-delay-100 mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            Let&apos;s talk gear
          </h1>
          <p className="animate-fade-up animation-delay-200 mx-auto mt-5 max-w-xl text-white/85">
            Questions about a rental, becoming a provider, or partnership? Drop us a line — we
            usually reply within a day.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {INFO.map((card, i) => (
            <div
              key={card.title}
              className="animate-fade-up flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary transition-all duration-300 group-hover:scale-110">
                <HugeiconsIcon icon={card.icon} className="size-5" strokeWidth={2} />
              </div>
              <div>
                <h3 className="font-semibold">{card.title}</h3>
                {card.lines.map((line, j) => (
                  <p
                    key={line}
                    className={j === 0 ? 'text-sm font-medium text-foreground/80' : 'text-sm text-muted-foreground'}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}

          <div className="animate-fade-up animation-delay-200 rounded-2xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold">Follow us</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">Stay close — deals drop often.</p>
            <div className="mt-3 flex gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground active:scale-90"
                >
                  <HugeiconsIcon icon={social.icon} className="size-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="animate-fade-in rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
        >
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mt-1 text-sm text-muted-foreground">We&apos;d love to hear from you.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={form.name}
                onChange={update('name')}
                className="transition-shadow focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={update('email')}
                className="transition-shadow focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="mt-5 space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="How can we help?"
              value={form.subject}
              onChange={update('subject')}
              className="transition-shadow focus-visible:ring-primary"
            />
          </div>

          <div className="mt-5 space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us the details…"
              value={form.message}
              onChange={update('message')}
              className="w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="group mt-6 w-full"
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Send message'}
            <HugeiconsIcon
              icon={Message01Icon}
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Button>
        </form>
      </section>
    </div>
  );
}