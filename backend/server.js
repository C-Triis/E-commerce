import experss from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routers/userRoute.js"
import productRouter from "./routers/productRoute.js"
import cartRouter from "./routers/cartRoute.js"
import orderRouter from "./routers/orderRoute.js"

const app = experss()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(experss.json())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send("API working")
})

app.use('*', (req, res) => {
    console.log('Unhandled route:', req.method, req.originalUrl);
    res.status(404).json({ message: 'Route not found' });
  });

app.listen(port, () => {
    console.log("Server stared on PORT: " + port);
    
})
export default app;