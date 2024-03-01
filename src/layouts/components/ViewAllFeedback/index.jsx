import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useEffect, useState, useContext } from 'react'
import { feedbackApi } from 'src/@core/apis/feedback.api'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}

export default function ViewAllFeedback() {
  const [feedbacks, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [detailOrder, setDetailOrder] = useState(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  const formatDate = dateString => {
    if (!dateString) {
      return ''
    }

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }

    const formattedDate = new Date(dateString).toLocaleDateString('vi-VN', options)
    return formattedDate
  }

  useEffect(() => {
    const getAllFeedback = async () => {
      setIsLoading(true)
      await feedbackApi
        .getAllFeedback()
        .then(res => {
          setTimeout(() => {
            setIsLoading(false)
            setFeedback(res.data.data.feedbacks)
          }, 500)
        })
        .catch(err => {
          setTimeout(() => {
            setIsLoading(false)
            setFeedback(null)
          }, 500)
        })
    }

    getAllFeedback()
  }, [])

  const viewDetailOrder = id => {
    const data = feedbacks.filter((f, i) => f._id === id)
    setDetailOrder(data[0]?.order)
    handleOpen()
  }

  return (
    <>
      {isLoading ? (
        <Card>
          <Stack
            sx={{ m: 10, display: 'flex', justifyContent: 'center', color: 'grey.500' }}
            spacing={2}
            direction='row'
          >
            <CircularProgress color='success' />
          </Stack>
        </Card>
      ) : (
        feedbacks !== null && (
          <>
            <Card>
              <CardHeader title='Các đánh giá của khách hàng về đồ ăn và phục vụ'></CardHeader>
              <CardContent>
                {feedbacks?.map((feedback, index) => {
                  return (
                    <>
                      <Card
                        key={index}
                        style={{ display: 'flex', gap: '30px', padding: '10px', margin: '10px', alignItems: 'center' }}
                      >
                        <div>
                          <Tooltip title={`${feedback?.user?.email}`}>
                            <img
                              style={{ borderRadius: '50%', width: '70px', height: '70px', cursor: 'pointer' }}
                              src={`${feedback?.user.picture}`}
                            />
                          </Tooltip>
                        </div>
                        <div>
                          <div>
                            <Typography>
                              <span style={{ fontWeight: 'bolder' }}>Thời gian đặt</span> :{' '}
                              {formatDate(feedback?.order?.createdAt)}
                            </Typography>
                          </div>
                          <div style={{ marginTop: '5px', marginBottom: '5px' }}>
                            <Rating name='half-rating-read' defaultValue={feedback?.rate} precision={0.5} readOnly />
                          </div>
                          <div>
                            <span style={{ fontWeight: 'bolder' }}>Bình luận :&nbsp;</span>
                            <span>{feedback?.comment}</span>
                          </div>
                          <div>
                            <Button sx={{ mt: 3 }} variant='contained' onClick={() => viewDetailOrder(feedback?._id)}>
                              Chi tiết đơn hàng
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </>
                  )
                })}
              </CardContent>
            </Card>

            {/* Modal */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby='modal-modal-title'
              aria-describedby='modal-modal-description'
            >
              <Card sx={style}>
                <Typography id='modal-modal-description' sx={{ mt: 2 }}>
                  <TableContainer sx={{ mt: 5, maxHeight: 700 }}>
                    <Table stickyHeader aria-label='sticky table'>
                      <TableHead>
                        <TableRow>
                          <TableCell>Id</TableCell>
                          <TableCell>Ảnh</TableCell>
                          <TableCell>Tên món</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Giá</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {detailOrder?.items?.map((f, i) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell><img width={100} height={100} src={`${f?.id?.picture}`} /></TableCell>
                            <TableCell>{f?.name}</TableCell>
                            <TableCell>{f?.quantity}</TableCell>
                            <TableCell>{f?.price} VND</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Typography>
                    <span style={{fontWeight:'bold'}}>Tiền ship :&nbsp;</span>{detailOrder?.fee_shipping}VND
                  </Typography>
                  <Typography>
                    <span style={{fontWeight:'bold'}}>Giảm giá :&nbsp;</span>{detailOrder?.discount}VND
                  </Typography>
                  <Typography>
                    <span style={{fontWeight:'bolder',fontSize:'20px'}}>Tổng :&nbsp;</span>{detailOrder?.items.reduce((prev, cur) => prev + cur.quantity * cur.price, 0) + detailOrder?.fee_shipping - detailOrder?.discount}VND
                  </Typography>
                </Typography>
              </Card>
            </Modal>
          </>
        )
      )}
    </>
  )
}
