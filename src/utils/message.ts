import { Message, ToolCall } from '../types/message';

export const createMessage = (
  type: 'user' | 'assistant',
  content: string,
  status?: string,
  toolCalls?: ToolCall[],
  error?: string
): Message => ({
  id: Date.now(),
  type,
  content,
  timestamp: new Date(),
  status,
  toolCalls,
  error
}); 