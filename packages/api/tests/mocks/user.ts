import { PrismaUser } from "../../src/prismaQueries/user";

const DEFAULT_USER: PrismaUser = {
    id: "userId",
};

export function getUserMock(user?: Partial<PrismaUser>): PrismaUser {
    return {
        ...DEFAULT_USER,
        ...user,
    };
}
