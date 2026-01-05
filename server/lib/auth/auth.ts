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
}

export class AuthService {
  private db: Db;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor(db: Db, jwtSecret?: string, jwtExpiresIn?: string) {
    this.db = db;
    this.jwtSecret =
      jwtSecret || process.env.JWT_SECRET || "your-secret-key-change-this";
    this.jwtExpiresIn = jwtExpiresIn || process.env.JWT_EXPIRES_IN || "7d";
  }

  // Generate JWT token
  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  // Verify JWT token
  verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
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

      // Generate JWT token
      const token = this.generateToken({
        id: newTeam._id!.toString(),
        team: newTeam.team,
        role: newTeam.role,
        school: newTeam.school,
      });

      // Return without password
      const { password: _, ...teamData } = newTeam;
      return {
        success: true,
        data: {
          ...teamData,
          id: newTeam._id!.toString(),
        },
        token,
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

      // Generate JWT token
      const token = this.generateToken({
        id: team._id!.toString(),
        team: team.team,
        role: team.role,
        school: team.school,
      });

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
        token,
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
