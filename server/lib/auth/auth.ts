import { Db, ObjectId } from "mongodb";
import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";

// Team Interface
export interface MemberParam {
  name: string;
  class: string;
}

export interface Member {
  member1: MemberParam;
  member2: MemberParam;
  member3: MemberParam;
  member4: MemberParam;
}

export interface Team {
  _id?: ObjectId;
  team: string;
  category?: string;
  password: string;
  school: string;
  role: string;
  member: Member;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  id: string;
  team: string;
  role: string;
  school: string;
  iat?: number;
  exp?: number;
}

export interface RefreshToken {
  _id?: ObjectId;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class AuthService {
  private db: Db;
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private refreshTokenExpiresIn: number; // in days

  constructor(db: Db, jwtSecret?: string, jwtExpiresIn?: string) {
    this.db = db;
    this.jwtSecret =
      jwtSecret || process.env.JWT_SECRET || "your-secret-key-change-this";
    this.jwtExpiresIn = jwtExpiresIn || process.env.JWT_EXPIRES_IN || "7d";
    this.refreshTokenExpiresIn = 30;
  }

  // Generate Access Token (short-lived)
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  // Generate Refresh Token (long-lived)
  async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = jwt.sign({ userId, type: "refresh" }, this.jwtSecret, {
      expiresIn: `${this.refreshTokenExpiresIn}d`,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.refreshTokenExpiresIn);

    // Store refresh token in database
    await this.db.collection<RefreshToken>("RefreshTokens").insertOne({
      userId,
      token: refreshToken,
      expiresAt,
      createdAt: new Date(),
    });

    return refreshToken;
  }

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log("Token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log(error.message);
        console.log(error.stack);
        // console.log("Invalid token");
      }
      return null;
    }
  }

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtSecret) as any;

      if (decoded.type !== "refresh") {
        return { error: "Invalid token type" };
      }

      // Check if refresh token exists in database and is not expired
      const storedToken = await this.db
        .collection<RefreshToken>("RefreshTokens")
        .findOne({
          userId: decoded.userId,
          token: refreshToken,
          expiresAt: { $gt: new Date() },
        });

      if (!storedToken) {
        return { error: "Invalid or expired refresh token" };
      }

      // Get user data
      const team = await this.db.collection<Team>("Team").findOne({
        _id: new ObjectId(decoded.userId),
      });

      if (!team) {
        return { error: "Team not found" };
      }

      // Generate new access token
      const newAccessToken = this.generateToken({
        id: team._id!.toString(),
        team: team.team,
        role: team.role,
        school: team.school,
      });

      return {
        success: true,
        token: newAccessToken,
        data: {
          id: team._id!.toString(),
          team: team.team,
          category: team.category,
          role: team.role,
          school: team.school,
        },
      };
    } catch (error) {
      return {
        error: "Failed to refresh token",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Revoke refresh token (for logout)
  async revokeRefreshToken(userId: string, refreshToken?: string) {
    try {
      if (refreshToken) {
        // Revoke specific token
        await this.db
          .collection<RefreshToken>("RefreshTokens")
          .deleteOne({ userId, token: refreshToken });
      } else {
        // Revoke all tokens for user
        await this.db
          .collection<RefreshToken>("RefreshTokens")
          .deleteMany({ userId });
      }

      return { success: true };
    } catch (error) {
      return {
        error: "Failed to revoke token",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Clean up expired refresh tokens
  async cleanupExpiredTokens() {
    try {
      await this.db
        .collection<RefreshToken>("RefreshTokens")
        .deleteMany({ expiresAt: { $lt: new Date() } });
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }

  async registerTeam(
    team: string,
    category: string,
    password: string,
    school: string,
    members: Member,
    role: string = "TEAM"
  ) {
    try {
      const hashedPassword = await hash(password, 10);

      const result = await this.db.collection<Team>("Team").insertOne({
        team,
        category,
        password: hashedPassword,
        school,
        member: members,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newTeam = await this.db.collection<Team>("Team").findOne({
        _id: result.insertedId,
      });

      if (!newTeam) {
        return { error: "Failed to retrieve newly created team" };
      }

      const userId = newTeam._id!.toString();

      // Generate both access and refresh tokens
      const token = this.generateToken({
        id: userId,
        team: newTeam.team,
        role: newTeam.role,
        school: newTeam.school,
      });

      const refreshToken = await this.generateRefreshToken(userId);

      // Return without password
      const { password: _, ...teamData } = newTeam;
      return {
        success: true,
        data: {
          ...teamData,
          id: userId,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      return {
        error: "Failed to register team",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async verifyTeam(id: string, password: string) {
    try {
      let objectId: ObjectId;

      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { error: "Invalid team ID format" };
      }

      const team = await this.db.collection<Team>("Team").findOne({
        _id: objectId,
      });

      if (!team) {
        return { error: "Team not found" };
      }

      const isValid = await compare(password, team.password);

      if (!isValid) {
        return { error: "Invalid password" };
      }

      const userId = team._id!.toString();

      // Generate both access and refresh tokens
      const token = this.generateToken({
        id: userId,
        team: team.team,
        role: team.role,
        school: team.school,
      });

      const refreshToken = await this.generateRefreshToken(userId);

      return {
        success: true,
        data: {
          id: userId,
          team: team.team,
          category: team.category,
          members: team.member,
          role: team.role,
          school: team.school,
        },
        token,
        refreshToken,
      };
    } catch (error) {
      return {
        error: "Failed to verify team",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getTeamData(id: string) {
    try {
      let objectId: ObjectId;

      try {
        objectId = new ObjectId(id);
      } catch (error) {
        return { error: "Invalid team ID format" };
      }

      const team = await this.db.collection<Team>("Team").findOne({
        _id: objectId,
      });

      if (!team) {
        return { error: "Team not found" };
      }

      return {
        success: true,
        data: {
          id: team._id!.toString(),
          team: team.team,
          category: team.category,
          members: team.member,
          role: team.role,
          school: team.school,
        },
      };
    } catch (error) {
      return {
        error: "Failed to retrieve team data",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getAllTeam() {
    try {
      const teams = await this.db
        .collection<Team>("Team")
        .find({})
        .project({ password: 0 })
        .toArray();

      return {
        success: true,
        data: teams.map((team) => ({
          id: team._id!.toString(),
          team: team.team,
          category: team.category,
          school: team.school,
          role: team.role,
        })),
      };
    } catch (error) {
      return {
        error: "Failed to retrieve teams",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
