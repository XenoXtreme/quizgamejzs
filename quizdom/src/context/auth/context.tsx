"use client";

import { Context, createContext } from "react";

// TYPES
interface Member {
  name: string | undefined | null;
  class: string | undefined;
}

interface Team {
  id: string | undefined | null;
  team: string | undefined | null;
  category: string | undefined | null;
  school: string | undefined | null;
  role: string | null;
  member: {
    member1: Member;
    member2: Member;
    member3: Member;
    member4: Member;
  };
}

// Response Type
interface AuthResponse {
  success: boolean;
  response?: {
    success?: boolean;
    data?: Team;
    token?: string;
  };
  message?: string;
  error?: string;
}

interface ContextType {
  team: Team;
  isAuthenticated: boolean;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  register: (data: Record<string, unknown>) => Promise<AuthResponse>;
  login: (_id: string | null, password: string | null) => Promise<AuthResponse>;
  fetchTeam: (_id: string) => Promise<AuthResponse>;
  getSetTeam: (_usr: Team) => void;
  removeTeam: () => void;
}

// Define the shape of the context data
const AuthContext: Context<ContextType> = createContext<ContextType>(
  {} as ContextType
);

export type { Team, ContextType, AuthResponse, Member };
export default AuthContext;
