// Proves the assistant stays in sync with the portfolio data automatically.
// Each test edits a *copy* of src/data/portfolio.ts (a fixture), rebuilds the
// knowledge base the same way the deployed route does, and checks the result.
// The real portfolio data is never modified.
// Run with: npm run test:chat

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import * as portfolio from '../src/data/portfolio';
import { createKnowledgeBase, knowledgeBase, type PortfolioData } from '../src/lib/chat/knowledge';
import { selectKnowledge } from '../src/lib/chat/retrieval';
import { sanitizeReply } from '../src/lib/chat/guard';

const fixture = (): PortfolioData => structuredClone({ ...portfolio }) as PortfolioData;
const ask = (q: string, data: PortfolioData) => selectKnowledge([{ role: 'user', content: q }], createKnowledgeBase(data));
const allText = (data: PortfolioData) => createKnowledgeBase(data).chunks.map((c) => c.text).join('\n');

describe('automatic sync with portfolio data', () => {
  test('1. a newly added project is retrievable by name, with its description and links', () => {
    const data = fixture();
    data.projects.push({
      title: 'Zephyr Fixture Forecaster',
      subtitle: 'Test fixture project',
      description: 'A temporary fixture project that forecasts fixture weather using gradient boosting.',
      category: 'Machine Learning',
      tags: ['Python', 'XGBoost'],
      github: 'https://github.com/akshitjain1/zephyr-fixture',
      demo: 'https://zephyr-fixture.example.app/',
      featured: false,
    });
    const r = ask('Tell me about the Zephyr Forecaster project', data);
    assert.ok(r.ids.includes('project:zephyr-fixture-forecaster'), r.ids.join());
    assert.match(r.text, /forecasts fixture weather using gradient boosting/);
    assert.match(r.text, /https:\/\/github\.com\/akshitjain1\/zephyr-fixture/);

    const kb = createKnowledgeBase(data);
    const out = sanitizeReply('Repo: [code](https://github.com/akshitjain1/zephyr-fixture)', [], kb);
    assert.ok(out?.includes('(https://github.com/akshitjain1/zephyr-fixture)'), 'new repo link is allowed');
    assert.ok(!knowledgeBase.allowedLinks.has('https://github.com/akshitjain1/zephyr-fixture'), 'real data untouched');
  });

  test('1b. a project added with generic category gets generic search terms (no per-project hints)', () => {
    const data = fixture();
    data.projects.push({
      title: 'Orchid Fixture Assistant',
      subtitle: 'LLM helper',
      description: 'Fixture.',
      category: 'Machine Learning',
      tags: ['Gemini API'],
      github: '',
      demo: '',
    });
    const chunk = createKnowledgeBase(data).chunks.find((c) => c.id === 'project:orchid-fixture-assistant')!;
    for (const term of ['ai', 'llm', 'ml']) assert.ok(chunk.keywords.has(term), `derived term "${term}"`);
    // Broad questions always see it in the project index, even when other projects take the detail slots.
    assert.match(ask('What AI projects has he built with LLMs?', data).text, /- Orchid Fixture Assistant \[Gemini API\]/);
  });

  test('2. a newly added skill is recognised, without inflating proficiency', () => {
    const data = fixture();
    data.skillsMarquee.push('Elixir');
    const r = ask('Does he know Elixir?', data);
    assert.ok(r.ids.includes('skills'), r.ids.join());
    assert.match(r.text, /Elixir/);
    assert.match(r.text, /no project's technology tags document their use[^\n]*Elixir/, 'reported as listed-only');

    data.skillCategories[0].skills.push({ name: 'Zig', level: 40, docUrl: '' } as never);
    assert.match(allText(data), /Zig \(40\)/, 'self-rating shown as-is from the data');
  });

  test('2b. a skill becomes "used in" once a project tags it', () => {
    const data = fixture();
    data.skillsMarquee.push('Elixir');
    data.projects[0].tags.push('Elixir');
    assert.match(allText(data), new RegExp(`- Elixir: ${data.projects[0].title}`));
  });

  test('3. a changed GitHub URL is used and the old URL is rejected', () => {
    const data = fixture();
    const project = data.projects.find((p) => p.github)!;
    const oldUrl = project.github;
    project.github = 'https://github.com/akshitjain1/renamed-fixture-repo';
    const kb = createKnowledgeBase(data);
    const text = kb.chunks.map((c) => c.text).join('\n');
    assert.ok(text.includes(project.github));
    assert.ok(!text.includes(oldUrl), 'old URL no longer in knowledge');
    assert.equal(sanitizeReply(`[repo](${oldUrl})`, [], kb), 'repo', 'stale link stripped from replies');
    assert.equal(sanitizeReply(`[repo](${project.github})`, [], kb), `[repo](${project.github})`);
  });

  test('3b. changed profile links and email propagate', () => {
    const data = fixture();
    data.personal.social.linkedin = 'https://www.linkedin.com/in/fixture-profile';
    data.personal.email = 'fixture@example.com';
    const kb = createKnowledgeBase(data);
    const core = kb.chunks[0].text;
    assert.match(core, /fixture-profile/);
    assert.match(core, /fixture@example\.com/);
    assert.equal(sanitizeReply('Mail akshitjainonly1@gmail.com', [], kb), 'Mail (email not available)');
  });

  test('4. an updated description replaces the old one', () => {
    const data = fixture();
    const project = data.projects.find((p) => p.title === 'Pathfinding Visualizer')!;
    const oldDescription = project.description;
    project.description = 'FIXTURE: rewritten description mentioning bidirectional search.';
    const r = ask('Tell me about the Pathfinding Visualizer', data);
    assert.match(r.text, /bidirectional search/);
    assert.ok(!r.text.includes(oldDescription));
  });

  test('4b. experience, education, achievements and certifications propagate', () => {
    const data = fixture();
    data.experience.unshift({
      role: 'Fixture ML Engineer',
      company: 'Fixture Labs',
      location: '',
      period: '2027 – Present',
      description: 'Fixture role.',
      highlights: [],
      current: true,
    });
    data.education[0].grade = 'CGPA 9.99 / 10';
    data.achievements.push('Fixture award for testing');
    data.certifications.push({ title: 'Fixture Cert', issuer: 'Fixture Org', date: '2027', credentialId: '', url: 'https://example.com/fixture-cert' });
    const text = allText(data);
    assert.match(text, /Current role: Fixture ML Engineer at Fixture Labs/);
    assert.match(text, /CGPA 9\.99/);
    assert.match(text, /Fixture award for testing/);
    assert.match(text, /Fixture Cert — Fixture Org/);
  });
});

describe('single source of truth (drift guards)', () => {
  const root = path.resolve(import.meta.dirname, '..');
  const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf8');

  test('5/6. the assistant reads only src/data/portfolio.ts, which the UI also renders', () => {
    const knowledge = read('src/lib/chat/knowledge.ts');
    const dataImports = knowledge.match(/from '[^']*data\/[^']*'/g) ?? [];
    assert.deepEqual(dataImports, ["from '../../data/portfolio'"]);
    assert.deepEqual(fs.readdirSync(path.join(root, 'src/data')), ['portfolio.ts'], 'no second knowledge file');

    // Every section the assistant uses is rendered from the same module.
    const uses: Record<string, string> = {
      projects: 'Projects.tsx', skillCategories: 'TechStack.tsx', skillsMarquee: 'SkillsMarquee.tsx',
      experience: 'Timeline.tsx', education: 'Timeline.tsx', certifications: 'Certifications.tsx',
      codingProfiles: 'CodingProfiles.tsx', capabilities: 'WhatIDo.tsx',
    };
    for (const [name, file] of Object.entries(uses)) {
      assert.match(read(`src/components/${file}`), new RegExp(`import \\{[^}]*\\b${name}\\b[^}]*\\} from '@/data/portfolio'`), `${file} renders ${name}`);
    }
  });

  test('5. components do not hard-code links or contact details that live in the data', () => {
    const p = portfolio.personal;
    const values = [
      p.email, p.resume, p.masterResume, p.videoResume, ...Object.values(p.social),
      ...portfolio.projects.flatMap((x) => [x.github, x.demo]),
    ].filter(Boolean);
    const dir = path.join(root, 'src/components');
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'))) {
      const src = fs.readFileSync(path.join(dir, file), 'utf8');
      for (const v of values) assert.ok(!src.includes(v), `${file} hard-codes ${v}; read it from @/data/portfolio`);
    }
  });

  test('8. no build-time cache of knowledge: the route reads the module built into each deployment', () => {
    const route = read('src/app/api/chat/route.ts');
    assert.match(route, /export const dynamic = 'force-dynamic'/);
    assert.match(route, /'Cache-Control': 'no-store'/);
    assert.doesNotMatch(route, /revalidate|unstable_cache/);
  });
});
