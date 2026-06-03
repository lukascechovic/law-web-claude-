import type { ChatMessage } from './llm';

/**
 * Bounds chat history to the last `max` turns before it reaches the LLM.
 * Multi-turn memory needs only the recent context for follow-up questions
 * ("what about its price?"); keeping every turn would grow the prompt and
 * cost without bound, so the route trims server-side regardless of client.
 */
export function recentTurns(turns: ChatMessage[], max: number): ChatMessage[] {
  return turns.slice(-max);
}
