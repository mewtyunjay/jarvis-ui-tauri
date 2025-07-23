import { useState, useRef, useEffect } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import "./App.css";

interface Message {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: string;
  toolCalls?: ToolCall[];
  error?: string;
}

interface ToolCall {
  name: string;
  result: string;
  error: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debug, setDebug] = useState(true);
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000/chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'user' | 'assistant', content: string, status?: string, toolCalls?: ToolCall[], error?: string) => {
    const newMessage: Message = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      status,
      toolCalls,
      error
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendCommand = async () => {
    if (!currentInput.trim()) return;
    
    const userQuery = currentInput.trim();
    addMessage('user', userQuery);
    setCurrentInput("");
    setIsLoading(true);

    try {
      const requestBody = {
        query: userQuery,
        debug: debug  // Send as boolean instead of string
      };

      console.log('Sending request to:', apiUrl);
      console.log('Request body:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Handle the new structured response
      const assistantResponse = data.content || 'No content received';
      const status = data.status || 'unknown';
      const toolCalls = data.tool_calls || [];
      const error = data.error;
      
      addMessage('assistant', assistantResponse, status, toolCalls, error);
    } catch (error) {
      console.error('Request failed:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Check if it's a network error
      if (errorMessage.includes('fetch')) {
        errorMessage = `Cannot connect to ${apiUrl}. Make sure your FastAPI backend is running.`;
      }
      
      addMessage('assistant', `Error: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCommand();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
    }
  };

  return (
    <main className="chat-container">
      <div className="chat-header">
        <h1>Jarvis Assistant</h1>
        <div className="controls">
          <div className="api-url-input">
            <label htmlFor="api-url">API URL:</label>
            <input
              id="api-url"
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://127.0.0.1:8000/chat"
            />
          </div>
          <div className="debug-toggle">
            <label>
              <input
                type="checkbox"
                checked={debug}
                onChange={(e) => setDebug(e.target.checked)}
              />
              Debug Mode
            </label>
          </div>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Welcome to Jarvis! Send a command to get started.</p>
            <p className="example">Example: "create an event on my calendar, called residency kickoff at 12 PM PST tomorrow"</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
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
            {message.toolCalls && message.toolCalls.length > 0 && (
              <div className="tool-calls">
                <h4>Tool Calls:</h4>
                {message.toolCalls.map((tool, index) => (
                  <div key={index} className={`tool-call ${tool.error ? 'error' : 'success'}`}>
                    <strong>{tool.name}</strong>: {tool.result}
                  </div>
                ))}
              </div>
            )}
            
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
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

      <form className="input-container" onSubmit={handleSubmit}>
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your command here..."
          disabled={isLoading}
          rows={2}
        />
        <button type="submit" disabled={isLoading || !currentInput.trim()}>
          Send
        </button>
      </form>
    </main>
  );
}

export default App;
