import fs from 'node:fs';
import path from 'node:path';

export interface FaqEntry {
  question: string;
  answer: string;
}

export function loadFaq(slug: string): FaqEntry[] {
  const filePath = path.join(process.cwd(), 'content', 'faq', `${slug}.md`);
  const raw = fs.readFileSync(filePath, 'utf-8');

  return raw
    .split(/^### /m)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [question, ...rest] = block.split('\n');
      return {
        question: question.trim(),
        answer: rest.join('\n').trim(),
      };
    });
}
