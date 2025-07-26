import { useRef, useEffect } from 'react';
import { Message } from '../types/message';
import { MessageBubble } from './MessageBubble';

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessagesList({ messages, isLoading }: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.length === 0 && (
        <div className="welcome-message">
          <p>Welcome to Jarvis! Send a command to get started.</p>
          <p className="example">Example: "create an event on my calendar, called residency kickoff at 12 PM PST tomorrow"</p>
        </div>
      )}
      
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="message assistant loading">
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
} 