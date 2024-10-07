import userModel from "../models/userModel.js"

//Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body

        //Tìm user bằng id - lean() giúp cải thiện hiệu suất
        const userData = await userModel.findById(userId).lean()
        let cartData = await userData.cartData

        //Kiểm tra sản phẩm có trong giỏ hàng hay không
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        //Update thông tin dựa vào userId
        await userModel.findByIdAndUpdate(userId, { cartData })

        res.json({ success: true, message: "Add To Cart" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Cập nhật giỏ hàng
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId).lean()
        let cartData = await userData.cartData

        //Cập nhật size sản phẩm
        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({ success: true, message: "Cart Update" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Lấy dữ liệu giỏ hàng người dùng
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId).lean()
        let cartData = await userData.cartData

        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//Clear giỏ hàng
const clearCart = async (req, res) => {
    try {
        const { userId } = req.body
        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Giỏ hàng đã được làm trống" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart, clearCart }