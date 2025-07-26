import { useState } from "react";
import "./App.css";

import { ChatHeader } from './components/ChatHeader';
import { MessagesList } from './components/MessagesList';
import { InputBox } from './components/InputBox';
import { useChatApi } from './hooks/useChatApi';

function App() {
  const [debug, setDebug] = useState(true);
  const [apiUrl, setApiUrl] = useState("http://127.0.0.1:8000/chat");
  
  const { messages, isLoading, sendMessage } = useChatApi(apiUrl, debug);

  return (
    <main className="chat-container">
      <ChatHeader 
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        debug={debug}
        setDebug={setDebug}
      />

      <MessagesList 
        messages={messages}
        isLoading={isLoading}
      />

      <InputBox 
        onSendCommand={sendMessage}
        isLoading={isLoading}
      />
    </main>
  );
}

export default App;
