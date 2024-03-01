import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useEffect, useState } from 'react'
import { orderApi } from 'src/@core/apis'
import { ORDER_STATUS } from '../admin-order'
import toast from 'react-hot-toast'
import ModalReason from './ModalReason'

const Shipper = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [openReason, setOpenReason] = useState(null);

  useEffect(() => {
    orderApi
      .getOrderForShipper()
      .then(({ data }) => {
        if (data.isSuccess) {
          setOrders(data.data.orders)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const updateOrder = async (_id, status, reason ) => {
    setLoading(true)
    orderApi
      .updateOrder({ _id, status, reason })
      .then(({ data }) => {
        if (data.isSuccess) {
          setOrders(prev => prev.map(order => (order._id === data.data.order._id ? data.data.order : order)))
          toast.success('Cập nhật trạng thái thành công')
        } else toast.error('Có lỗi, vui lòng thử lại sau')
      })
      .catch(err => {
        toast.error(err?.message)
      })
      .finally(() => setLoading(false))
  }

  const handleCancel = () => {}

  return (
    <Grid>
      <Card>
        <CardHeader title='Shipping' />
        <CardContent>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Sdt/Email</TableCell>
                  <TableCell>Món</TableCell>
                  <TableCell>Tổng thu</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => {
                  const total = order.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0)
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={order._id}>
                      <TableCell>
                        {order.customer_phone}
                        {order.customer_email ? `/${order.customer_email}` : null}
                      </TableCell>
                      <TableCell>
                        {order.items.map(item => (
                          <div key={item.id}>{`x${item.quantity} ${item.name}`}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        <strong>{total + order.fee_shipping - order.discount}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell>{order.delivery_address}</TableCell>
                      <TableCell>{ORDER_STATUS[order.status]}</TableCell>
                      <TableCell>
                        {order.status === 'confirm' && (
                          <Button
                            variant='contained'
                            disabled={loading}
                            onClick={() => updateOrder(order._id, 'delivery_in_progress')}
                          >
                            Bắt đầu giao
                          </Button>
                        )}
                        {order.status === 'delivery_in_progress' && (
                          <Grid style={{ display: 'flex', gap: 6 }}>
                            <Button
                              variant='contained'
                              disabled={loading}
                              color='success'
                              onClick={() => updateOrder(order._id, 'success')}
                            >
                              Đã giao xong
                            </Button>
                            <Button
                              variant='outlined'
                              color='error'
                              disabled={loading}
                              onClick={() => setOpenReason(order._id)}
                            >
                              Huỷ đơn
                            </Button>
                          </Grid>
                        )}
                        {order.status === 'rejected' && (
                          <Button variant='outlined' color='error'>
                            Đã huỷ
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ModalReason open={openReason} setOpen={setOpenReason} updateOrder={updateOrder}/>
    </Grid>
  )
}

export default Shipper
