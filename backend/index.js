import express from "express"
import cors from "cors"
import session from "express-session"
import dotenv from "dotenv"
import db from "./config/Database.js"
import SequelizeStore from "connect-session-sequelize"
import UserRoute from "./routes/UserRoute.js"
import ProductRoute from "./routes/ProductRoute.js"
import AuthRoute from "./routes/AuthRoutes.js"
dotenv.config()

const app = express()
app.use(express.json())

const sessionStore = SequelizeStore(session.Store)
const store = new sessionStore({
    db: db
})
// SEMICOLON ; ADA KARENA BEBERAPA Error, 
// SOLUSI ADA DI https://github.com/expressjs/express/issues/3515#issuecomment-353738007
store.sync();
db.sync();
// ;(async()=> {
//      await db.sync();
// }()
// async ()=> await db.sync();

app.use(cors({
    credentials: true,
    origin: 'http://192.168.100.90:3000'
}))



// ^^^^^^^^^^^^
// UNTUK MEMBUAT TABLE PADA DATABASE
app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(UserRoute)
app.use(ProductRoute)
app.use(AuthRoute)

// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...')
});