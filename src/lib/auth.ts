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

        // We will add email verification logic here later
        // if (!user.emailVerified) {
        //   throw new Error('Email not verified');
        // }

        if (!user.password) {
            return null; // Can't log in with password if none is set (e.g., social account)
        }

        const passwordsMatch = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (passwordsMatch) {
            // Update last login time
            await customers.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
            
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
    // error: '/auth/error', // Optionally, create a custom error page
  },
});
