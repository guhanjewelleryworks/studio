// src/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import { getCustomersCollection } from './mongodb';
import type { Customer } from '@/types/goldsmith';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, // Recommended for environments like Firebase Studio
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.DB_NAME || 'goldsmithconnect',
    collections: {
      Users: 'customers', // Use our existing 'customers' collection
    },
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const customers = await getCustomersCollection();
        const user = await customers.findOne({ email: String(credentials.email).toLowerCase().trim() });
        
        if (!user) {
          return null;
        }

        if (!user.emailVerified) {
          // Special error case for not verified
          throw new Error('NOT_VERIFIED');
        }

        if (!user.password) {
            return null; // Can't log in with password if none is set (e.g., social account)
        }

        const passwordsMatch = await bcrypt.compare(
          String(credentials.password).trim(),
          user.password
        );

        if (passwordsMatch) {
            // The lastLoginAt update is now handled by the signIn callback for all login types.
            
            // Return the user object expected by next-auth
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
            };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        try {
          const customers = await getCustomersCollection();
          // This update now runs for both Google and Credentials sign-ins
          await customers.updateOne(
            { email: user.email },
            { $set: { lastLoginAt: new Date() } }
          );
          console.log(`[Auth Callback: signIn] Updated lastLoginAt for ${user.email}`);
        } catch (error) {
          console.error("[Auth Callback: signIn] Failed to update lastLoginAt:", error);
          // We don't block the sign-in for this, so we just log the error.
        }
      }
      return true; // Continue with the sign-in process
    },
    // This callback is used to add our custom `id` field to the session user object
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }) {
        if (session.user) {
            session.user.id = token.id as string;
        }
        return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // All sign-in errors will now redirect to the login page itself
  },
});
