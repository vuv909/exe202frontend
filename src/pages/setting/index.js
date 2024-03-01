import styled from '@emotion/styled'
import { Button, Card, CardContent, CardHeader, Grid, Input } from '@mui/material'
import MuiInputLabel from '@mui/material/InputLabel'

import Cleave from 'cleave.js/react'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'

import 'cleave.js/dist/addons/cleave-phone.vn'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import { userApi } from 'src/@core/apis'
import toast from 'react-hot-toast'

const InputLabel = styled(MuiInputLabel)(({ theme }) => ({
  lineHeight: 1.154,
  maxWidth: 'max-content',
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  fontSize: theme.typography.body2.fontSize
}))

const Setting = () => {
  const { updateUserData, user } = useAuth()
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtp, setIsOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendCode = () => {
    setLoading(true)
    userApi
      .addPhone({
        phone
      })
      .then(({ data }) => {
        if (data.isSuccess) {
          toast.success('Ma xac nhan da duoc gui qua so dien thoai')
          setIsOtp(true)
        } else {
          toast.error(data?.message)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const handleSubmitOtp = () => {
    setLoading(true)
    userApi
      .verifyAddPhoneOtp({
        code: otp
      })
      .then(({ data }) => {
        if (data.isSuccess) {
          updateUserData({ phone })
          toast.success('So dien thoai da duoc them vao tai khoan')
        } else toast.error(data?.message)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const handleAddPhone = () => {
    setLoading(true)
    userApi
      .addPhone({
        phone
      })
      .then(({ data }) => {
        if (data.isSuccess) {
          updateUserData({ phone })
          toast.success('So dien thoai da duoc them vao tai khoan')
        } else toast.error(data?.message)
      })
      .catch(err => toast.error(err?.message))
      .finally(() => setLoading(false))
  }

  return (
    <Grid>
      <CleaveWrapper>
        <Card>
          <CardHeader title='Setting' />
          <CardContent>
            {user.phone ? (
              <Grid item xs={12} sm={6} lg={4}>
                <InputLabel>Số điện thoại</InputLabel>
                <Grid style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cleave
                    options={{ phone: true, phoneRegionCode: 'VN', prefix: '+84' }}
                    style={{ width: 200 }}
                    value={user.phone}
                    disabled
                  />
                  <Button variant='contained' disabled={loading}>
                    Xoa
                  </Button>
                </Grid>
              </Grid>
            ) : (
              <>
                {/* {isOtp ? (
                  <Grid item xs={12} sm={6} lg={4}>
                    <InputLabel htmlFor='code-phone'>Ma xac nhan</InputLabel>
                    <Grid style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Input id='code-phone' value={otp} onChange={e => setOtp(e.target.value)} />
                      <Button onClick={handleSubmitOtp} variant='contained' disabled={loading}>
                        Xac thuc
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={6} lg={4}>
                    <InputLabel htmlFor='phone-number'>Số điện thoại</InputLabel>
                    <Grid style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Cleave
                        id='phone-number'
                        placeholder='0961635089'
                        options={{ phone: true, phoneRegionCode: 'VN', prefix: '+84' }}
                        style={{ width: 200 }}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                      <Button variant='contained' disabled={loading} onClick={handleSendCode}>
                        Gửi mã
                      </Button>
                    </Grid>
                  </Grid>
                )} */}
                <Grid item xs={12} sm={6} lg={4}>
                  <InputLabel htmlFor='phone-number'>So dien thoai</InputLabel>
                  <Grid style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Cleave
                      id='phone-number'
                      placeholder='0961635089'
                      options={{ phone: true, phoneRegionCode: 'VN' }}
                      style={{ width: 200 }}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <Button onClick={handleAddPhone} variant='contained' disabled={loading}>
                      Thêm số điện thoại
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </CardContent>
        </Card>
      </CleaveWrapper>
    </Grid>
  )
}

export default Setting
