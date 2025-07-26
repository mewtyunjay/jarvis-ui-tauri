interface ChatHeaderProps {
  apiUrl: string;
  setApiUrl: (url: string) => void;
  debug: boolean;
  setDebug: (debug: boolean) => void;
}

export function ChatHeader({ apiUrl, setApiUrl, debug, setDebug }: ChatHeaderProps) {
  return (
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
  );
} 