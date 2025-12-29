export interface BuzzerEvent {
    teamId: string;
    round: number;
    questionNumber: number;
  }
  
  export interface BuzzerPressedResponse {
    id: string;
    teamName: string;
    teamId: string;
    round: number;
    questionNumber: number;
    pressedAt: Date;
  }
  
  export interface BuzzerResetEvent {
    round: number;
    questionNumber: number;
    resetAt: Date;
  }
  
  export interface BuzzerState {
    id: string;
    isPressed: boolean;
    teamId: string;
    team: {
      id: string;
      team: string;
      school: string;
    };
    pressedAt: Date;
    round: number;
    questionNumber: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface BuzzerHistoryResponse {
    buzzerStates: BuzzerState[];
  }