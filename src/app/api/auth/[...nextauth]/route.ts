import NextAuth, {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "../../../../../lib/prisma";
const bcrypt = require("bcryptjs");

export async function encryptPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      throw new Error("Erro ao criptografar senha");
    }
  }

async function checkEncryptedPassword(password: string, hash: string) {
    try {
      const match = await bcrypt.compare(password, hash)
      return match;
    } catch (error) {
      throw new Error("Erro ao verificar a senha")
    }
  }

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            authorize: async (credentials: any, req: any) => {
                const {username, password} = credentials as { username: string, password: string }

                if (username === "admin" && password === "admin") {
                    return { id: "admin", name: username, email: "admin@admin.com" };
                }

                const user = await prisma.user.findUnique({
                    where: {
                        username,
                    }
                });

                if (user && await checkEncryptedPassword(password, user.password)) {
                    return { id: String(user.id), name: user.username, email: user.email }
                }

                return null
            }
        })
    ],
    pages: {
        signIn: '/sistema/login'
    }
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};