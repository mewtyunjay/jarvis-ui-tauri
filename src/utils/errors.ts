import { ApiError } from './api';

export const formatApiError = (error: unknown, apiUrl: string): string => {
  console.error('Request failed:', error);
  
  if (error instanceof ApiError) {
    if (error.message.includes('fetch')) {
      return `Cannot connect to ${apiUrl}. Make sure your FastAPI backend is running.`;
    }
    return error.message;
  }
  
  if (error instanceof Error) {
    if (error.message.includes('fetch')) {
      return `Cannot connect to ${apiUrl}. Make sure your FastAPI backend is running.`;
    }
    return error.message;
  }
  
  return 'Unknown error occurred';
}; 