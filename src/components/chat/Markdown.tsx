'use client';

import { Fragment, type ReactNode } from 'react';

// A deliberately small Markdown renderer for assistant replies. It builds
// React elements (never raw HTML), so model output cannot inject markup or
// scripts. Supported: headings, paragraphs, bullet/numbered lists, bold,
// italics, inline code, code blocks, Markdown links, and bare URLs.

const SAFE_HREF = /^(https?:\/\/|mailto:|\/(?!\/)|#)/i;

const INLINE =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\[[^\]\n]+\]\([^)\s]+\))|((?:https?:\/\/|mailto:)[^\s<>()]*[^\s<>().,;:!?'"])|(\*[^*\s][^*\n]*\*)|(\b_[^_\n]+_\b)/g;

function Link({ href, children }: { href: string; children: ReactNode }) {
  if (!SAFE_HREF.test(href)) return <>{children}</>;
  const external = /^https?:\/\//i.test(href) || /\.pdf$/i.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800 hover:decoration-indigo-600 break-words"
    >
      {children}
    </a>
  );
}

function renderInline(text: string, key = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  const re = new RegExp(INLINE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const idx = m.index;
    if (idx > last) out.push(text.slice(last, idx));
    const k = `${key}-${n++}`;
    const [token, code, bold, mdLink, bare, italic, underscore] = m;
    if (code) {
      out.push(
        <code key={k} className="rounded bg-zinc-200/70 px-1 py-0.5 font-mono text-[0.85em] text-zinc-800">
          {code.slice(1, -1)}
        </code>,
      );
    } else if (bold) {
      out.push(
        <strong key={k} className="font-semibold text-zinc-900">
          {renderInline(bold.slice(2, -2), k)}
        </strong>,
      );
    } else if (mdLink) {
      const split = mdLink.lastIndexOf('](');
      out.push(
        <Link key={k} href={mdLink.slice(split + 2, -1)}>
          {renderInline(mdLink.slice(1, split), k)}
        </Link>,
      );
    } else if (bare) {
      out.push(
        <Link key={k} href={bare}>
          {bare.replace(/^mailto:/i, '')}
        </Link>,
      );
    } else if (italic || underscore) {
      out.push(<em key={k}>{renderInline((italic || underscore).slice(1, -1), k)}</em>);
    } else {
      out.push(token);
    }
    last = idx + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul' | 'ol'; items: { text: string; indent: boolean }[] }
  | { type: 'code'; text: string };

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: 'p', text: para.join(' ') });
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      flush();
      const code: string[] = [];
      while (++i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i]);
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }
    const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
    const bullet = line.match(/^(\s*)[-*•]\s+(.*)$/);
    const numbered = line.match(/^(\s*)\d+[.)]\s+(.*)$/);
    if (heading) {
      flush();
      blocks.push({ type: 'h', text: heading[1].replace(/\*\*/g, '') });
    } else if (bullet || numbered) {
      flush();
      const type = bullet ? 'ul' : 'ol';
      const [, indent, text] = (bullet ?? numbered)!;
      const prev = blocks[blocks.length - 1];
      const item = { text, indent: indent.length >= 2 };
      if (prev && prev.type === type) prev.items.push(item);
      else if (prev && (prev.type === 'ul' || prev.type === 'ol') && item.indent) prev.items.push(item);
      else blocks.push({ type, items: [item] });
    } else if (!line.trim()) {
      flush();
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return blocks;
}

export default function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case 'h':
            return (
              <p key={key} className="pt-1 font-display text-[15px] font-bold uppercase tracking-tight text-zinc-900">
                {renderInline(b.text, key)}
              </p>
            );
          case 'ul':
          case 'ol': {
            const List = b.type;
            return (
              <List key={key} className={`space-y-1.5 pl-5 ${b.type === 'ul' ? 'list-disc' : 'list-decimal'} marker:text-zinc-400`}>
                {b.items.map((item, j) => (
                  <li key={`${key}-${j}`} className={item.indent ? 'ml-4 list-[circle]' : undefined}>
                    {renderInline(item.text, `${key}-${j}`)}
                  </li>
                ))}
              </List>
            );
          }
          case 'code':
            return (
              <pre key={key} className="overflow-x-auto rounded-xl bg-zinc-900 p-3 font-mono text-xs text-zinc-100">
                <code>{b.text}</code>
              </pre>
            );
          default:
            return <p key={key}>{renderInline(b.text, key).map((n, j) => <Fragment key={j}>{n}</Fragment>)}</p>;
        }
      })}
    </div>
  );
}
