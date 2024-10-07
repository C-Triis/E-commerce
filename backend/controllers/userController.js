import validator from "validator"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js"

//Tạo token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//Đăng nhập
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email }).lean()

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }
        //Giải mã mật khẩu
        const isMatch = await bcrypt.compare(password, user.password)
        //Kiểm tra mật khẩu và tạo token
        if (isMatch) {
            const token = createToken(user._id)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


//Tạo tài khoản
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const exists = await userModel.findOne({ email })

        //Kiểm tra xem email đã tồn tại hay chưa
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }
        //Kiểm tra email có đúng hay không
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }
        //Kiểm tra password có đủ điều kiện hay không
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        
        //Chỉnh sửa mã hoá mật khẩu
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })

        //Lưu người dùng
        const user = await newUser.save()

        const token = createToken(user._id)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//admin
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        //Kiểm tra thông tin của admin
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password,process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export { loginUser, registerUser, adminLogin }