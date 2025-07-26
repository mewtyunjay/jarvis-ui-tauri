import { Message } from '../types/message';
import { ToolCalls } from './ToolCalls';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`message ${message.type}`}>
      <div className="message-content">
        {message.content}
      </div>
      
      {/* Display status if available */}
      {message.status && message.type === 'assistant' && (
        <div className={`message-status ${message.status}`}>
          Status: {message.status}
        </div>
      )}
      
      {/* Display error if available */}
      {message.error && (
        <div className="message-error">
          Error: {message.error}
        </div>
      )}
      
      {/* Display tool calls if available */}
      <ToolCalls toolCalls={message.toolCalls || []} />
      
      <div className="message-timestamp">
        {message.timestamp.toLocaleTimeString()}
      </div>
    </div>
  );
} 