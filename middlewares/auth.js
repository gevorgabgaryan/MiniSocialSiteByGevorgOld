const passport = require('passport');
const {UserModel} = require('../models/UserModel');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const dotenv=require("dotenv")
dotenv.config()

const cookieExtractor = function(req) {
        let  token = null;
        if (req && req.signedCookies) token = req.signedCookies['jwt'];
           return token;
    };

passport.use(new JWTStrategy({
            //   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
              jwtFromRequest:cookieExtractor,
              secretOrKey: process.env.jwtSecret
            }, 
            function (jwtPayload, done) {
                      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
                      return UserModel.findOne({_id:jwtPayload.id})
                          .exec((err,user)=>{        
                                   if (err) {
                                    return done(err, false);
                                }
                                if (user) {
                               
                                    return done(null, user);
                                } else {
                                    return done(null, false);
                                        }
                          })
                })      
    )
            
    
module.exports = {
  initialize: passport.initialize(),
 passport:passport
 
};
