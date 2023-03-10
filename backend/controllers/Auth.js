import User from "../models/UserModel.js"
import argon2 from "argon2"

//FUNCTION LOGIN DENGAN MENCARI 1 USER YANG ADA DIDATABASE BERDASARKAN INPUT, JIKA TIDAK ADA USER TAMPILAN USER TIDAK DITEMUKAN,
//JIKA ADA USER MAKA ARGON2 AKAN MEMVERIFIKASI PASSWORD USER YANG ADA DIDATABASE DENGAN INPUT,
export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    const match = await argon2.verify(user.password, req.body.password)
    if(!match) return res.status(400).json({msg: "Wrong Password"})
    req.session.userId = user.uuid
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const role = user.role
    res.status(200).json({uuid, name, email, role})
}

//FUNCTION ME MEMANGGIL USER YANG SEDANG LOGIN BERDASARKAN SESSION YANG ADA
export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon Login Ke Akun Anda"})
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId,
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    res.status(200).json(user)
}

//FUNCTION LOGOUT UNTUK MENGHAPUS SESSION
export const LogOut = (req, res) => {
    req.session.destroy((err)=> {
        if(err) return res.status(400).json({msg: "Tidak Dapat Logout"})
        res.status(200).json({msg: "Anda Telah Logout"})
    })
}