// src/lib/auth.ts
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise, { getCustomersCollection } from '@/lib/mongodb';
import type { Customer } from '@/types/goldsmith';
import bcrypt from 'bcryptjs';
import type { Account, User } from 'next-auth';

async function getAccount(providerAccountId: string, provider: string) {
    const db = (await clientPromise).db(process.env.DB_NAME || 'goldsmithconnect');
    const account = await db.collection('accounts').findOne({ providerAccountId, provider });
    return account;
}

async function linkAccountWithUser(userId: string, account: Omit<Account, 'userId'>) {
    const db = (await clientPromise).db(process.env.DB_NAME || 'goldsmithconnect');
    await db.collection('accounts').insertOne({ ...account, userId });
}


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
      // This is the key change. By setting this to true, we tell NextAuth to
      // automatically link an OAuth login with an existing user account if the email matches.
      // This is safe for trusted providers like Google that have already verified the user's email.
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
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
    maxAge: 60 * 60, // 1 hour in seconds
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour in seconds
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
            { $set: { lastLoginAt: new Date(), authProvider: message.account?.provider ?? 'credentials' } }
          );
          console.log(`[Auth Event: signIn] Updated lastLoginAt for ${message.user.email}`);
        } catch (error) {
          console.error("[Auth Event: signIn] Failed to update lastLoginAt:", error);
        }
      }
    },
    async linkAccount({ user, account }) {
        if (user.id && account) {
            const db = (await clientPromise).db(process.env.DB_NAME || 'goldsmithconnect');
            await db.collection('customers').updateOne(
                { _id: user.id },
                { $set: { authProvider: account.provider } }
            );
        }
    },
  },
  callbacks: {
    // The problematic signIn callback has been removed to allow default error handling.
    async jwt({ token, user, account }) {
        if (user) {
            token.id = user.id;
        }
        if (account) {
            token.provider = account.provider;
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
    error: '/login', // All sign-in errors, including OAuthAccountNotLinked, will redirect here
  },
});
