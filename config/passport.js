const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./database.js');

module.exports = function (passport) {
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CLIENT_CALLBACKURL
        },
        async (accessToken, refreshToken, profile, done) => {
            const user = {
                username: profile.username.toLowerCase(),
                displayName: profile.displayName,
                email: profile.email
            }

            try {
                let found = await mongodb.getDatabase().db().collection('users')
                    .findOne({username: profile.username.toLowerCase()});
                if (found) {
                    done(null, user)
                } else {
                    await mongodb.getDatabase().db().collection('users').insertOne(user);
                    done(null, user)
                }

            } catch (err) {
                console.error(err);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.username);
    });

    passport.deserializeUser(async (username, done) => {
        const found = await mongodb.getDatabase().db().collection('users')
            .findOne({username: username});
        done(null, found);
    });
}