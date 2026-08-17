'use client';

import { useRef } from 'react';

const BLOBS = [
  {
    className:
      'size-[34rem] rounded-full bg-gradient-to-br from-primary/50 via-cyan-400/30 to-transparent blur-3xl -top-64 -left-40 animate-float',
  },
  {
    className:
      'size-[28rem] rounded-full bg-gradient-to-bl from-fuchsia-500/40 to-transparent blur-3xl top-1/4 -right-40 animate-float animation-delay-200',
  },
  {
    className:
      'size-[30rem] rounded-full bg-gradient-to-tr from-indigo-500/40 via-primary/20 to-transparent blur-3xl -bottom-56 left-1/4 animate-float animation-delay-300',
  },
];

export default function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--px', `${(x * 48).toFixed(1)}px`);
    el.style.setProperty('--py', `${(y * 48).toFixed(1)}px`);
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{ transform: 'translate(var(--px, 0px), var(--py, 0px))' }}
      >
        {BLOBS.map((blob, i) => (
          <div key={i} className={`pointer-events-none absolute ${blob.className}`} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
    </div>
  );
}