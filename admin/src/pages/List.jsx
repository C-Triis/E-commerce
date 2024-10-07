import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { currency } from '../App'
import { assets } from '../assets/assets'
import ModalEdit from '../components/ModalEdit'

const List = ({ token }) => {
  //Trạng thái danh sách
  const [list, setList] = useState([])
  //Trạng thái của modal
  const [modalIsOpen, setModalIsOpen] = useState(false)
  //Trạng thái của sản phẩm ban đầu
  const [currentProduct, setCurrentProduct] = useState(null)

  //Lấy dữ liệu từ server về
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list")
      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  //Mở modal và set dữ liệu sản phẩm
  const openModal = (product) => {
    setCurrentProduct(product)
    setModalIsOpen(true)
  }
  //Đóng modal sản phẩm
  const closeModal = () => {
    setModalIsOpen(false)
    setCurrentProduct(null)
  }
  //Xoá sản phẩm khỏi server
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        //Tải lại dữ liệu khi xoá sản phẩm
        await fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  //Tải dữ liệu sản phẩm
  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div>
      <p className='mb-5 text-2xl font-medium'>All Products List</p>
      <div className='flex flex-col gap-2 '>
        <div className='hidden md:grid md:grid-cols-[1fr_3fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 py-1 px-2 border bg-gray-100 text-sm'>
          <p><b>Image</b></p>
          <p><b>Name</b></p>
          <p><b>Category</b></p>
          <p><b>Price</b></p>
          <p><b>Edit</b></p>
          <p className='text-center'><b>Action</b></p>
        </div>
        <div className='max-h-[70vh] overflow-y-auto'>
          {
            list.map((item, index) => (
              <div key={index} className='md:grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 py-1 px-2 border text-sm'>
                <img src={item.image[0]} className='w-12' alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{currency}{item.price}</p>
                <img onClick={() => openModal(item)}
                  className='w-4 cursor-pointer'
                  src={assets.edit_icon} alt="" />
                <p onClick={() => removeProduct(item._id)}
                  className='text-right md:text-center cursor-pointer text-lg'>X</p>
              </div>
            ))
          }
        </div>
      </div>
      {
        currentProduct && (
          <ModalEdit
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            product={currentProduct}
            token={token}
            backendUrl={backendUrl}
            fetchList={fetchList}
          />
        )
      }
    </div>
  )
}

export default List