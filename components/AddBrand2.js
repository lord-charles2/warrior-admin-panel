import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useState } from 'react'
import { Autocomplete, Backdrop, Button, CircularProgress } from '@mui/material'
import { createSubCategory } from 'src/features/brand/brandService'
import { Toaster, toast } from 'react-hot-toast'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import axios from 'axios'
import { base_url } from 'utils/baseUrl'
import config from 'utils/axiosconfig'

export default function AddBrand() {
  const [backdrop, setBackdrop] = useState(false)
  const notify2 = error => toast.error(error)

  const token = Cookies.get('token')

  const [btnActive, setBtnActive] = useState(true)
  const [subUrl, setSubUrl] = useState('')
  const [collectionName, setCollectionName] = useState('')
  const [subTitle, setSubTitle] = useState('')
  const [categories, setCategories] = useState([])

  const subData = {
    name: collectionName,
    items: [
      {
        title: subTitle,
        image: subUrl
      }
    ]
  }

  console.log(subId)

  const getAdvancedCategories = async () => {
    setBackdrop(true)
    try {
      const token = Cookies.get('token')

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })
      const response = await api.get(`advancedCategory/`, config(token))

      if (response.data.success) {
        setCategories(response.data.advancedCategories)

        setBackdrop(false)
      }
      if (response.data.err == 'Not Authorized token expired, Please Login again') {
        notify2(response.data.err)
      }
    } catch (err) {
      console.log(err)
      if (err.message == 'Network Error') {
        notify2(err.message)
        setBackdrop(false)
      }
    }
  }

  useEffect(() => {
    getAdvancedCategories()
  }, [])

  const handleAddProductDetails = () => {
    setBtnActive(false)
    createSubCategory(subData, token, setBtnActive, subId)
  }

  const handleCategoryChange = (event, value) => {
    // Check if a category is selected (value is not null)
    if (value) {
      // Update subId with the _id of the selected category
      setSubId(value._id)
    } else {
      // If no category is selected, set subId to null
      setSubId(null)
    }
  }

  return (
    <>
      <Typography variant='h5' gutterBottom>
        SubCategory details
      </Typography>
      <Toaster />

      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={backdrop}>
        <CircularProgress color='inherit' />
      </Backdrop>

      <Grid>
        <Autocomplete
          id='multiple-select'
          sx={{ width: 300 }}
          options={categories}
          getOptionLabel={option => option.title}
          onChange={handleCategoryChange}
          renderInput={params => (
            <TextField
              {...params}
              label='Parent Category'
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password'
              }}
            />
          )}
        />
      </Grid>

      <Grid item xs={12} md={8} className='p-4'>
        <TextField
          required
          id='Collection Name'
          label='Collection Name'
          helperText='unique'
          variant='standard'
          value={collectionName}
          onChange={event => setCollectionName(event.target.value)}
        />
      </Grid>

      <Grid item xs={12} md={8} className='p-4'>
        <TextField
          required
          id='SubCategory title'
          label='SubCategory title'
          helperText='unique'
          variant='standard'
          value={subTitle}
          onChange={event => setSubTitle(event.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={8} className='p-4'>
        <TextField
          required
          id='suburl'
          label='SubCategory url'
          variant='standard'
          value={subUrl}
          onChange={event => setSubUrl(event.target.value)}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox color='secondary' name='saveAddress' value='yes' />}
          label='Make sure all inputs are correct'
        />
        <Button
          variant='contained'
          onClick={handleAddProductDetails}
          sx={{ alignItems: 'center', ml: 25 }}
          sm={{ mt: 3, ml: 1 }}
          disabled={btnActive ? false : true}
        >
          {btnActive ? 'Add Details' : 'please wait...'}
        </Button>
      </Grid>
    </>
  )
}

const colors = [
  { name: 'red', hex: '#FF0000' },
  { name: 'green', hex: '#00FF00' },
  { name: 'blue', hex: '#0000FF' },
  { name: 'black', hex: '#000000' },
  { name: 'white', hex: '#FFFFFF' },
  { name: 'yellow', hex: '#FFFF00' },
  { name: 'purple', hex: '#800080' },
  { name: 'gray', hex: '#808080' },
  { name: 'cyan', hex: '#00FFFF' },
  { name: 'lime', hex: '#00FF00' },
  { name: 'gold', hex: '#FFD700' },
  { name: 'silver', hex: '#C0C0C0' },
  { name: 'indigo', hex: '#4B0082' },
  { name: 'violet', hex: '#EE82EE' },
  { name: 'beige', hex: '#F5F5DC' },
  { name: 'khaki', hex: '#F0E68C' },
  { name: 'orchid', hex: '#DA70D6' },
  { name: 'plum', hex: '#DDA0DD' },
  { name: 'pink', hex: '#FFC0CB' },
  { name: 'brown', hex: '#A52A2A' },
  { name: 'turquoise', hex: '#40E0D0' },
  { name: 'navy', hex: '#000080' },
  { name: 'lavender', hex: '#E6E6FA' },
  { name: 'maroon', hex: '#800000' },
  { name: 'teal', hex: '#008080' },
  { name: 'magenta', hex: '#FF00FF' },
  { name: 'olive', hex: '#808000' },
  { name: 'salmon', hex: '#FA8072' },
  { name: 'crimson', hex: '#DC143C' },
  { name: 'coral', hex: '#FF7F50' },
  { name: 'sienna', hex: '#A0522D' },
  { name: 'firebrick', hex: '#B22222' },
  { name: 'chocolate', hex: '#D2691E' },
  { name: 'peru', hex: '#CD853F' },
  { name: 'tan', hex: '#D2B48C' },
  { name: 'rosybrown', hex: '#BC8F8F' },
  { name: 'cadetblue', hex: '#5F9EA0' },
  { name: 'skyblue', hex: '#87CEEB' },
  { name: 'steelblue', hex: '#4682B4' },
  { name: 'midnightblue', hex: '#191970' },
  { name: 'navajowhite', hex: '#FFDEAD' },
  { name: 'saddlebrown', hex: '#8B4513' },
  { name: 'goldenrod', hex: '#DAA520' },
  { name: 'darkgoldenrod', hex: '#B8860B' },
  { name: 'magenta pink', hex: '#FF66FF' },
  { name: 'baby blue', hex: '#89CFF0' },
  { name: 'sage green', hex: '#BCB88A' },
  { name: 'deep sea blue', hex: '#0077BE' },
  { name: 'burnt orange', hex: '#CC5500' },
  { name: 'electric purple', hex: '#BF00FF' },
  { name: 'hunter green', hex: '#355E3B' },
  { name: 'dusty rose', hex: '#DCAE96' },
  { name: 'ocean blue', hex: '#4F42B5' },
  { name: 'brick red', hex: '#8B0000' },
  { name: 'pastel yellow', hex: '#FDFD96' },
  { name: 'navy blue', hex: '#000080' },
  { name: 'seafoam green', hex: '#8FE5B5' },
  { name: 'olive green', hex: '#808000' },
  { name: 'dusty blue', hex: '#6699CC' },
  { name: 'blush pink', hex: '#FFB6C1' },
  { name: 'dark teal', hex: '#008080' },
  { name: 'lilac', hex: '#C8A2C8' },
  { name: 'burgundy', hex: '#800020' }
]
