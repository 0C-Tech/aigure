export interface ChatMessage {
  content: string;
  isRobot?: boolean;
  role?: 'user' | 'assistant';
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
  }[];
}
