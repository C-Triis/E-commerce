import { v2 as cloudinary } from "cloudinary"
import productModel from '../models/productModel.js'

//Thêm sản phẩm mới
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter(item => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                //upload ảnh lên cloudinary
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            subCategory,
            price: Number(price),
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData)
        await product.save()

        res.json({ success: true, message: " Product Model" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//Danh sách sản phẩm
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ date: -1 }).lean()
        res.json({ success: true, products })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//Xoá sản phẩm 
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id).lean()
        res.json({ success: true, message: "Product Removed" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Sản phẩm đơn
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body
        const product = await productModel.findById(productId).lean()
        res.json({ success: true, product })
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message })
    }
}


//Cập nhật sản phẩm
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const updateData = {}
        //Kiểm tra dữ liệu
        if (name) updateData.name = name
        if (description) updateData.description = description
        if (category) updateData.category = category
        if (subCategory) updateData.subCategory = subCategory
        if (price) updateData.price = Number(price)
        if (bestseller !== undefined) updateData.bestseller = bestseller === "true"
        if (sizes) updateData.sizes = JSON.parse(sizes)

        //Loại bỏ các giá trị falsy ảnh cũ lúc ban đầu
        const originalImages = [
            req.body.originalImage1,
            req.body.originalImage2,
            req.body.originalImage3,
            req.body.originalImage4
        ].filter(Boolean)

        //Những tệp nào không tồn tại hoặc không được tải lên sẽ bị loại bỏ
        const newImages = [
            req.files?.image1 && req.files.image1[0],
            req.files?.image2 && req.files.image2[0],
            req.files?.image3 && req.files.image3[0],
            req.files?.image4 && req.files.image4[0]
        ].filter(Boolean)

        let imagesUrl = [...originalImages]

        //Kiểm tra hình ảnh mới và tải ảnh lên cloudinary
        if (newImages.length > 0) {
            const newImagesUrl = await Promise.all(
                newImages.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                    return result.secure_url
                })
            )
            imagesUrl = [...imagesUrl, ...newImagesUrl]
        }
        if (imagesUrl.length > 0) {
            updateData.image = imagesUrl
        }

        const product = await productModel.findByIdAndUpdate(
            productId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean()
        res.json({ success: true, message: "Product updated successfully" ,product })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message })
    }
}


export { singleProduct, listProduct, addProduct, removeProduct, updateProduct }