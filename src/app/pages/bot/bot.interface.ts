export interface ChatMessage {
  id?: number;
  content: string;
  html?: string;
  role?: 'user' | 'assistant';
  isRobot?: boolean;
  loading?: boolean;
  voted?: boolean;
}

export interface ChatGPTParam {
  messages: ChatMessage[];
  model: 'gpt-3.5-turbo';
}

export interface ChatGPTResponse {
  id?: string;
  created?: number;
  choices: {
    message: {
      role?: string;
      content: string;
    };
    delta: {
      content?: string;
    };
  }[];
  error: {
    message: string;
  };
}

export interface MessageBody {
  type: 'message' | 'done' | 'error';
  message?: string;
  conversationId?: string;
  error?: Error;
}
