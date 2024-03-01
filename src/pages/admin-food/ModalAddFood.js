import { Icon } from '@iconify/react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  Slide,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { forwardRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from 'src/configs/firebase'
import { useAuth } from 'src/hooks/useAuth'
import { foodApi } from 'src/@core/apis'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const defaultValues = {
  name: '',
  description: '',
  price: ''
}

const ModalAddFood = ({ open, setOpen, setFoods }) => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const { user } = useAuth()

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0])
    }
  })

  const handleClose = () => {
    setOpen(false)
  }

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    if (!file) return toast.error('Hãy thêm ảnh cho món của bạn')

    setLoading(true)
    const imageRef = ref(storage, `images/${user._id}-${new Date().valueOf()}`)
    uploadBytes(imageRef, file)
      .then(data => {
        return getDownloadURL(data.ref)
      })
      .then(picture => {
        return foodApi.createFood({
          ...data,
          picture
        })
      })
      .then(({ data }) => {
        if (data.isSuccess) {
            setFoods(prev => [...prev, data.data.food])
            toast.success("Thêm món thành công")
            setOpen(false);
        } else {
            toast.error("Có lỗi, vui lòng thử lại sau")
        }
      })
      .catch(err => {
        toast.error(err?.message)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      fullWidth
    >
      <DialogTitle id='add-food'>Nhập thông tin món</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Food name'
                    onChange={onChange}
                    placeholder='Bun bo, Banh mi,...'
                    error={Boolean(errors.name)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.name && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    rows={4}
                    multiline
                    fullWidth
                    value={value}
                    label='Food description'
                    onChange={onChange}
                    placeholder='Mo ta mon an'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='price'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    type='number'
                    value={value}
                    label='Price'
                    onChange={onChange}
                    placeholder='VND'
                    error={Boolean(errors.price)}
                    aria-describedby='validation-basic-price'
                    {...(errors.price && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} style={{ position: 'relative', cursor: 'pointer' }}>
              <Box {...getRootProps({ className: 'dropzone' })} sx={file ? { maxHeight: 200 } : {}}>
                <input {...getInputProps()} />
                {file ? (
                  <img
                    key={file?.name}
                    alt={file?.name}
                    style={{ width: '100%', objectFit: 'cover' }}
                    className='single-file-image'
                    src={URL.createObjectURL(file)}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      textAlign: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      border: '1px dashed #ccc',
                      borderRadius: '8px',
                      padding: '1rem'
                    }}
                  >
                    <Box
                      sx={{
                        mb: 8.75,
                        width: 48,
                        height: 48,
                        display: 'flex',
                        borderRadius: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
                      }}
                    >
                      <Icon icon='tabler:upload' fontSize='1.75rem' />
                    </Box>
                    <Typography variant='h4' sx={{ mb: 2.5 }}>
                      Drop files here or click to upload.
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>
                      (This is just a demo drop zone. Selected files are not actually uploaded.)
                    </Typography>
                  </Box>
                )}
              </Box>
              {file && (
                <Button
                  variant='contained'
                  color='error'
                  style={{ position: 'absolute', top: '2rem', right: '1rem' }}
                  onClick={() => setFile(null)}
                >
                  Xóa ảnh
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button variant='contained' color='secondary' onClick={handleClose}>
            Hủy
          </Button>
          <Button type='submit' variant='contained' color='primary' disabled={loading}>
            Tạo món
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalAddFood
