import axios from 'axios'

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  responseType: 'json'
})

axiosClient.interceptors.request.use(
  async config => {
    const jwtToken = localStorage.getItem('accessToken')
    if (jwtToken && config.headers) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }

    return config
  },
  async error => {
    return Promise.reject(error.response.data.errors[0].message)
  }
)

export default axiosClient;
