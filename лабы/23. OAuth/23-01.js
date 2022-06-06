const app = require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session')({resave: false, saveUninitialized: false, secret: '12345678'});

passport.use(new GoogleStrategy({
    clientID: '694048394893-1lm3153g9ijkgt7ctqujd4n67levn0h4.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, (token, refreshToken, profile, done) => done(null, {profile: profile, token: token})));

passport.serializeUser((user, done) =>
{
    console.log(user);
   done(null, user);
});
passport.deserializeUser((user, done) =>
{
    done(null, user);
});

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) =>
{
    res.sendFile(__dirname + '/login.html');
});

app.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), (req, res) =>
{
    res.redirect('/resource')
});

app.get('/resource', (req, res) =>
{
   if (req.user)
   {
       res.status(200).send(`Resource: ${req.user.profile.id}, ${req.user.profile.displayName}`);
   }
   else
   {
       res.redirect('/login');
   }
});

app.get('/logout', (req, res) =>
{
    req.logout();
    res.redirect('/login');
});

app.listen(3000, () => console.log('Server is running on http://localhost:3000/'));