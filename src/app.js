import express from "express";
import handlebars from 'express-handlebars';
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import { Server } from 'socket.io';
import config from './config.js';
import './persistencia/dao/dbConfig.js';
import './passport/passportStrategies.js'
import { __dirname } from "./utils.js";
import passport from 'passport';

import viewsRouter from './routes/views.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import loginRouter from './routes/login.router.js';
import currentRouter from './routes/current.router.js';

//socketservers
import socketCart from "./listeners/socketCart.js";
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';

const app = express();
const PORT = config.port;
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars',handlebars.engine())
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

app.use(cookieParser('SecretKeyCookies'))


app.use(session({
    store: new MongoStore({
        mongoUrl: config.mongo_uri
    }),
    secret: config.session_secret,
    cookie: {maxAge:1200000}
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/',viewsRouter)
app.use('/api/auth',loginRouter)
app.use('/api/carts',cartsRouter)
app.use('/api/products',productsRouter)
app.use('/api/current',currentRouter)


const httpServer = app.listen(PORT)
console.log(`Escuchando al puerto ${PORT}`);

const socketServer = new Server(httpServer)

socketCart(socketServer)
socketProducts(socketServer)
socketChat(socketServer)