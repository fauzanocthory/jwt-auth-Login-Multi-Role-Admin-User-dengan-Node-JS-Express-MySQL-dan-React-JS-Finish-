import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/Users.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

//ROUTE UNTUK MEMANGGIL USER, LOGIN, UPDATE DAN LOGOUT BESERTA PARSING FUNCTION 
//VERIFYUSER (UNTUK MEMVERIFIKASI APAKAH USER SUDAH LOGIN)
//DAN PARSING FUNCTION ADMINONLY (UNTUK MEMVALIDASI APAKAH USER YANG LOGIN ROLE NYA ADMIN ATAU BUKAN)
//KALAU ROLE ADMIN MAKA DAPAT MENGAKSES GETUSER
router.get('/users', verifyUser, adminOnly, getUsers)
router.get('/users/:id', verifyUser, adminOnly, getUserById)
router.post('/users', verifyUser, adminOnly, createUser)
router.patch('/users/:id', verifyUser, adminOnly, updateUser)
router.delete('/users/:id', verifyUser, adminOnly, deleteUser)

export default router