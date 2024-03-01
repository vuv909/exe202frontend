import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Menu, MenuItem, Slide } from '@mui/material'
import { forwardRef, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { orderApi } from 'src/@core/apis'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useSocket } from 'src/hooks/useSocket'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

const defaultValues = {
  customer_phone: '',
  customer_email: '',
  payment_status: false,
  discount: '',
  fee_shipping: '',
  delivery_address: '',
  shipper: ''
}

export const removeNull = (obj = {}) => {
  const cloneObj = { ...obj }
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; ++i) {
    const value = obj[keys[i]]

    if (!value) delete cloneObj[keys[i]]
  }

  return cloneObj
}

const ModalCreateOrder = ({ open, setOpen, foods = [], shipper = [], setOrders }) => {
  const [loading, setLoading] = useState(false)
  const [foodsOrder, setFoodsOrder] = useState([])
  const [keyReset, setKeyReset] = useState(0)
  const { socket } = useSocket()

  const handleClose = () => {
    setOpen(false)
  }

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ defaultValues })

  const onSubmit = data => {
    const items = foodsOrder.filter(item => item.quantity > 0)

    orderApi
      .createOrder(removeNull({ ...data, items }))
      .then(({ data }) => {
        if (data.isSuccess) {
          setOrders(prev => [...prev, data.data.order])

          setFoodsOrder([])
          reset()
          setKeyReset(prev => prev + 1)
          setOpen(false)
          toast.success('Tạo order thành công')
          console.log(socket)
          socket.emit(`create-order`, {
            phone: data.data.order?.customer_phone,
            shipperId: data.data.order?.shipper
          })
        } else toast.error('Có lỗi, vui lòng thử lại sau')
      })
      .catch(err => toast.error(err?.message))
      .finally(() => setLoading(false))
  }

  const totalPrice = useMemo(
    () =>
      foodsOrder.reduce((prev, cur) => {
        if (cur.quantity > 0) return prev + cur.quantity * cur.price
        else return prev
      }, 0),
    [foodsOrder]
  )

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      fullWidth
      maxWidth='lg'
    >
      <DialogTitle id='add-food'>Tạo order</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='customer_phone'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='number'
                    label='Số điện thoại nhận món *'
                    onChange={onChange}
                    placeholder='096xxxxxxx'
                    error={Boolean(errors.customer_phone)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.customer_phone && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='customer_email'
                control={control}
                rules={{}}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    type='email'
                    label='Email nhận món'
                    onChange={onChange}
                    placeholder='xxx@xxx.xx'
                    error={Boolean(errors.customer_email)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.customer_email && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='delivery_address'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Địa chỉ nhận món *'
                    onChange={onChange}
                    placeholder='Duong...'
                    error={Boolean(errors.delivery_address)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.delivery_address && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            {foods.length > 0 &&
              foods.map(food => (
                <Grid item xs={6} key={keyReset}>
                  <div style={{ display: 'flex' }}>
                    <div key={food._id} style={{ width: 160, height: 160, marginBottom: '1rem' }}>
                      <img
                        alt={food.name}
                        src={food.picture}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ marginLeft: '1rem', width: '75%' }}>
                      <strong>{food.name}</strong>
                      <div style={{ marginTop: '1rem' }}>
                        <CustomTextField
                          label='Số lượng'
                          type='number'
                          placeholder='0'
                          onChange={e => {
                            const quantity = Number.parseInt(e.target.value)

                            setFoodsOrder(prev => {
                              const isHas = !!prev.find(item => item.id === food._id)
                              console.log(isHas)
                              if (isHas) return prev.map(item => (item.id === food._id ? { ...item, quantity } : item))
                              else return [...prev, { id: food._id, name: food.name, price: food.price, quantity }]
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            <Grid xs={12} style={{ padding: '0 1rem' }}>
              <div style={{ fontSize: '1.25rem' }}>
                <span>
                  Tong tien: <strong>{totalPrice}</strong> VND
                </span>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='discount'
                control={control}
                rules={{}}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField fullWidth value={value} label='Giảm giá' onChange={onChange} placeholder='VND' />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='shipper'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    select
                    defaultValue={value}
                    fullWidth
                    placeholder='Chọn shipper'
                    label='Shipper *'
                    onChange={e => setValue('shipper', e.target.value)}
                    error={Boolean(errors.shipper)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.shipper && { helperText: 'This field is required' })}
                  >
                    {shipper.length > 0 &&
                      shipper.map(shipper => (
                        <MenuItem key={shipper._id} value={shipper._id}>{`${shipper.fullName}`}</MenuItem>
                      ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='fee_shipping'
                control={control}
                rules={{}}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Phí ship'
                    onChange={onChange}
                    placeholder='10.000'
                    error={Boolean(errors.fee_shipping)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.fee_shipping && { helperText: 'This field is required' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='payment_status'
                control={control}
                rules={{}}
                render={({ field: { value, onChange } }) => (
                  <CustomTextField
                    fullWidth
                    value={value}
                    label='Trạng thái thanh toán'
                    onChange={e => setValue('payment_status', e.target.value)}
                    select
                    error={Boolean(errors.payment_status)}
                    aria-describedby='validation-basic-first-name'
                    {...(errors.payment_status && { helperText: 'This field is required' })}
                  >
                    <MenuItem value={true}>Đã thanh toán</MenuItem>
                    <MenuItem value={false} selected>
                      Chưa thanh toán
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='secondary' onClick={handleClose}>
            Hủy
          </Button>
          <Button type='submit' variant='contained' color='primary' disabled={loading}>
            Xác nhận
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalCreateOrder
