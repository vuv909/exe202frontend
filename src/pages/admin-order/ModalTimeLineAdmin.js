import { Icon } from '@iconify/react'
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab'
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { forwardRef, useMemo } from 'react'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

const formateDate = stringDate => {
    const formattedDate =
        new Date(stringDate)
            .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
            .replaceAll('/', '-') +
        ' ' +
        new Date(stringDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    return formattedDate
}

const ModalTimelineAdmin = ({ open, setOpen }) => {
    const handleClose = () => {
        setOpen(false)
    }

    const total = useMemo(() => {
        return open?.items?.reduce((prev, cur) => prev + cur.quantity * cur.price, 0) + open?.fee_shipping - open?.discount
    }, [open])

    console.log(open)

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={handleClose}
            TransitionComponent={Transition}
            aria-labelledby='alert-dialog-slide-title'
            aria-describedby='alert-dialog-slide-description'
            fullScreen
        >
            <DialogTitle id='add-food'>
                <Typography variant='h6' component='span'>
                    Chi tiết
                </Typography>
                <IconButton
                    aria-label='close'
                    onClick={handleClose}
                    sx={{ top: 8, right: 10, position: 'absolute', color: 'grey.500' }}
                >
                    <Icon icon='tabler:x' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Timeline position={'alternate'}>
                    <TimelineItem>
                        <TimelineSeparator>
                            <CustomTimelineDot skin='light' color='secondary'>
                                <Icon icon='tabler:soup' fontSize={20} />
                            </CustomTimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                            <Box
                                sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <Typography variant='h6' sx={{ mr: 2 }}>
                                    Bếp đang chuẩn bị món cho bạn
                                </Typography>
                            </Box>
                            <Box>
                                {open?.items?.map(item => (
                                    <div>
                                        <Typography variant='body2' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {`x${item.quantity} ${item.name} : ${item.quantity * item.price} VND`}
                                        </Typography>
                                    </div>
                                ))}
                            </Box>
                            <Box style={{ marginTop: '.5rem' }}>
                                <Typography variant='body2' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {`Phi ship: ${open?.fee_shipping} VND`}
                                </Typography>
                            </Box>
                            <Box style={{ marginTop: '.5rem' }}>
                                <Typography variant='body2' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {`Giảm giá: ${open?.discount} VND`}
                                </Typography>
                            </Box>
                            <Box style={{ marginTop: '.5rem' }}>
                                <Typography variant='body2' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {`Tổng:`}
                                    <strong style={{ margin: '0 .25rem' }}>{total}</strong>
                                    <span>VND</span>
                                </Typography>
                            </Box>
                            <Box style={{ marginTop: '.5rem' }}>
                                <Typography variant='body2' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {`Trạng thái:`}
                                    <strong style={{ margin: '0 .25rem' }}>
                                        {open?.ayment_status ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </strong>
                                </Typography>
                            </Box>
                            <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                {formateDate(open?.createdAt)}
                            </Typography>
                        </TimelineContent>
                    </TimelineItem>

                    {open?.time_delivery && (
                        <TimelineItem>
                            <TimelineSeparator>
                                <CustomTimelineDot skin='light' color='primary'>
                                    <Icon icon='tabler:bike' fontSize={20} />
                                </CustomTimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                    <Typography variant='h6' sx={{ mr: 2 }}>
                                        Shipper đang trên đường giao món cho bạn
                                    </Typography>
                                </Box>
                                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                    {formateDate(open?.time_delivery)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                    {open?.status === 'success' && (
                        <TimelineItem>
                            <TimelineSeparator>
                                <CustomTimelineDot skin='light' color='success'>
                                    <Icon icon='tabler:check' fontSize={20} />
                                </CustomTimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                    <Typography variant='h6' sx={{ mr: 2 }}>
                                        Giao thành công
                                    </Typography>
                                </Box>
                                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                    {formateDate(open?.time_success)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                    {open?.status === 'canceled' && (
                        <TimelineItem>
                            <TimelineSeparator>
                                <CustomTimelineDot skin='light' color='success'>
                                    <Icon icon='tabler:check' fontSize={20} />
                                </CustomTimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                    <Typography variant='h6' sx={{ mr: 2 }}>
                                        Giao hang không thành công
                                    </Typography>
                                </Box>
                                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                    {formateDate(open?.time_canceled)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                    {open?.status === 'rejected' && (
                        <TimelineItem>
                            <TimelineSeparator>
                                <CustomTimelineDot skin='light' color='success'>
                                    <Icon icon='tabler:check' fontSize={20} />
                                </CustomTimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                    <Typography variant='h6' sx={{ mr: 2 }}>
                                        Giao hang không thành công
                                    </Typography>
                                </Box>
                                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                                    <Button variant='contained' color='error' style={{ maxWidth: 200 }}>
                                        Shipper đã hủy đơn
                                    </Button>
                                </Box>
                                <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                                    {formateDate(open?.time_rejected)}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    )}
                </Timeline>
            </DialogContent>
        </Dialog>
    )
}

export default ModalTimelineAdmin
