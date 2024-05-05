import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful signIn
    async signIn({ profile }) {
      // 1. Connect to database
      await connectDB();
      // 2. Check if user exists
      const userExists = await User.findOne({ email: profile.email });
      // 3. If not, then add user to database
      if (!userExists) {
        // Truncate user name if too long
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          photo: profile.picture,
        });
      }

      // 4. Return true to allow signIn
      return true;
    },

    // Modifies the session object
    async session({ session }) {
      // console.log('session before', session);  I'm confused about when the session object is created. By consoling this i think the details of the user are stored into session after the sign in callback.
      // session before {
      //   user: {
      //     name: 'Shijo Thomas',
      //     email: 'shijothomashome@gmail.com',
      //     image: 'https://lh3.googleusercontent.com/a/ACg8ocLUN6__xwZwPwRiORXaESkFblpnjtazAfLpHFqjXNfFHF8m1w=s96-c'
      //   },
      //   expires: '2024-05-19T15:11:55.938Z'
      // }

      // 1. Get user from database
      const user = await User.findOne({ email: session.user.email });
      // 2. Assign the user id to the session
      session.user.id = user._id.toString();

      // console.log("session after", session);
      // session after {
      //   user: {
      //     name: 'Shijo Thomas',
      //     email: 'shijothomashome@gmail.com',
      //     image: 'https://lh3.googleusercontent.com/a/ACg8ocLUN6__xwZwPwRiORXaESkFblpnjtazAfLpHFqjXNfFHF8m1w=s96-c',
      //     id: '662289ba59457beae7ccbc85'
      //   },
      //   expires: '2024-05-19T15:11:55.938Z'
      // }
      // 3. Return session

      return session;
    },
  },
};
