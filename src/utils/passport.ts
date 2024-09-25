import passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import dbUtils from "./db.utils";
import { Member } from "../models/members";

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // secretOrKey: "ILove_Node",
  secretOrKey: process.env.AUTH_SECRET_KEY || 'default_secret_key',  
};

const jwtStrategy = new Strategy(
  jwtOptions,
  async (playload: any, done: any) => {
    //
    try {
      const connection = await dbUtils.getDefaultConnection();
      const repo = connection.getRepository(Member);

      const member = await repo
        .createQueryBuilder("member")
        .where("member.id = :id", { id: playload.id })
        .getRawOne();

      if (member) {
        done(null, member);
      } else {
        done(null, false);
      }
    } catch (error) {
      console.error(error);
    }
  }
);

passport.use('jwt', jwtStrategy)

export default passport;