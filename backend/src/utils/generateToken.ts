import { StatusCode, User } from "../types";
import jwt from 'jsonwebtoken';
import prisma from "./prismaClient";

const JWT_SECRET = process.env.JWT_SECRET;
export async function generateAccessToken(refreshToken: string): Promise<string> {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    const user = jwt.verify(refreshToken, JWT_SECRET) as User;
    console.log(user)
    if (!user) {
        throw new Error("Invalid refresh token");
    }
    if (user.role == "distributor") {
        const userExists = await prisma.distributor.findUnique({ where: { email: user.email } });
        if (!userExists) {
            throw new Error("User does not exist");
        }
        const accessToken = jwt.sign({ email: userExists.email, id: userExists.id }, JWT_SECRET, { expiresIn: '15m' });
        if (!accessToken) {
            throw new Error("Failed to generate access token");
        }
        return accessToken;
    }
    if (user.role == "admin") {
        const userExists = await prisma.admin.findUnique({ where: { email: user.email } });
        if (!userExists) {
            throw new Error("User does not exist");
        }
        const accessToken = jwt.sign({ email: userExists.email, id: userExists.id }, JWT_SECRET, { expiresIn: '15m' });
        if (!accessToken) {
            throw new Error("Failed to generate access token");
        }
        return accessToken;
    }
    throw new Error("Invalid user role");
}

export async function generateRefreshToken(user: User): Promise<string> {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined");
    }
    const refreshToken = await jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    if (!refreshToken) {
        throw new Error("Failed to generate refresh token");
    }
    return refreshToken;
}