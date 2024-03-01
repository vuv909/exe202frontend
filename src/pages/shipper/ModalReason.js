import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Typography } from '@mui/material'
import { useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from 'src/@core/components/mui/text-field'

const ModalReason = ({ open, setOpen, updateOrder }) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (text.trim() === "") return toast.error("Hay nhap ly do huy");

    setLoading(true)
    await updateOrder(open, 'rejected', text);

    setLoading(false);
    setText('');
    setOpen(null);
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
          Lý do
        </Typography>
        <Button aria-label='close' onClick={handleClose}>
          <Icon icon='tabler:x' fontSize='1.25rem' />
        </Button>
      </DialogTitle>
      <DialogContent>
        <CustomTextField
          rows={4}
          multiline
          fullWidth
          placeholder='Nhap ly do'
          id='textarea-outlined-static'
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='secondary' onClick={handleClose}>
          Hủy
        </Button>
        <Button type='submit' variant='contained' color='primary' disabled={loading} onClick={handleUpdate}>
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalReason
