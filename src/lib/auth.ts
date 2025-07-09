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
            // This case handles when a user created an account with Google, then tries to log in with credentials
            // Before an OAuthAccountNotLinked error is thrown, we can simply say invalid credentials
            return null;
        }

        const passwordsMatch = await bcrypt.compare(
          String(credentials.password).trim(),
          user.password
        );

        if (passwordsMatch) {
            // The lastLoginAt update is now handled by the events.signIn callback.
            
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
  events: {
    async signIn(message) {
      // This event fires on a successful sign-in with ANY provider.
      // This is the correct place for side-effects like updating login times.
      if (message.user.email) {
        try {
          const customers = await getCustomersCollection();
          await customers.updateOne(
            { email: message.user.email },
            { $set: { lastLoginAt: new Date() } }
          );
          console.log(`[Auth Event: signIn] Updated lastLoginAt for ${message.user.email}`);
        } catch (error) {
          console.error("[Auth Event: signIn] Failed to update lastLoginAt:", error);
        }
      }
    }
  },
  callbacks: {
    // The signIn callback is removed to allow default error handling to proceed.
    
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
