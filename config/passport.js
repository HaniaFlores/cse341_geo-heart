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
                githubId: profile.id,
                username: profile.username,
                name: profile.displayName,
                email: profile.email
            }

            try {
                let found = await mongodb.getDatabase().db().collection('users').findOne({githubId: profile.id});
                if (found) {
                    done(null, user)
                } else {
                    let created = await mongodb.getDatabase().db().collection('users').insertOne(user);
                    done(null, created)
                }

            } catch (err) {
                console.error(err);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        const found = await mongodb.getDatabase().db().collection('users')
            .findOne({githubId: id});
        done(null, found);
    });
}