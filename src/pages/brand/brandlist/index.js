// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TablePagination from '@mui/material/TablePagination'
import { toast, Toaster } from 'react-hot-toast'
import config from 'utils/axiosconfig'
import { base_url } from 'utils/baseUrl'
import Chip from '@mui/material/Chip'
import axios from 'axios'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { Button, Divider } from '@mui/material'
import { LinearProgress } from '@mui/material'

import Cookies from 'js-cookie'
import React, { Fragment, useEffect, useState, forwardRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Image from 'next/image'
import menu from '/public/images/menu.svg'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

const notify2 = message => toast.error(message)
const notify = message => toast.success(message)

const Transition2 = React.forwardRef(function Transition2(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const TableCustomized = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sub, setFlash] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [subId, setsubId] = useState('')
  const [backdrop, setBackdrop] = useState(false)
  const [inActive, setInactiveStatus] = useState(false)
  const [allflash, setallflashStatus] = useState(false)

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [viewCategoryName, setViewCategoryName] = useState('')

  const [date, setDate] = useState(null)
  const [date2, setDate2] = useState(null)
  const [subTitle, setSubTitle] = useState('')
  const [btnActive, setBtnActive] = useState(true)
  const [collectionName, setcollectionName] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialog2, setOpenDialog2] = useState(false)
  const [image, setImage] = useState('')

  const subData = {
    items: [
      {
        title: subTitle,
        image: image
      }
    ],
    name: collectionName
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const getSubCategory = async id => {
    setBackdrop(true)
    try {
      const token = Cookies.get('token')

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })
      const response = await api.get(`advancedCategory/sub/${id}`, config(token))

      console.log(response.data.advancedCategory)

      if (response.data.success) {
        setSubCategories(response.data.advancedCategory)
        response.data.advancedCategory.length < 1 ? setInactiveStatus(true) : null

        setBackdrop(false)
      }
      if (response.data.err == 'Not Authorized token expired, Please Login again') {
        notify2(response.data.err)
      }

      // console.log(response)
    } catch (err) {
      console.log(err)
      if (err.message == 'Network Error') {
        notify2(err.message)
        setBackdrop(false)
      }
    }
  }

  const getSingleSub = async id => {
    handleOpen()
    try {
      const token = Cookies.get('token')

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })

      const myPromise = new Promise(async (resolve, reject) => {
        try {
          const response = await api.get(`advancedCategory/sub/single/${id}`, config(token))
          console.log(response)

          if (response.data.success) {
            resolve()
            setSubTitle(response.data.advancedSubcategory?.items[0]?.title)
            setcollectionName(response.data.advancedSubcategory?.name)
            setImage(response.data.advancedSubcategory?.items[0]?.image)
          }
          if (response.data.err == 'Not Authorized token expired, Please Login again') {
            notify2(response.data.err)
          }
        } catch (error) {
          if (error) reject()
        }
      })
      toast.promise(myPromise, {
        pending: 'Fetching and populating sub sale data...',
        success: 'populating complete 🎉 ',
        error: 'something went wrong'
      })
    } catch (err) {
      console.log(err)
      if (err.message == 'Network Error') {
        notify2(err.message)
      }
    }
  }

  const handleSubUpdate = async id => {
    setBtnActive(false)
    try {
      const token = Cookies.get('token')

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })
      const response = await api.patch(`advancedCategory/sub/${id}/`, subData, config(token))
      console.log(response)
      if (response.data.success) {
        getAdvancedCategories()
        notify('SubCategory sale updated successfully')
        setInterval(() => {
          setOpen(false)
        }, 1500)
        setBtnActive(true)
      }
      if (response.data.err == 'Not Authorized token expired, Please Login again') {
        notify2(response.data.err)
        setBtnActive(true)
      }
      console.log(response)
    } catch (err) {
      console.log(err)
      if (err.message == 'Network Error') {
        notify2(err.message)
        setBtnActive(true)
      }
      if (
        err.response?.data?.message === 'Start time must be in the future' ||
        err.response?.data?.message === 'End time must be after start time' ||
        err.response?.data?.message === 'Product is already in sub sale' ||
        err.response?.data?.message === 'Product not found'
      ) {
        notify2(err.response.data.message)
        setBtnActive(true)
      }
    }
  }

  const handleDeleteSub = async id => {
    setBtnActive(false)

    try {
      const token = Cookies.get('token')
      console.log(token)

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })
      const response = await api.delete(`advancedCategory/sub/${id}`, config(token))
      console.log(response)
      if (response.data.message === 'Subcategory deleted') {
        notify('SubCategory deleted successfully')
        getAdvancedCategories()
        setInterval(() => {
          setOpen(false)
        }, 1500)
        setBtnActive(true)
      }
      if (response.data.err == 'Not Authorized token expired, Please Login again') {
        notify2(response.data.err)
      }
      console.log(response)
    } catch (err) {
      console.log(err)
      if (err.message == 'Network Error') {
        notify2(err.message)
      }
    }
  }

  const getAdvancedCategories = async () => {
    setBackdrop(true)
    try {
      const token = Cookies.get('token')

      const api = axios.create({
        baseURL: base_url,
        headers: config(token).headers
      })
      const response = await api.get(`advancedCategory/`, config(token))

      console.log(response.data.advancedCategories)

      if (response.data.success) {
        setCategories(response.data.advancedCategories)
        getSubCategory(response.data?.advancedCategories[0]?._id)
        setViewCategoryName(response.data?.advancedCategories[0]?.title)
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

  return (
    <div className='relative w-full'>
      <TableContainer component={Paper} className='min-h-[60vh]'>
        <Toaster />
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={backdrop}>
          <CircularProgress color='inherit' />
        </Backdrop>

        {/* delete inactive aleart Dialog  */}

        <Dialog
          open={openDialog}
          TransitionComponent={Transition2}
          keepMounted
          onClose={() => setOpenDialog(false)}
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle>{'Warning: Irreversible Action?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              <h3></h3>
              <h2>
                This action cannot be undone. If you proceed, all inactive flash sales will be permanently deleted. Are
                you sure you want to proceed?
              </h2>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} variant='outlined' color='success'>
              Disagree
            </Button>
            <Button
              onClick={() => {
                handleDeleteInActive(), setOpenDialog(false)
              }}
              variant='outlined'
              color='error'
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        {/* delete active aleart Dialog  */}

        <Dialog
          open={openDialog2}
          TransitionComponent={Transition2}
          keepMounted
          onClose={() => setOpenDialog2(false)}
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle>{'Warning: Irreversible Action?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'>
              <h3></h3>
              <h2>
                This action cannot be undone. If you proceed, all inactive flash sales will be permanently deleted. Are
                you sure you want to proceed?
              </h2>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog2(false)} variant='outlined' color='success'>
              Disagree
            </Button>
            <Button
              onClick={() => {
                notify2('This action is dangerous, only superior admin is allowed!'), setOpenDialog2(false)
              }}
              variant='outlined'
              color='error'
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <div>
            <Box sx={style} className='text-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 absolute top-3 right-1 text-red-500'
                onClick={handleClose}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>

              <Typography id='modal-modal-title' variant='h5' component='h4'>
                Update SubCategory
              </Typography>

              <Typography id='modal-modal-title' variant='h6' component='h6'>
                ID: {subId}
              </Typography>
              <Box className='mt-[40px]'>
                <Grid container spacing={3} justifyContent={'center'}>
                  <Grid item xs={12} md={8} className='pb-[20px]'>
                    <TextField
                      required
                      id='SubCategory title'
                      label='SubCategory title'
                      variant='outlined'
                      value={subTitle}
                      onChange={event => setSubTitle(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={8} className='pb-[20px]'>
                    <TextField
                      required
                      id='Collection Name'
                      label='Collection Name'
                      variant='outlined'
                      value={collectionName}
                      onChange={event => setcollectionName(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={8} className='pb-[20px]'>
                    <TextField
                      required
                      id='image url'
                      label='image url'
                      variant='outlined'
                      value={image}
                      onChange={event => setImage(event.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox color='secondary' name='saveAddress' value='yes' />}
                      label='Make sure all inputs are correct'
                    />
                    <Grid className='flex justify-evenly'>
                      <Button
                        variant='outlined'
                        disabled={btnActive ? false : true}
                        onClick={() => handleDeleteSub(subId)}
                      >
                        {btnActive ? 'Delete' : 'please wait...'}
                      </Button>

                      <Button
                        variant='contained'
                        onClick={() => handleSubUpdate(subId)}
                        disabled={btnActive ? false : true}
                      >
                        {btnActive ? 'Update' : 'please wait...'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </div>
        </Modal>

        {/* drpdown  */}
        <div className='w-screen bg-black text-white pl-8 pt-4'>
          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='flex gap-3 items-center'>
                <Image src={menu} width={40} height={40} alt='menu' />
                <h2 className='font-serif text-[17px]'>Category: {viewCategoryName}</h2>
                <ExpandMoreIcon className='-mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[999]'>
                <div>
                  {categories.map((category, index) => {
                    return (
                      <div className='py-1' key={index}>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href='#'
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                              )}
                              onClick={() => {
                                getSubCategory(category._id), setViewCategoryName(category.title)
                              }}
                            >
                              {category.title}
                            </a>
                          )}
                        </Menu.Item>
                        <Divider />
                      </div>
                    )
                  })}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>

        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='right'>SubCategory</StyledTableCell>
              <StyledTableCell align='right'>Name</StyledTableCell>
              <StyledTableCell align='right'>ID</StyledTableCell>
              <StyledTableCell align='right'>CreatedAt</StyledTableCell>
              <StyledTableCell align='right'>UpdatedAt</StyledTableCell>
              <StyledTableCell align='right'>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          {!backdrop && subCategories.length < 1 ? (
            <div
              className='
            absolute transform lg:translate-x-[100%] md:translate-x-[50%] xxs:translate-x-[0%]   transform-y-[-50%]
            '
            >
              <div className='flex items-center relative'>
                <Image
                  src={'/images/pages/404.png'}
                  width={400}
                  height={350}
                  alt='404'
                  className='object-contain w-[200px] h-[600px] bg-red-0'
                />
                <h3 className='absolute right-10 text-[14px] text-black'>no data found!</h3>
              </div>
            </div>
          ) : subCategories.length > 0 ? (
            <TableBody>
              {subCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(sub => (
                <StyledTableRow key={sub._id}>
                  <StyledTableCell component='th' scope='row'>
                    {sub.items[0]?.title}
                  </StyledTableCell>
                  <StyledTableCell align='right'>{sub.name}</StyledTableCell>

                  <StyledTableCell align='right'>{sub._id}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {new Date(new Date(`${sub.createdAt}`).getTime() - 3 * 60 * 60 * 1000).toLocaleString('en-GB', {
                      hour12: false
                    })}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    {new Date(new Date(`${sub.updatedAt}`).getTime() - 3 * 60 * 60 * 1000).toLocaleString('en-GB', {
                      hour12: false
                    })}
                  </StyledTableCell>

                  <StyledTableCell align='right'>
                    <Chip
                      label='Edit'
                      color='error'
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                      onClick={() => {
                        setsubId(sub._id)
                        getSingleSub(sub._id)
                        setOpen(true)
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell className='w-[97vw] absolute'>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      {sub.length > 0 ? (
        <TablePagination
          rowsPerPageOptions={[10, 15, 25, 50, 75, 100]}
          component='div'
          count={sub.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      ) : null}
    </div>
  )
}

export default TableCustomized
