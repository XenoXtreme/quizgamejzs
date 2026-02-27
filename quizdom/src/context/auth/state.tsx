"use client";

import React, { useState, useContext, ReactNode } from "react";
import AuthContext, { Team, AuthResponse, RegistrationModel } from "./context";

export function AuthState({ children }: { children: ReactNode }) {
  const initialState: Team = {
    id: "",
    team: "",
    category: "",
    school: "",
    role: "",
    member: {
      member1: { name: "", class: "" },
      member2: { name: "", class: "" },
      member3: { name: "", class: "" },
      member4: { name: "", class: "" },
    },
  };

  const host = process.env.NEXT_PUBLIC_BACKEND_API_URI as string;
  const [team, setTeam] = useState<Team>(initialState);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getSetTeam = (_team: Team) => {
    setTeam(_team);
    setIsAuthenticated(true);
  };

  const removeTeam = () => {
    setTeam(initialState);
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("_user");
    localStorage.removeItem("_global_token");
    localStorage.removeItem("_refresh_token");
  };

  const register = async (
    data: RegistrationModel | null
  ): Promise<AuthResponse> => {
    try {
      const _req = await fetch(`${host}/api/auth/create`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (_req.ok) {
        const _response = await _req.json();
        getSetTeam(_response.data);

        setAccessToken(_response.token);
        setRefreshToken(_response.refreshToken);
        localStorage.setItem("_global_token", _response.token);
        localStorage.setItem("_refresh_token", _response.refreshToken);

        return { success: true, response: _response };
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

  const login = async (
    _id: string | null,
    password: string | null
  ): Promise<AuthResponse> => {
    try {
      const _req = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: _id, password }),
      });

      if (_req.ok) {
        const _response = await _req.json();
        const _teamData: Team = {
          id: _response.data._id || _response.data.id,
          team: _response.data.team,
          category: _response.data.category,
          school: _response.data.school,
          role: _response.data.role,
          member: _response.data.member || _response.data.members,
        };

        getSetTeam(_teamData);

        setAccessToken(_response.token);
        setRefreshToken(_response.refreshToken);
        localStorage.setItem("_global_token", _response.token);
        localStorage.setItem("_refresh_token", _response.refreshToken);

        console.log("✅ Login successful - tokens stored");
        return { success: true, response: _response };
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

  const fetchTeam = async (_id: string): Promise<AuthResponse> => {
    try {
      const req = await fetch(host + "/api/auth/team", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ id: _id }),
      });

      const response = await req.json();

      if (response.data) {
        const _teamData = {
          ...response.data,
          member: response.data.members?.[0],
        };
        delete _teamData.members;
        getSetTeam(_teamData);
      }

      return { success: true, response };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      };
    }
  };

  const refreshTokenHandler = async (): Promise<string | null> => {
    const token = refreshToken || localStorage.getItem("_refresh_token");

    if (!token) {
      console.error("❌ No refresh token found");
      removeTeam();
      return null;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URI}/api/auth/refresh`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken: token }),
        }
      );

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.token) {
        setAccessToken(data.token);
        localStorage.setItem("_global_token", data.token);
        console.log("✅ Access token refreshed successfully");
        return data.token;
      }

      return null;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      removeTeam();
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        team,
        isAuthenticated,
        token: accessToken,
        setTeam,
        register,
        login,
        fetchTeam,
        getSetTeam,
        removeTeam,
        refreshToken: refreshTokenHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
