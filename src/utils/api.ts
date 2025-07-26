import { fetch } from "@tauri-apps/plugin-http";

export interface ChatRequest {
  query: string;
  debug: boolean;
}

export interface ChatResponse {
  content?: string;
  status?: string;
  tool_calls?: Array<{
    name: string;
    result: string;
    error: boolean;
  }>;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public apiUrl?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const sendChatRequest = async (
  apiUrl: string, 
  request: ChatRequest
): Promise<ChatResponse> => {
  console.log('Sending request to:', apiUrl);
  console.log('Request body:', request);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);

  if (!response.ok) {
    throw new ApiError(
      `HTTP error! status: ${response.status}`, 
      response.status, 
      apiUrl
    );
  }

  const data = await response.json();
  console.log('Response data:', data);
  
  return data;
}; 