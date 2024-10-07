import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

    const currency = "$"
    const delivery_fee = 10
    //Đường dẫn của backend
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://e-backend-indol.vercel.app"

    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [products, setProducts] = useState([])
    const [token, setToken] = useState("")

    const [cartItems, setCartItems] = useState({})
    const navigate = useNavigate()

    //Thêm sản phẩm vào giỏ hàng
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Products Size")
            return
        }
        //StructuredClone Copy cartItem và lưu thông vào cartData 
        let cartData = structuredClone(cartItems)
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
        setCartItems(cartData)
        //Kiểm tra nếu token đúng thì thêm vào cart
        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })
                toast.success("Product Add To Cart Suucess")

            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }
    //Lấy số lượng sản phẩm trong cart
    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalCount
    }
    //Cập nhật số lượng sản phẩm khi tăng hoặc giảm
    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems)
        cartData[itemId][size] = quantity
        setCartItems(cartData)
        //Nếu token đúng thì cập nhật dữ liệu lên database
        if (token) {
            try {
                await axios.post(backendUrl + "/api/cart/update", { itemId, size, quantity }, { headers: { token } })
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    }
    //Lấy tổng số tiền ở trong cart
    const getCartAmount = () => {
        let totalAmount = 0
        for (const items in cartItems) {
            //Tìm thông tin sản phẩm bằng id
            let itemInfo = products.find(product => product._id === items)
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item]) {
                        //Tính tiền tổng sản phẩm
                        totalAmount += itemInfo.price * cartItems[items][item]
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return totalAmount
    }
    //Lấy dữ liệu sản phẩm
    const getProductsData = async () => {
        try {
            //Đường dẫn dữ liệu từ database
            const response = await axios.get(backendUrl + "/api/product/list")
            if (response.data.success) {
                setProducts(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }
    //Lấy thông tin của giỏ hàng người dùng
    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } })
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    //Tải sản phẩm người dùng
    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem("token"))
        }
    }, [])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate,
        backendUrl, token, setToken
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider