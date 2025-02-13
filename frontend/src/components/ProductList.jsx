import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const ProductList = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProducts()
    }, [])

    const getProducts = async () => {
        const response = await axios.get(process.env.REACT_APP_API_URL+'/products')
        setProducts(response.data)
    }

    const deleteProduct = async (productId) => {
        await axios.delete(process.env.REACT_APP_API_URL`/products/${productId}`)
        getProducts()
    }
    return (
        <div>
            <h1 className='title'>Products</h1>
            <h2 className='subtitle'>List Of Products</h2>
            <Link to="/products/add" className='button is-primary mb-2'>Add New</Link>
            <table className='table is-stripped is-fullwidth'>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Created By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        return <tr key={product.uuid}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.user.name}</td>
                            <td>
                                <Link to={`/products/edit/${product.uuid}`} className="button is-small is-info">Edit</Link>
                                <button onClick={() => deleteProduct(product.uuid)} className="button is-small is-danger">Delete</button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ProductList