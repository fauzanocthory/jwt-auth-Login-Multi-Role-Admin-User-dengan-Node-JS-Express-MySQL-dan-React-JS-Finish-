import express from "express";
import {
    Login,
    LogOut,
    Me
} from "../controllers/Auth.js"

const router = express.Router();

//ROUTE UNTUK MENAMPILKAN USER SEDANG LOGIN
router.get('/me', Me)
//ROUTE UNTUK LOGIN
router.post('/login', Login)
//ROUTE UNTUK LOGOUT DARI SESI
router.delete('/logout', LogOut)

export default router