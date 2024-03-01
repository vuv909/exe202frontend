import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Rating, Typography } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { orderApi } from 'src/@core/apis'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useAuth } from 'src/hooks/useAuth'

const ModalRate = ({ open, setOpen }) => {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [rate, setRate] = useState(5)

  const handleSubmitRate = () => {
    const data = {
      user: user._id,
      order: open,
      rate,
      comment: text.trim()
    }

    setLoading(true)
    orderApi
      .createRate(data)
      .then(({ data }) => {
        if (data.isSuccess) {
          setText('')
          setRate(5)
          setOpen(null)
          toast.success('Đánh giá thành công')
        } else toast.error('Đánh giá thất bại')
      })
      .catch(err => toast.error(err?.message))
      .finally(() => setLoading(false))
  }

  const handleClose = () => {
    setOpen(null)
  }

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle id='customized-dialog-title' sx={{ p: 4 }}>
        <Typography variant='h6' component='span'>
          Đánh giá của bạn
        </Typography>
        <Button aria-label='close' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </Button>
      </DialogTitle>
      <DialogContent>
        <Rating
          value={rate}
          name='simple-controlled'
          onChange={(event, newValue) => setRate(Number.parseInt(event.target.value))}
        />
        <CustomTextField
          rows={4}
          multiline
          fullWidth
          placeholder='Good,...'
          id='textarea-outlined-static'
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={handleClose}>
          Hủy
        </Button>
        <Button type='submit' variant='contained' color='primary' disabled={loading} onClick={handleSubmitRate}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalRate
