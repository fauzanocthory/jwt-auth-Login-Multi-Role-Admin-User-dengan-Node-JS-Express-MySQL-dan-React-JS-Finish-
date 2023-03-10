import Product from "../models/ProductModel.js"
import User from "../models/UserModel.js";
import { Op } from "sequelize"

//MEMANGGIL SEMUA PRODUCT
export const getProducts = async (req, res) => {
    try {
        let response;
//JIKA ROLE ADMIN MAKA SEMUA DATA DIPANGGIL YANG DIBUAT OLEH ADMIN DAN USER, BESERTA USER YANG MEMBUATNYA
        if (req.role === "admin") {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
//JIKA ROLE BUKAN ADMIN MAKA SEMUA DATA YANG DIBUAT OLEH USER YANG PADA SAAT INI LOGIN TAMPIL, 
//BESERTA USER YANG MEMBUATNYA
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'price'],
//BERGUNA UNTUK MEMANGGIL DATA YANG HANYA DIBUAT OLEH USER YANG MEMBUAT ATAU
//AGAR DATA ADMIN DAN USER YANG LAIN TIDAK TAMPIL
                where: {
                    userId: req.userId
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//MEMANGGIL 1 DATA
export const getProductById = async (req, res) => {
    try {
//MENDEKALARASIKAN ID YANG DICARI
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" })
//JIKA ROLE ADMIN MAKA DATA YANG DIPANGGIL BERDASARKAN ID DITAMPILKAN
        let response;
        if (req.role === "admin") {
//MENCARI DATA BERDASARKAN ID YANG SUDAH DIDEKLARASIKAN DIATAS
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        } else {
//BERGUNA UNTUK JIKA ROLE BUKAN ADMIN MENAMPILKAN 1 DATA YANG HANYA DIBUAT OLEH USER
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'price'],
//MENCARI DIMANA DATA MENGGUNAKAN OPERATOR AND (Op.and) AGAR DATA YANG TAMPIL DATA
//YANG MEMPUNYAI FOREIG KEY ID DARI USER DAN PRODUK YANG BERHUBUNGAN
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}] 
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//MEMBUAT PRODUCT
export const createProduct = async (req, res) => {

//MENGAMBIL NAME, PRICE DARI BODY/INPUT
    const { name, price } = req.body
    try {
//MENYIMPAN DATA NAME, PRICE DAN USERID/(USER YANG MEMBUAT DATA)
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        })
        res.status(201).json({ msg: "Product created succesfully" })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//MENGEDIT DATA
export const updateProduct = async (req, res) => {
    try {
//MENCARI DATA DALAM DATABASE BERDASARKAN UUID/(ID DARI PRODUCT) DAN DISIMPAN DALAM VARIABEL PRODUCT
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" })

//JIKA ROLE ADMIN MAKA SEMUA DATA DAPAT DIEDIT
        const { name, price } = req.body
        if (req.role === "admin") {
            await Product.update({name, price}, {
                where: {
                    id: product.id
                }
            })
        } else {

//JIKA ROLE BUKAN ADMIN MAKA TIDAK BISA EDIT DATA ATAU
//JIKA USERID TIDAK SAMA DENGAN USERID PADA PRODUCT YANG DICARI
            if(req.userId != product.userId) return res.status(403).json({msg: "Akses Terlarang"})
//JIKA ROLE BUKAN ADMIN ATAU USERID SAMA DENGAN USERID PADA PRODUCT YANG DICARI MAKA LAKUKAN UPDATE
            await Product.update({name, price}, {
//MENCARI DIMANA DATA YANG PRODUCTID DAN USERID NYA SAMA/BERHUBUNGAN
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}] 
                },
            });
        }
        res.status(200).json({msg: "Product Updated Succesfully"});
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

//MENGHAPUS DATA
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        })

        if (!product) return res.status(404).json({ msg: "Data tidak ditemukan" })

//JIKA ROLE ADMIN MAKA SEMUA DATA DAPAT DIHAPUS
        const { name, price } = req.body
        if (req.role === "admin") {
            await Product.destroy({
                where: {
                    id: product.id
                }
            })
        } else {

//JIKA ROLE BUKAN ADMIN ATAU USERID TIDAK SAMA DENGAN USERID PADA PRODUCT MAKA RIDAK BISA HAPUS DATA
            if(req.userId != product.userId) return res.status(403).json({msg: "Akses Terlarang"})
//JIKA ROLE BUKAN ADMIN TETAPI USERID DAN USERID PADA PRODUCT SAMA MAKA LAKUKAN HAPUS DATA
            await Product.destroy({
//MENCARI DIMANA DATA YANG PRODUCTID DAN USERID NYA SAMA/BERHUBUNGAN
                where: {
                    [Op.and]: [{id: product.id}, {userId: req.userId}] 
                },
            });
        }
        res.status(200).json({msg: "Product Deleted Succesfully"});
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}