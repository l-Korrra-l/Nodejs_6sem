const app = require('express')();
const bodyParser = require('body-parser');
const {promisifyAll} = require('bluebird');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const sequelize = require('./DB/DBConnection');
const Sequelize = require('sequelize');
const User = require('./db/user')(sequelize, Sequelize);
const port = 3000;
const authService = require('./Services/AuthService');
const config = { 
    "host": "redis-11068.c100.us-east-1-4.ec2.cloud.redislabs.com",
    "port": 11068,
    "no_ready_check": true,
    "auth_pass": "nWTuKtgaAa46voP9srknilJoCYYvcg2q"
  };
const jwtc = {
    tokens: {
        access: {
            type: 'access',
            expiresIn: '10m',
            secret: 'access-secret'
        },
        refresh: {
            type: 'refresh',
            expiresIn: '24h',
            secret: 'refresh-secret'
        }
    }
};

promisifyAll(redis);
const client = redis.createClient({ url: 'redis://kora:kora123A1!@redis-11068.c100.us-east-1-4.ec2.cloud.redislabs.com:11068'});
(async () => {
    client.connect();
 })();
let oldRefreshKeyCount = 0;

app.use(cookieParser('my cookie key'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => 
{
    if (req.cookies.accessToken) 
    {
        jwt.verify(req.cookies.accessToken, jwtc.tokens.access.secret, (err, payload) => {
            if (err) 
            {
                next();
            }
            else if (payload) 
            {
                req.payload = payload;
                next();
            }
        });
    } else next();
});

app.get('/login', (req, res) => 
{
    res.sendFile(__dirname + '/login.html');
});

app.post('/login', async (req, res) => 
{
    const candidate = await User.findOne(
        {
        where: {
            login: req.body.username
        }
    }).catch(e => console.log(e));
    if (!candidate || !(req.body.password === candidate.password)) 
    {
        return res.sendStatus(403);
    }
    if (candidate) 
    {
        const accessToken = authService.generateAccessToken(candidate.id, candidate.login);
        const refreshToken = authService.generateRefreshToken(candidate.id, candidate.login);

        res.cookie('accessToken', accessToken, 
        {
            httpOnly: true,
            sameSite: 'strict'
        });
        res.cookie('refreshToken', refreshToken, 
        {
            httpOnly: true,
            sameSite: 'strict'
        });
        res.redirect('/resource');
    } else 
    {
        res.redirect('/login');
    }
});

app.get('/refresh-token', (req, res) => 
{
    if (req.cookies.refreshToken) 
    {
        jwt.verify(req.cookies.refreshToken, jwtc.tokens.refresh.secret, async (err, payload) => 
        {
            if (err) 
            {
                console.log(err.message);
            }
            else if (payload) 
            {
                client.on('error', (err) => console.log(`error: ${err}`));

                client.set(oldRefreshKeyCount, req.cookies.refreshToken, () => console.log('set old refresh token'));
                client.get(oldRefreshKeyCount).then( (a) => {
                    console.log(`${oldRefreshKeyCount}: result: ${a}`);
                  })
                oldRefreshKeyCount++;

                const candidate = await User.findOne({
                    where: {
                        id: payload.id
                    }
                });
                const newAccessToken = authService.generateAccessToken(candidate.id, candidate.login);
                const newRefreshToken = authService.generateRefreshToken(candidate.id, candidate.login);

                res.cookie('accessToken', newAccessToken, 
                {
                    httpOnly: true,
                    sameSite: 'strict'
                });
                res.cookie('refreshToken', newRefreshToken, 
                {
                    path: '/refresh-token'
                });
                res.redirect('/resource');
            }
        });
    } 
    else 
    {
        res.status(401).send('Please, authorize');
    }
});

app.get('/resource', (req, res) => 
{
    if (req.payload) 
    {
        res.status(200).send(`Resource ${req.payload.id}-${req.payload.login}`);
    }
    else 
    {
        res.status(401).send('Non authorized');
    }
});

app.get('/logout', (req, res) => 
{
    client.set(oldRefreshKeyCount, req.cookies.refreshToken, () => console.log('set old refresh token'));
    client.get(oldRefreshKeyCount).then( (a) => {
        console.log(`${oldRefreshKeyCount}: result: ${a}`);
      })
    oldRefreshKeyCount++;

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/login');
});

app.get('/redis', async (req, res) => 
{
    let blackList = [];
    for (let i = 0; i < oldRefreshKeyCount; i++) 
    {
        blackList.push(await client.getAsync(i))
    }

    res.status(200).send(blackList);
});

app.get('/register', (req, res) => 
{
    res.sendFile(__dirname + '/register.html');
});

app.post('/register', async (req, res) => 
{
    const candidate = await User.findOne(
        {
        where: 
        {
            login: req.body.username
        }
    }).catch(e => console.log(e));

    if (candidate) 
    {
        return res.status(400).send('The user exists');
    }

    await User.create(
        {
        login: req.body.username,
        password: req.body.password
    }).catch(e => console.log(e));

    res.redirect('/login');
});

sequelize.authenticate()
    .then(() => {
        app.listen(port, () => console.log(`http://localhost:${port}/login`));
    })
    .catch(error => console.log(error));