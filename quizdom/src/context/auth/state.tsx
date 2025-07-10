"use client";

// REACT ESSENTIALS
import React, { useState, useContext, ReactNode } from "react";

// CONTEXT
import AuthContext, { Team } from "./context";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // CREATE USER
  const register = async (data: object) => {
    const _req = await fetch(`${host}/api/auth/create`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_HOST_URI}`,
      },
      body: JSON.stringify(data),
    });
    if (_req.ok) {
      const _response = await _req.json();
      return _response;
    } else {
      throw new Error(`${_req.status} : ${_req.statusText}`);
    }
  };

  // SET USER
  const getSetTeam = (_usr: Team) => {
    setTeam(_usr);
    setIsAuthenticated(true);
  };

  // LOGIN USER WITH JWT
  const login = async (_id: string | null, password: string | null) => {
    const _req = await fetch(`${host}/api/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_HOST_URI}`,
      },
      body: JSON.stringify({ id: _id, password: password }),
    });
    if (_req.ok) {
      const _response = await _req.json();
      getSetTeam(_response);
      return _response;
    } else {
      throw new Error(`${_req.status} : ${_req.statusText}`);
    }
  };

  // FETCH USER (UNUSED)
  const fetchTeam = async (_id: string | null) => {
    const req = await fetch(host + "/api/auth/team", {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": `${process.env.NEXT_PUBLIC_HOST_URI}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: _id }),
    });

    const response = await req.json();

    if (response._id) {
      getSetTeam(response);
    }
    return response;
  };

  // REMOVE USER
  const removeTeam = () => {
    setTeam(initialState);
    setIsAuthenticated(false);
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
