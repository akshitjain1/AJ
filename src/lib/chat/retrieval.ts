// Picks the knowledge sections relevant to the current question.
// The knowledge base is small, so plain keyword scoring is enough. It keeps
// prompts short, which matters on free-tier token-per-minute limits.

import { knowledgeBase, tokenize, type KnowledgeBase, type KnowledgeChunk } from './knowledge';
import type { ChatTurn } from './types';

/** Phrases that pull in sections even without a keyword hit. */
const INTENT_BOOSTS: Array<{ pattern: RegExp; ids?: string[]; textMatch?: RegExp; boost: number }> = [
  { pattern: /\b(who is|introduce|introduction|about him|overview|summary|background)\b/i, ids: ['experience', 'skills'], boost: 4 },
  { pattern: /\b(fit|suitable|suitability|qualif|candidate|hire|hiring|role|position|job|why should)\b/i, ids: ['experience', 'skills', 'achievements', 'goals'], boost: 5 },
  { pattern: /\b(strong|strongest|best|most impressive|standout|top)\b/i, ids: ['skills', 'achievements'], boost: 3 },
  { pattern: /\b(ai|ml|machine learning|artificial intelligence|llm|agent|agentic|deep learning|nlp)\b/i, ids: ['experience'], boost: 2 },
  // Any project that mentions a hackathon, whatever it is called.
  { pattern: /\bhackathon/i, ids: ['achievements'], textMatch: /hackathon/i, boost: 6 },
  { pattern: /\b(resume|cv|curriculum vitae)\b/i, ids: ['education'], boost: 1 },
];

const MAX_DETAIL_CHUNKS = 4;
const MAX_DETAIL_CHARS = 6500;

function scoreChunk(chunk: KnowledgeChunk, tokens: string[]): number {
  let score = 0;
  for (const t of Array.from(new Set(tokens))) score += chunk.keywords.get(t) ?? 0;
  return score;
}

function scoreText(text: string, weight: number, chunks: KnowledgeChunk[], scores: Map<string, number>) {
  const tokens = tokenize(text);
  for (const chunk of chunks) {
    if (chunk.always) continue;
    let s = scoreChunk(chunk, tokens);
    for (const { pattern, ids, textMatch, boost } of INTENT_BOOSTS) {
      const applies = ids?.includes(chunk.id) || (textMatch && chunk.id.startsWith('project:') && textMatch.test(chunk.text));
      if (applies && pattern.test(text)) s += boost;
    }
    if (s > 0) scores.set(chunk.id, (scores.get(chunk.id) ?? 0) + s * weight);
  }
}

/**
 * Returns the knowledge text to send for this turn: the always-on profile
 * overview plus the highest-scoring detail sections.
 */
export function selectKnowledge(history: ChatTurn[], kb: KnowledgeBase = knowledgeBase): { text: string; ids: string[] } {
  const scores = new Map<string, number>();
  const current = history[history.length - 1]?.content ?? '';
  scoreText(current, 3, kb.chunks, scores);

  // Follow-ups ("which tech did it use?") rarely name the subject, so the
  // previous exchange is scored too, at a lower weight.
  const earlier = history.slice(0, -1).slice(-3);
  for (const turn of earlier) scoreText(turn.content, turn.role === 'user' ? 1.5 : 0.75, kb.chunks, scores);

  const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  const picked: KnowledgeChunk[] = kb.chunks.filter((c) => c.always);
  let budget = MAX_DETAIL_CHARS;
  for (const [id] of ranked) {
    if (picked.length - 1 >= MAX_DETAIL_CHUNKS) break;
    const chunk = kb.chunks.find((c) => c.id === id);
    if (!chunk || chunk.text.length > budget) continue;
    picked.push(chunk);
    budget -= chunk.text.length;
  }

  return {
    ids: picked.map((c) => c.id),
    text: picked.map((c) => `### ${c.title}\n${c.text}`).join('\n\n'),
  };
}
