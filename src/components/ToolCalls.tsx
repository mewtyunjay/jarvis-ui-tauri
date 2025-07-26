import { ToolCall } from '../types/message';

interface ToolCallsProps {
  toolCalls: ToolCall[];
}

export function ToolCalls({ toolCalls }: ToolCallsProps) {
  if (!toolCalls || toolCalls.length === 0) {
    return null;
  }

  return (
    <div className="tool-calls">
      <h4>Tool Calls:</h4>
      {toolCalls.map((tool, index) => (
        <div key={index} className={`tool-call ${tool.error ? 'error' : 'success'}`}>
          <strong>{tool.name}</strong>: {tool.result}
        </div>
      ))}
    </div>
  );
} 