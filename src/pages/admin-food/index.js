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

import { Icon } from '@iconify/react'
import ModalAddFood from './ModalAddFood'
import { foodApi } from 'src/@core/apis'
import toast from 'react-hot-toast'
import ModalUpdateFood from './ModalUpdateFood'

const AdminFood = () => {
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [foods, setFoods] = useState([])
  const [foodSelected, setFoodSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user.role !== 'admin') router.replace('401')
    else {
      setLoading(true)
      foodApi
        .getFoods()
        .then(({ data }) => {
          if (data.isSuccess) {
            setFoods(data.data.foods)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [])

  const handleDelete = id => {
    if (!id) return

    const confirm = window.confirm('Xác nhận xoá món')

    if (confirm) {
      foodApi
        .deleteFood(id)
        .then(({ data }) => {
          if (data.isSuccess) {
            toast.success('Xoá món ăn thành công')
            setFoods(prev => prev.filter(food => food._id !== id))
          } else toast.error('Có lỗi, vui lòng thử lại sau')
        })
        .catch(err => toast.error(err?.message))
    }
  }

  console.log(foods)

  return (
    <Grid>
      <Card>
        <CardHeader
          title='Quản lý món'
          action={
            <Button variant='contained' onClick={() => setOpenModalAdd(true)}>
              <Icon icon='ic:baseline-plus' />
              <span style={{ marginLeft: '.25rem' }}>Thêm món</span>
            </Button>
          }
        />
        <CardContent>
          <TableContainer sx={{ maxHeight: 700 }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Tên món</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Ảnh</TableCell>
                  <TableCell>Actions</TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {foods.map((food, index) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={food._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{food.name}</TableCell>
                    <TableCell>{food.description}</TableCell>
                    <TableCell>{food.price}</TableCell>
                    <TableCell>
                      <img src={food.picture} width={120} height={120} />
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button variant='contained' onClick={() => setFoodSelected(food)}>
                          Chỉnh sửa
                        </Button>
                        <Button variant='contained' color='error' onClick={() => handleDelete(food._id)}>
                          Xoá
                        </Button>
                      </div>
                    </TableCell>
                   
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {loading && (
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
          )}
        </CardContent>
      </Card>

      <ModalAddFood open={openModalAdd} setOpen={setOpenModalAdd} setFoods={setFoods} />
      {foodSelected && <ModalUpdateFood open={foodSelected} setOpen={setFoodSelected} setFoods={setFoods} />}
    </Grid>
  )
}

export default AdminFood
