
const _ = require('lodash');
const config = require('config');
const { User } = require('../models/user');

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy(
    {
        clientID: '64947322824-ioam0huh3b5ld40b4rp2rb8fd9qgnb6q.apps.googleusercontent.com',
        clientSecret: 'oqGJdSWRaGenO1kPT9ostOF6',
        callbackURL: "http://localhost:3000/api/user/auth/google/callback"
    }
    //googleConfig
    ,
    async function (accessToken, refreshToken, profile, done) {
        try {
            function firstVerifiedemail(profile) {

                for (let i = 0; i < profile.emails.length; i++) {

                    if (profile.emails[i].verified)
                        return profile.emails[i].value;
                }
            }

            const user = await User.findOne({ email: firstVerifiedemail(profile) });
            // if user exist its fine
            if (user) {
                return done(null, user);
            } else {
                const userData = {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    email: profile.emails[0].value,
                    role: 'googleUser',
                    googleId: profile.id
                }

                const newUser = new User(userData);
                //create user
                await newUser.save();
                return done(null, newUser);
            }
        } catch (err) {
            done(err);
        }
    }
));


function googleCallBack(req, res, next) {
    // if user is found this handler is responsible for 
    // creating the token
    // and customizing error messages.
    passport.authenticate(
        'google',
        { session: false }, (err, user, info) => {

            //console.log('here iam :', profile);

            if (err) {
                console.log(err);
                res.statusCode = 500;
                return next(err);
                // return res.json({
                //     message: 'connection error',
                //     error: err
                // });

            } if (!user) {
                res.statusCode = 401;
                console.log(info);
                //next(new Error(info.message));
                return res.json({ message: info.message })
            }
            res.json({
                user: user,
                token: 'generate token'
            });

        })(req, res, next)

}
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


module.exports = {
    authenticateWithGoogle:
        passport.authenticate('google', { scope: ['email profile'] }),
    googleCallBack: googleCallBack
}