import orderModel from '../models/orderModel.js'
import userModel from '../models/userModel.js'

//Đặt hàng 
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        //Tạo đơn hàng mới và lưu đơn hàng
        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cardData: {} }).lean()
        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Tất cả đơn hàng
const allOrders = async (req, res) => {
    try {
        //Tìm hết tất cả đơn hàng
        const orders = await orderModel.find({}).lean()
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Đơn hàng của người dùng
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId }).lean()
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


//Cập nhật trạng thái của đơn hàng
const updateStatus = async (req, res) => {
    try {
        const {orderId, status} = req.body
        await orderModel.findByIdAndUpdate(orderId, {status}).lean()
        res.json({success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export { placeOrder, allOrders, userOrders, updateStatus }