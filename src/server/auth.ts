import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import GitHub from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google";

export const { handlers, auth, signOut } = NextAuth({ 
    providers: [
        Discord({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    ],
    /*callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const admin_email = process.env.ADMIN_EMAILS!.split(' ');
            return admin_email.includes(user.email!);
        }
    }*/
});