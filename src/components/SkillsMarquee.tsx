'use client';

import { skillsMarquee } from '@/data/portfolio';

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div
        className={`flex gap-6 items-center whitespace-nowrap ${
          reverse ? 'marquee-track-reverse' : 'marquee-track'
        }`}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="font-display font-bold text-xl md:text-2xl uppercase tracking-wide text-zinc-800">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SkillsMarquee() {
  const half = Math.ceil(skillsMarquee.length / 2);
  const row1 = skillsMarquee.slice(0, half);
  const row2 = skillsMarquee.slice(half);

  return (
    <section className="py-12 md:py-16 border-y border-zinc-200 overflow-hidden bg-zinc-50">
      <MarqueeRow items={row1} />
      <MarqueeRow items={row2} reverse />
    </section>
  );
}
