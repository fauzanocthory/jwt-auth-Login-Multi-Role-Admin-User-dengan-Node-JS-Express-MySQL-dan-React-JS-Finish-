import User from "../models/UserModel.js"

//VERIFIKASI USER APAKAH SESI SUDAH ADA
export const verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon Login Ke Akun Anda"})
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId,
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    req.userId = user.id;
    req.role = user.role;
    next();
}

//DEKLARASIKAN SESI UNTUK ADMIN, APABILA ROLE ADMIN MAKA ROUTE YANG DI OTORISASI 
//ATAU DIDEKLARASIKAN FUNCTION ADMINONLY DAPAT MENGAKSESNYA, DAN APABILA ROLE BUKAN ADMIN TIDAK DAPAT MENGAKSESNYA
//(HANYA UNTUK YANG DIDEKLARASIKAN FUNCION ADMINONLY PADA ROUTER)
export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId,
        }
    })
    if (!user) return res.status(404).json({ msg: "User Tidak Ditemukan" })
    if(user.role != "admin") return res.status(404).json({ msg: "Akses Terlarang" })
    next();
}