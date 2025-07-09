// src/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise, { getCustomersCollection, getDb } from '@/lib/mongodb';
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
    async signIn({ user, account }) {
      // For OAuth providers, proactively check for the account linking issue.
      if (account && account.provider !== 'credentials') {
        const customers = await getCustomersCollection();
        const existingUserByEmail = await customers.findOne({ email: user.email });

        // If a user with this email exists and they have a password, it means they signed up with credentials.
        if (existingUserByEmail && existingUserByEmail.password) {
          // Now check if they already have this OAuth account linked.
          const db = await getDb();
          // The adapter stores linked accounts in the 'accounts' collection by default
          const accountsCollection = db.collection('accounts');
          const linkedAccount = await accountsCollection.findOne({
            userId: existingUserByEmail._id, // The adapter links by the MongoDB '_id'
            provider: account.provider
          });

          // If there's no linked account, we have the account linking conflict.
          if (!linkedAccount) {
            // Force a redirect to the login page with the specific error.
            return `/login?error=OAuthAccountNotLinked`;
          }
        }
      }

      // If we passed all checks, or it's a credentials login (which is handled in `authorize`), allow the sign-in.
      return true;
    },
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
