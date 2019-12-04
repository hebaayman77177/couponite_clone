
//const _ = require('lodash');
const config = require('config');

//const app = express();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy(config.get('google'),
    function (accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return done(err, user);
        // });

        // create user
        // make token 
        // send user + token 

        //console.log('profile :', profile);
        //console.log('access token :', accessToken);
        //console.log('refresh token :', refreshToken);
        return done(null, profile);
        //return done(null , false, {message: 'some thing wrong  occured'});
        //return done(new Error('connection error'), false);
    }
));

app.use(passport.initialize());
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback

function googleCallBack(req, res, next) {

    passport.authenticate(
        'google',
        { session: false }, (err, profile, info) => {

            //console.log('here iam :', profile);

            if (err) {
                console.log(err);
                res.statusCode = 500;
                return res.json({
                    message: 'connection error'
                });
            
            }if(! profile){
                    res.statusCode = 401;
                    console.log(info);
                    //next(new Error(info.message));
                    return res.json({ message: info.message })
            }

                //req.user = profile;
                //next();
                res.json({ user: profile });

        })(req, res, next)

}


// app.get('/auth/google',
//     passport.authenticate('google', { scope: ['email profile'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.


// app.get('/auth/google/callback', authenticateWithGoogle);

module.exports = {
    authenticateWithGoogle: 
    passport.authenticate('google', { scope: ['email profile'] }),

    googleCallBack: googleCallBack
}