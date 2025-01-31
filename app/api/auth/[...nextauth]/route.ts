import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/User";

const handler = NextAuth({
  debug: true, // Exibe logs detalhados para debugging
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Por favor, informe email e senha");
        }

        await dbConnect();

        try {
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Email não encontrado");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Senha incorreta");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Erro ao autenticar:", error);
          throw new Error("Erro ao fazer login"); // Corrigido para lançar erro
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Página de login correta
    error: "/auth/error", // Página de erro (crie essa página)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {}; // Garante que session.user está definido
      }

      session.user.id = (token.id as string) || "";
      session.user.name = token.name || "";
      session.user.email = token.email || "";

      return session;
    },
  },
});

export { handler as GET, handler as POST };
