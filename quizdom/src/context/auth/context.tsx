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

interface RegistrationModel {
  team: string | undefined | null;
  password: string | undefined | null;
  category: string | undefined | null;
  school: string | undefined | null;
  members: {
    member1: Member;
    member2: Member;
    member3: Member;
    member4: Member;
  };
  role: string | null;
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
  register: (data: RegistrationModel | null) => Promise<AuthResponse>;
  login: (_id: string | null, password: string | null) => Promise<AuthResponse>;
  fetchTeam: (_id: string) => Promise<AuthResponse>;
  getSetTeam: (team: Team) => void;
  removeTeam: () => void;
}

// Define the shape of the context data
const AuthContext: Context<ContextType> = createContext<ContextType>(
  {} as ContextType
);

export type { Team, ContextType, AuthResponse, Member, RegistrationModel };
export default AuthContext;
