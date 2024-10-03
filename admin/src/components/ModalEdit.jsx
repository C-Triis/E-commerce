import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

Modal.setAppElement("#root")

const ModalEdit = ({ isOpen, onRequestClose, product, token, backendUrl, fetchList }) => {
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    bestseller: false,
    sizes: [],
    imagesUrl: [],
    newImages: Array(4).fill(undefined)
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        name: product.name,
        description: product.description,
        category: product.category,
        subCategory: product.subCategory,
        price: product.price,
        bestseller: product.bestseller,
        sizes: product.sizes,
        imagesUrl: product.image || [],
        newImages: Array(4).fill(undefined)
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedProduct((prev) => {
      const updatedProduct = {
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }
      return updatedProduct
    })
  }

  const handleSizeChange = (size) => {
    setEditedProduct((prev) => {
      const updatedSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
      return { ...prev, sizes: updatedSizes }
    })
  }

  const handleImageChange = (e, index) => {
    const file = e.target.files[0]
    setEditedProduct((prev) => {
      const updatedNewImages = [...prev.newImages]
      updatedNewImages[index] = file
      return {
        ...prev,
        newImages: updatedNewImages,
        imagesUrl: prev.imagesUrl.map((url, i) => i === index ? file : url)
      }
    })
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()

      formData.append('id', product._id)
      formData.append('name', editedProduct.name)
      formData.append('description', editedProduct.description)
      formData.append('category', editedProduct.category)
      formData.append('subCategory', editedProduct.subCategory)
      formData.append('price', editedProduct.price)
      formData.append('bestseller', editedProduct.bestseller)
      formData.append('sizes', JSON.stringify(editedProduct.sizes))

      editedProduct.imagesUrl.forEach((url, index) => {
        if (url) {
          formData.append(`originalImage${index + 1}`, url)
        }
      })

      editedProduct.newImages.forEach((file, index) => {
        if (file) {
          formData.append(`image${index + 1}`, file)
        }
      })

      const response = await axios.put(`${backendUrl}/api/product/update/${product._id}`, formData, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
        onRequestClose()
      } else {
        console.error('Error updating product:', response.data.message)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}
      className="w-full max-w-3xl mx-auto mt-4 bg-gray-100 p-8 rounded-lg shadow-xl z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className='flex justify-between mb-4'>
        <h2 className='text-xl cursor-pointer font-semibold'>Edit Product</h2>
        <p className='text-xl cursor-pointer font-bold text-gray-400 hover:text-gray-800' onClick={onRequestClose}>X</p>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <p className='mb-2'>Upload Image</p>
            <div className='flex gap-2'>
              {Array.from({ length: 4 }).map((_, index) => (
                <label htmlFor={`image${index}`} key={index}>
                  <img className='w-20' src={editedProduct.newImages[index]
                    ? URL.createObjectURL(editedProduct.newImages[index])
                    : (editedProduct.imagesUrl[index] ? editedProduct.imagesUrl[index] : assets.upload_area)
                  } alt="" />
                  <input type="file"
                    id={`image${index}`}
                    onChange={(e) => handleImageChange(e, index)} hidden />
                </label>
              ))}
            </div>
          </div>
          <div className='w-full mb-4'>
            <p className='mb-2'>Product name</p>
            <input
              onChange={handleChange}
              value={editedProduct.name}
              name="name"
              className='w-full max-w-[500px] px-3 py-2'
              type="text" placeholder='Type here' required />
          </div>

          <div className='w-full mb-4'>
            <p className='mb-2'>Product description</p>
            <textarea
              onChange={handleChange}
              value={editedProduct.description}
              name='description'
              className='w-full max-w-[500px] px-3 py-2'
              type="text" placeholder='Write content here' required />
          </div>

          <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
              <p className='mb-2'>Product category</p>
              <select
                onChange={handleChange}
                value={editedProduct.category}
                name='category'
                className='w-full px-3 py-2'>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div className='mb-5'>
              <p className='mb-2'>Sub category</p>
              <select
                onChange={handleChange}
                value={editedProduct.subCategory}
                name='subCategory'
                className='w-full px-3 py-2'>
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
            <div>
              <p className='mb-2'>Product Price</p>
              <input
                onChange={handleChange}
                value={editedProduct.price}
                name='price'
                className='w-full px-3 py-2 sm:w-[120px]' type="number" />
            </div>
          </div>
          <div>
            <p className='mb-2'>Product Sizes</p>
            <div className='flex gap-3'>
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div key={size}>
                  <p onClick={() => handleSizeChange(size)} 
                    className={`cursor-pointer px-3 py-1
                      ${editedProduct.sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'}`}
                  >
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className='flex gap-2 mt-4'>
            <input
              type="checkbox"
              id="bestseller"
              name="bestseller"
              checked={editedProduct.bestseller}
              onChange={handleChange} />
            <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
          </div>
          <div className='flex justify-end gap-8'>
            <button onClick={onRequestClose}
              className='px-8 py-2 bg-slate-300 hover:bg-slate-800 hover:text-white rounded-lg'>Cancel</button>
            <button type='submit'
              className='px-8 py-2 bg-slate-300 hover:bg-slate-800 hover:text-white rounded-lg'>Update</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ModalEdit;
