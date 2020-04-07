/* ************************************************************************************ */
/*     __  __           ____             _                                              */
/*    |  \/  | ___  ___|  _ \  ___   ___| |_ ___ _   _ _ __ ___   ___ ___  _ __ ___     */
/*    | |\/| |/ _ \/ __| | | |/ _ \ / __| __/ _ \ | | | '__/ __| / __/ _ \| '_ ` _ \    */
/*    | |  | |  __/\__ \ |_| | (_) | (__| ||  __/ |_| | |  \__ \| (_| (_) | | | | | |   */
/*    |_|  |_|\___||___/____/ \___/ \___|\__\___|\__,_|_|  |___(_)___\___/|_| |_| |_|   */
/*                                                                                      */
/*     index.js                                                                         */
/*                                                                                      */
/*     By: Guillaume TORRESANI <g.torresani@mesdocteurs.com>                            */
/*                                                                                      */
/*     created: 04/07/20 12:25:23 by Guillaume TORRESANI                                */
/*     updated: 04/07/20 14:22:43 by Guillaume TORRESANI                                */
/*                                                                                      */
/* ************************************************************************************ */

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const https = require('https')
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const app = express();

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

class CustomOAuth2Strategy extends OAuth2Strategy {
    userProfile (accessToken, done) {
        const req = https.get('https://recette-accounts.mesdocteurs.com/whoami?access_token=' + accessToken, res => {
            let payload = '';

            res.on('data', chunk => {
                payload += chunk;
            });

            res.on('end', () => {
                const user = JSON.parse(payload);

                done(null, user);
            });
        });

        req.on('error', err => {
            done(err)
        });

        req.end();
    }
}

const strategy = new CustomOAuth2Strategy(
    {
        authorizationURL: 'https://recette-accounts.mesdocteurs.com/oauth/authorize',
        tokenURL: 'https://recette-accounts.mesdocteurs.com/oauth/token',
        clientID: 'fa450dc29ccbdb4acb353e70a986edb8',
        clientSecret: 'a1d087984c410fc7b4680581291988449394456e13e0fd79f362e7b8ae07a008e30afab29d47a606c0f5627b9f6a3cb653de497802c00a066cd5da369b7ffe6395283e282f71e66ebf18c8620bbd8c19f9ed850475f255cb30457768a2ca26c03ec5077552266e80ca0deafcd30ecb536b260c499134f37e125ebf97dc34ece5aa95df8c4d4b41a99751b6e6a70fc8947458261a981de8d0efe9d73d2a44d7c122934414353fb268f5e8796a51f123ea89fe3b6242538ac597c89a75414e1445a95746c5d41e8603e6d3d8ab73734cb56368e206efd6a0365eb1c42d9fa587ee1a871574245f81926819462fb92cb05a6488aec11107c63ac5f218899ffd04dd',
        callbackURL: 'http://localhost:8080/auth/provider/callback',
        state: true,
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(accessToken, refreshToken, profile);

        done();
    }
);

passport.use('provider', strategy);

app.get('/', function (req, res) {
    res.send('<html lang="en"><body><a href="/auth/provider">Login</a></body></html>');
});

app.get('/auth/provider', passport.authenticate('provider', { scope: 'user.email.ro user.profile.ro user.address.ro' }));

app.get('/auth/provider/callback', passport.authenticate('provider', { successRedirect: '/', failureRedirect: '/' }));

app.listen(8080, function () {
    console.log('http://localhost:8080')
});
