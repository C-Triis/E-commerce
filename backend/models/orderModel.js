import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, requied: true, default: "Order Placed" },
    paymentMethod: { type: String, requied: true },
    payment: { type: Boolean, requied: true, default: false },
    date: { type: Number, required: true }
})

const orderModel = mongoose.model.order || mongoose.model('order', orderSchema)

export default orderModel