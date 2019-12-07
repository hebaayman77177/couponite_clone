const passport = require("passport");
const strategy = require("passport-facebook");
const { User } = require("../models/user");

const FacebookStrategy = strategy.Strategy;

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
  passport.use(
    new FacebookStrategy(
      {
        clientID: "283512299242161",
        clientSecret: "4d9acae04a8882d50a69a7d2f48af3c4",
        callbackURL: "http://localhost:3000/api/user/auth/facebook/callback",
        enableProof: true
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOne({ facebookId: profile.id }).then(currentUser => {
          if (currentUser) {
            // already have this user
            done(null, currentUser);
          } else {
            // if not, create user in our db
            new User({
              facebookId: profile.id,
              username: profile.displayName,
              firstName: profile.name.givenName || profile.displayName,
              lastName: profile.name.familyName,
              role: "facebookUser"
              // phone: profile.id
            })
              .save()
              .then(newUser => {
                done(null, newUser);
              });
          }
        });
      }
    )
  );
};
