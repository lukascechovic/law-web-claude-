import { describe, it, expect } from 'vitest';
import { recentTurns } from './memory';
import type { ChatMessage } from './llm';

function turn(i: number, role: ChatMessage['role'] = 'user'): ChatMessage {
  return { role, content: `m${i}` };
}

describe('recentTurns', () => {
  it('keeps only the last `max` turns, preserving order and the latest turn', () => {
    const history = [turn(1), turn(2), turn(3), turn(4), turn(5), turn(6)];

    const kept = recentTurns(history, 4);

    expect(kept.map(t => t.content)).toEqual(['m3', 'm4', 'm5', 'm6']);
  });

  it('keeps the whole conversation when it is shorter than `max`', () => {
    const history = [turn(1, 'user'), turn(2, 'assistant'), turn(3, 'user')];

    expect(recentTurns(history, 8)).toEqual(history);
  });
});
