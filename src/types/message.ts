export interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: string;
  toolCalls?: ToolCall[];
  error?: string;
}

export interface ToolCall {
  name: string;
  result: string;
  error: boolean;
} 