// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useEffect, useRef, useState } from 'react'
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import { orderApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import { Stack } from '@mui/system'
import ViewAllFeedback from 'src/layouts/components/ViewAllFeedback/index'
import { ORDER_STATUS } from '../admin-order'
const Home = () => {
  const ref = useRef()
  const [isLoading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const handleSearchOrder = async () => {
    const orderId = ref.current.value
    if (orderId.trim() === '') {
      toast.error('Vui lòng không bỏ trống trường tìm kiếm')
    } else if (orderId.trim().includes('.')) {
      setTimeout(() => {
        toast.error("Order bạn tìm kiếm không tồn tại")
      }, 500)
      setOrder(null);
    }
    else {
      setLoading(true)
      await orderApi.getOrderByOrderId(orderId)
        .then((res) => {
          setTimeout(() => {
            setLoading(false)
            setOrder(res.data.data.order)
          }, 500)

        })
        .catch((err) => {
          setTimeout(() => {
            setLoading(false)
            toast.error("Order bạn tìm kiếm không tồn tại")
          }, 500)
          setOrder(null);
        })
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Tra cứu đơn hàng theo mã order'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              <TextField
                id="outlined-multiline-flexible"
                label="Mã order"
                maxRows={8}
                inputRef={ref}
              />
              <br />
              <Button sx={{ mt: 3 }} variant="contained" onClick={handleSearchOrder}>Tra cứu</Button>
            </Typography>


            {isLoading === true ? (<Stack sx={{ mt: 5, display: 'flex', justifyContent: 'center', color: 'grey.500' }} spacing={2} direction="row">
              <CircularProgress color="success" />
            </Stack>
            ) :
              order !== null && (
                <TableContainer sx={{ mt: 5, maxHeight: 700 }}>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableCell>{order?._id}</TableCell>
                      <TableCell>{order?.customer_phone}/{order?.customer_email}</TableCell>
                      <TableCell>{order?.items.map(item => (
                        <div key={item.id}>{`x${item.quantity} ${item.name}`}</div>
                      ))}</TableCell>
                      <TableCell>{order?.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0)}</TableCell>
                      <TableCell>{order?.fee_shipping}</TableCell>
                      <TableCell>{order?.discount}</TableCell>
                      <TableCell>  <strong>{order?.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0) + order?.fee_shipping - order?.discount}</strong>
                        <span style={{ marginLeft: '.25rem' }}>VND</span></TableCell>
                      <TableCell>{ORDER_STATUS[order?.status]}</TableCell>
                    </TableBody>
                  </Table>
                </TableContainer>
              )

            }

          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <ViewAllFeedback />
      </Grid>
    </Grid >
  )
}

export default Home