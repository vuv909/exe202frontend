import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useEffect, useState } from 'react'
import { orderApi } from 'src/@core/apis'
import ModalTimeline from './ModalTimeline'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import ModalRate from './ModalRate'

export const ORDER_STATUS_MEMBER = {
  confirm: 'Đã xác nhận',
  delivery_in_progress: 'Đang được giao',
  success: 'Đã xác nhận giao thành công',
  rejected: 'Bị từ chối',
  canceled: 'Bạn đã huỷ'
}

const MemberOrder = () => {
  const [orders, setOrders] = useState([])
  const [openTimeline, setOpenTimeline] = useState(null)
  const [openRate, setOpenRate] = useState(null)

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    orderApi.getOrderForMember().then(({ data }) => {
      if (data.isSuccess) {
        setOrders(data.data.orders)
      }
    })
  }, [])

  return (
    <Grid>
      <Card>
        <CardHeader title='Đơn của bạn' />
        <CardContent>
          {/* {!user.phone && (
            <Alert severity='warning' style={{ marginBottom: '1rem' }}>
              <AlertTitle>Warning</AlertTitle>
              Xac thuc so dien thoai de xem don hang{' '}
              <strong>
                <a href='#' onClick={() => router.replace('/setting')}>
                  Xac thuc ngay!
                </a>
              </strong>
            </Alert>
          )} */}
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textAlign: 'center' }}>ID</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Món</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Địa chỉ</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Tổng giá</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Trạng thái</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Actions</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>Chi tiet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => {
                  console.log(order.items);
                  const total =
                    order.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0) +
                    order.fee_shipping -
                    order.discount
                  return (
                    <TableRow>
                      <TableCell sx={{ textAlign: 'center' }}>{order._id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {order.items.map(item => (
                          <div key={item.id}>{`x${item.quantity} ${item.name}`}</div>
                        ))}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{order.delivery_address}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <strong>{total}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {order.status === 'confirm' && (
                          <img height={120} width={300} src='/gif/preparefood.gif' alt='Prepare Food' />
                        )}
                        {order.status === 'delivery_in_progress' && (
                          <img height={120} width={300} src='/gif/shipping.gif' alt='Prepare Food' />
                        )}
                        {order.status === 'success' && 'Giao hàng thành công'}
                        {order.status === 'rejected' && 'Bị từ chối'}
                        {order.status === 'canceled' && 'Bị hủy'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {order?.feedback ? (
                          <div style={{ display: 'flex', alignItems: 'end', gap: 6 }}>
                            {order.feedback.rate} <Rating value={order.feedback.rate} readOnly />
                          </div>
                        ) : (
                          <>
                            {order.status === 'success' && (
                              <Button
                                variant='outlined'
                                style={{ marginLeft: '.25rem' }}
                                onClick={() => setOpenRate(order._id)}
                              >
                                Đánh giá
                              </Button>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant='contained' onClick={() => setOpenTimeline(order)}>
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <ModalTimeline open={openTimeline} setOpen={setOpenTimeline} />
      <ModalRate open={openRate} setOpen={setOpenRate} />
    </Grid>
  )
}

export default MemberOrder
