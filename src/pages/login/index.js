// ** React Imports
import { useContext, useState } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Firbase
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { authentication } from '../../configs/firebase'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

// ** Styled Components
const LoginIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 680,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  // [theme.breakpoints.up('md')]: {
  //   maxWidth: 450
  // },
  // [theme.breakpoints.up('lg')]: {
  //   maxWidth: 600
  // },
  // [theme.breakpoints.up('xl')]: {
  //   maxWidth: 750
  // }
}))

const LoginPage = () => {
  // ** Hooks
  const [loading, setLoading] = useState(false)

  const auth = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const handleLoginFacebook = () => {
    const provider = new FacebookAuthProvider()

    setLoading(true)
    signInWithPopup(authentication, provider)
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleLoginGoogle = () => {
    const provider = new GoogleAuthProvider()

    setLoading(true)
    signInWithPopup(authentication, provider)
      .then(data => {
        const user = data.user
        const userData = {
          fullName: user.displayName,
          email: user.email,
          phone: user.phoneNumber,
          picture: user.photoURL,
          providerData: user.providerData,
          uid: user.uid,
        }
        window.localStorage.setItem("accessToken", data.user.accessToken);

        return auth.saveUser(userData)
      })
      .then(() => {
        toast.success('Successfully authentication')
      })
      .catch(err => {
        toast.error(err?.message)
      })
      .finally(() => setLoading(false))
  }

  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <img src='/images/logo_1.png' width={32} height={32}/>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                {`Welcome to ${themeConfig.templateName}! 👋🏻`}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>
            <Box>
              <div style={{ marginTop: '1rem' }}>
                <Button
                  disabled={loading}
                  style={{ width: '100%' }}
                  color='error'
                  variant='outlined'
                  onClick={handleLoginGoogle}
                >
                  <Icon icon='mdi:google' /> Google
                </Button>
              </div>
            </Box>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
