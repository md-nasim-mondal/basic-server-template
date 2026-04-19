import bcryptjs from "bcryptjs";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { IsActive, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env";

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        if (user.isDeleted) {
          return done(null, false, { message: "User account is deleted" });
        }

        if (user.isActive !== IsActive.ACTIVE) {
          return done(null, false, { message: `User account is ${user.isActive}` });
        }

        if (!user.password) {
          const isGoogleUser = user.auths.some(
            (auth) => auth.provider === "google"
          );
          if (isGoogleUser) {
            return done(null, false, {
              message: "Please login with Google or set a password first.",
            });
          }
          return done(null, false, { message: "Authentication failed" });
        }

        const isPasswordMatched = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatched) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: "No email found from Google" });
        }

        let user = await User.findOne({ email });

        if (user) {
          if (user.isDeleted) {
            return done(null, false, { message: "User account is deleted" });
          }
          if (user.isActive !== IsActive.ACTIVE) {
            return done(null, false, { message: `User account is ${user.isActive}` });
          }
        } else {
          // Create new user if not exists
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            role: Role.SENDER, // Default role for new users
            isVerified: true,
            isActive: IsActive.ACTIVE,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ) as passport.Strategy
);

passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
