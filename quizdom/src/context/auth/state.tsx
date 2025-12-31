"use client";

// REACT ESSENTIALS
import React, { useState, useContext, ReactNode } from "react";

// CONTEXT
import AuthContext, { Team, AuthResponse } from "./context";

// STATE
export function AuthState({ children }: { children: ReactNode }) {
  const initialState: Team = {
    id: "",
    team: "",
    category: "",
    school: "",
    role: "",
    member: {
      member1: {
        name: "",
        class: "",
      },
      member2: {
        name: "",
        class: "",
      },
      member3: {
        name: "",
        class: "",
      },
      member4: {
        name: "",
        class: "",
      },
    },
  };

  // VARIABLE SETTINGS
  const host = process.env.NEXT_PUBLIC_BACKEND_API_URI as string;
  const [team, setTeam] = useState<Team>(initialState);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // SET USER
  const getSetTeam = (_usr: Team) => {
    setTeam(_usr);
    setIsAuthenticated(true);
  };

  // REMOVE USER
  const removeTeam = () => {
    setTeam(initialState);
    setIsAuthenticated(false);
  };

  // CREATE USER
  const register = async (
    data: Record<string, unknown>
  ): Promise<AuthResponse> => {
    try {
      const _req = await fetch(`${host}/api/auth/create`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (_req.ok) {
        const _response = await _req.json();
        console.log(typeof _response);
        return {
          success: true,
          response: _response,
        };
      } else {
        throw new Error(`${_req.status} : ${_req.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  // LOGIN USER
  const login = async (
    _id: string | null,
    password: string | null
  ): Promise<AuthResponse> => {
    try {
      const _req = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id, password: password }),
      });

      if (_req.ok) {
        const _response = await _req.json();
        getSetTeam(_response.data);
        setToken(_response.token);
        return {
          success: true,
          response: _response,
        };
      } else {
        throw new Error(`${_req.status} : ${_req.statusText}`);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  // FETCH USER
  const fetchTeam = async (_id: string): Promise<AuthResponse> => {
    try {
      const req = await fetch(host + "/api/auth/team", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Bearer-Token": token as string,
        },
        body: JSON.stringify({ id: _id }),
      });

      const response = await req.json();

      if (response._id) {
        getSetTeam(response);
      }
      console.log(typeof response);
      return {
        success: true,
        response: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        team,
        isAuthenticated,
        setTeam,
        register,
        login,
        fetchTeam,
        getSetTeam,
        removeTeam,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
