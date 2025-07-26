import { useState } from 'react';

interface InputBoxProps {
  onSendCommand: (input: string) => void;
  isLoading: boolean;
}

export function InputBox({ onSendCommand, isLoading }: InputBoxProps) {
  const [currentInput, setCurrentInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      onSendCommand(currentInput.trim());
      setCurrentInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentInput.trim()) {
        onSendCommand(currentInput.trim());
        setCurrentInput("");
      }
    }
  };

  return (
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
  );
} 