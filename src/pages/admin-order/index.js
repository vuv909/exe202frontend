import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import ModalCreateOrder from './ModalCreateOrder'
import { foodApi, orderApi, userApi } from 'src/@core/apis'
import ModalTimeline from '../member-order/ModalTimeline'
import ModalTimelineAdmin from './ModalTimeLineAdmin'

export const ORDER_STATUS = {
  confirm: 'Đã xác nhận',
  delivery_in_progress: 'Đang được giao',
  success: 'Khách đã nhận đuợc món',
  rejected: 'Đã từ chối',
  canceled: 'Khách đã huỷ'
}

const AdminOrder = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [foods, setFoods] = useState([])
  const [shipper, setShipper] = useState([])
  const [openTimeline, setOpenTimeline] = useState(null)
  const [orders, setOrders] = useState([])
  const [openModalOrder, setOpenModalOrder] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user.role !== 'admin') router.replace('401')

    foodApi
      .getFoods()
      .then(({ data }) => {
        if (data.isSuccess) {
          setFoods(data.data.foods)
        }
      })
      .catch(err => {
        console.log(err)
      })

    userApi
      .getShippers()
      .then(({ data }) => {
        if (data.isSuccess) {
          setShipper(data.data.shippers)
        }
      })
      .catch(err => {
        console.log(err)
      })

    setLoading(true)
    orderApi
      .getAll({ status: ['confirm', 'delivery_in_progress', 'success' , 'rejected' , 'canceled'] })
      .then(({ data }) => {
        if (data.isSuccess) {
          setOrders(data.data.orders)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Grid>
      <Card>
        <CardHeader
          title='Quản lý đặt món'
          action={
            <Button variant='contained' onClick={() => setOpenModalOrder(true)}>
              <Icon icon='ic:baseline-plus' />
              <span style={{ marginLeft: '.25rem' }}>Tạo order</span>
            </Button>
          }
        />
        <CardContent>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Mã order</TableCell>
                  <TableCell>Sdt/Email</TableCell>
                  <TableCell>Món</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Phí ship</TableCell>
                  <TableCell>Giá đuợc giảm</TableCell>
                  <TableCell>Tổng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Shiper</TableCell>
                  <TableCell>Chi tiết</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => {
                  const total = order.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0)
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={order._id}>
                      <TableCell>
                        {order._id}
                      </TableCell>
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
                        <strong>{total}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell>
                        <strong>{order.fee_shipping}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell>
                        <strong>{order.discount}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell>
                        <strong>{total + order.fee_shipping - order.discount}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span>
                      </TableCell>
                      <TableCell>{ORDER_STATUS[order.status]}</TableCell>
                      <TableCell>{order.shipper.fullName}</TableCell>
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
          {loading && <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </div>}
        </CardContent>
      </Card>
      <ModalTimelineAdmin open={openTimeline} setOpen={setOpenTimeline} />
      <ModalCreateOrder open={openModalOrder} setOpen={setOpenModalOrder} foods={foods} shipper={shipper} setOrders={setOrders} />
    </Grid>
  )
}

export default AdminOrder
