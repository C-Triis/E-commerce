import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { currency } from '../App'
import { assets } from '../assets/assets'
import ModalEdit from '../components/ModalEdit'
import ModalDelete from '../components/ModalDelete'

const List = ({ token }) => {
  //Trạng thái danh sách
  const [originalList, setOriginalList] = useState([])
  const [list, setList] = useState([])
  //Trạng thái của modal
  const [modalIsOpen, setModalIsOpen] = useState(false)
  //Trạng thái của sản phẩm ban đầu
  const [currentProduct, setCurrentProduct] = useState(null)
  //Delete modal 
  const [deleteModal, setDeleteModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState(null)

  //Search products
  const [search, setSearch] = useState('')
  //Phân trang
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPage] = useState(8)

  const handlSearch = (searchValue) => {
    setSearch(searchValue)
    const filteredList = originalList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()))
    setList(filteredList)
    setCurrentPage(1)
  }
  //Lấy dữ liệu từ server về
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list")
      if (response.data.success) {
        setOriginalList(response.data.products)
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
  //Modal delete
  const openDeleteModal = (id) => {
    setDeleteModal(true)
    setSelectedProductId(id)
  }
  const closeDeleteModal = () => {
    setDeleteModal(false)
    setSelectedProductId(null)
  }
  //Xoá sản phẩm khỏi server
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/remove", { id: selectedProductId }, { headers: { token } })
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
    } finally {
      closeDeleteModal()
    }
  }
  //Tải dữ liệu sản phẩm
  useEffect(() => {
    fetchList()
  }, [])
  //Tính sản phẩm phân trang
  const indexOfLastItem = currentPage * itemsPage
  const indexOfFirstItem = indexOfLastItem - itemsPage
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem)
  //Tính tổng số trang
  const totalPages = Math.ceil(list.length / itemsPage)

  return (
    <div>
      <div className='flex justify-between'>
        <p className='mb-5 text-2xl font-medium'>All Products List</p>
        <input 
        placeholder='Search'
        type="text" value={search} 
        onChange={(e) => handlSearch(e.target.value)} 
        className='h-8 outline-none px-2' />
      </div>
      <div className='flex flex-col gap-2 '>
        <div className='hidden md:grid md:grid-cols-[1fr_3fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 py-1 px-2 border bg-gray-100 text-sm'>
          <p><b>Image</b></p>
          <p><b>Name</b></p>
          <p><b>Category</b></p>
          <p><b>Price</b></p>
          <p><b>Edit</b></p>
          <p className='text-center'><b>Action</b></p>
        </div>
        <div className='max-h-[65vh]'>
          {
            currentItems.map((item, index) => (
              <div key={index} className='md:grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_0.5fr_0.5fr] items-center gap-2 py-1 px-2 border text-sm '>
                <img src={item.image[0]} className='w-12' alt="" />
                <p>{item.name}</p>
                <p className='px-1'>{item.category}</p>
                <p className='px-1'>{currency}{item.price}</p>
                <div className='px-1'>
                  <img onClick={() => openModal(item)}
                    className='w-4 cursor-pointer'
                    src={assets.edit_icon} alt="" />
                </div>
                <p onClick={() => openDeleteModal(item._id)}
                  className='text-right md:text-center cursor-pointer text-lg'>
                  X
                </p>
              </div>
            ))
          }
        </div>
      </div>
      <div className='flex justify-between mt-5'>
        <button
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className='px-4 py-2 bg-[#ffebf5] text-gray-700 font-medium rounded disabled:bg-gray-400 disabled:text-white'>
          Before
        </button>
        <p>Page {currentPage} / {totalPages}</p>
        <button
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className='px-4 py-2 bg-[#ffebf5] text-gray-700 font-medium rounded disabled:bg-gray-400 disabled:text-white'>
          After
        </button>
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
      {
        <ModalDelete
          isOpen={deleteModal}
          onRequestClose={closeDeleteModal}
          onConfirm={removeProduct}
        />
      }
    </div>
  )
}

export default List