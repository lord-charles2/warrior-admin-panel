import axios from 'axios'
import { base_url } from 'utils/baseUrl'
import config from 'utils/axiosconfig'
import { toast } from 'react-hot-toast'

const notify = message => toast.success(message)
const notify2 = message => toast.error(message)

export const getProductCategories = async () => {
  const response = await axios.get(`${base_url}advancedCategory/`)

  return response.data
}

export const createCategory = async (
  category,
  token,
  setSuccessRateCategory,
  setSuccessRateCategory2,
  handleNextPage,
  setBtnActive
) => {
  try {
    setBtnActive(false)

    const api = axios.create({
      baseURL: base_url,
      headers: config(token).headers
    })
    console.log(token)
    const response = await api.post('advancedCategory/', category, config(token))
    console.log(response)
    if (response.data.success) {
      notify('Category added successfully')
      setSuccessRateCategory(true)
      setSuccessRateCategory2(true)

      setTimeout(() => {
        handleNextPage()
      }, 3000)
      setBtnActive(true)
    }
    if (response.data.err == 'Not Authorized token expired, Please Login again') {
      notify2(response.data.err)
      setSuccessRateCategory(false)
      setSuccessRateCategory2(false)
      setBtnActive(true)
    }

    return response.data
  } catch (err) {
    if (err.response?.data.message == 'Category added successfully') {
      return (
        notify(err.response.data.message),
        setSuccessRateCategory(true),
        setSuccessRateCategory2(true),
        setTimeout(() => {
          handleNextPage()
        }, 3000),
        setBtnActive(true)
      )
    }
    if (err.response?.data.message == 'Product not found') {
      notify2(err.response.data.message)
      setSuccessRateCategory(false)
      setBtnActive(true)
    }
    if (err.message == 'Network Error') {
      setSuccessRateCategory2(false)
      handleNextPage()
      setBtnActive(true)
    }

    console.log(err)
  }
}

export const getProductCategory = async id => {
  const response = await axios.get(`${base_url}advancedCategory/${id}`, config)

  return response.data
}

export const deleteProductCategory = async (id, token, setBtnActive, getCategories, handleClose) => {
  try {
    const api = axios.create({
      baseURL: base_url,
      headers: config(token).headers
    })
    console.log(token)
    const response = await api.delete(`${base_url}advancedCategory/${id}`, config(token))
    if (response.data.err == 'Not Authorized token expired, Please Login again') {
      return notify2('Token expired, please login again as Admin to continue!'), setBtnActive(true)
    }
    if (response.data.message == 'Advanced category deleted') {
      return (
        notify('category deleted successfully!'),
        getCategories(),
        setBtnActive(true),
        setTimeout(() => {
          handleClose()
        }, 1500)
      )
    }
  } catch (err) {
    console.log(err)
  }

  return response.data
}

export const updateProductCategory = async (categoryData, id, token, setBtnActive, getCategories, handleClose) => {
  try {
    const api = axios.create({
      baseURL: base_url,
      headers: config(token).headers
    })
    console.log(token)
    const response = await api.patch(`${base_url}advancedCategory/${id}`, categoryData, config(token))
    if (response.data.err == 'Not Authorized token expired, Please Login again') {
      return notify2('Token expired, please login again as Admin to continue!'), setBtnActive(true)
    }
    if (response.data.message == 'success') {
      return (
        notify('category updated successfully!'),
        getCategories(),
        setBtnActive(true),
        setTimeout(() => {
          handleClose()
        }, 1500)
      )
    }
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}
