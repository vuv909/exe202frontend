import axios from 'axios'
import { API_URL } from 'src/configs/env'
import axiosClient from './axiosClient'

export const userApi = {
  saveUser: data => {
    return axios.post(`${API_URL}/public/user`, data)
  },
  getShippers: () => axios.get(`${API_URL}/public/user/shipper`),
  addPhone: (data) => axiosClient.post(`${API_URL}/user/phone`, data),
  verifyAddPhoneOtp: (data) => axiosClient.patch(`${API_URL}/user/phone`, data)
}
