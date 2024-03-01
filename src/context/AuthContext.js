// ** React Imports
import { useRouter } from 'next/router'
import { createContext, useEffect, useState } from 'react'
import { userApi } from 'src/@core/apis'

import { authentication } from 'src/configs/firebase'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => {},
  saveUser: async () => {},
  updateUserData: () => {}
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  const router = useRouter()

  // ** Hooks
  useEffect(() => {
    const initAuth = async () => {
      authentication.onIdTokenChanged(async (user) => {
        if (user) {
          const userData = {
            fullName: user.displayName,
            email: user.email,
            phone: user.phoneNumber,
            picture: user.photoURL,
            providerData: user.providerData,
            uid: user.uid,
          }

          const { data } = await userApi.saveUser(userData);
          setUser(data.data?.user)
        } else setUser(null)
      })
    }
    initAuth().finally(() => {
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateUserData = (fields) => {
    const dataUpdate = { ...user, ...fields};
    window.localStorage.setItem('userData', JSON.stringify(dataUpdate))

    setUser(dataUpdate);
  }

  const saveUser = async userData => {
    const { data } = await userApi.saveUser(userData);

    window.localStorage.setItem('userData', JSON.stringify(data.data.user))
    setUser(data.data.user)
    setLoading(false)
    router.replace('/')
  }

  const logout = () => {
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem('accessToken')
    setUser(null)
    router.replace('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    logout,
    saveUser,
    updateUserData
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
