import { useState } from 'react';
import { Message, ToolCall } from '../types/message';
import { sendChatRequest, ChatResponse } from '../utils/api';
import { formatApiError } from '../utils/errors';
import { createMessage } from '../utils/message';

export const useChatApi = (apiUrl: string, debug: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (
    type: 'user' | 'assistant',
    content: string,
    status?: string,
    toolCalls?: ToolCall[],
    error?: string
  ) => {
    const newMessage = createMessage(type, content, status, toolCalls, error);
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (userQuery: string) => {
    addMessage('user', userQuery);
    setIsLoading(true);

    try {
      const response: ChatResponse = await sendChatRequest(apiUrl, {
        query: userQuery,
        debug: debug
      });

      // Handle the structured response
      const assistantResponse = response.content || 'No content received';
      const status = response.status || 'unknown';
      const toolCalls = response.tool_calls || [];
      const error = response.error;

      addMessage('assistant', assistantResponse, status, toolCalls, error);
    } catch (error) {
      const errorMessage = formatApiError(error, apiUrl);
      addMessage('assistant', `Error: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}; 