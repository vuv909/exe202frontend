import { API_URL } from 'src/configs/env'
import axiosClient from './axiosClient'

export const orderApi = {
  createOrder: data => axiosClient.post(`${API_URL}/order`, data),
  getAll: ({ status }) => axiosClient.get(`${API_URL}/order?status=${status.join()}`),
  getOrderForShipper: () => axiosClient.get(`${API_URL}/order/shipper`),
  getOrderForMember: () => axiosClient.get(`${API_URL}/order/member`),
  updateOrder: data => axiosClient.patch(`${API_URL}/order`, data),
  createRate: data => axiosClient.post(`${API_URL}/feedback`, data),
  getOrderByOrderId : orderId => axiosClient.get(`${API_URL}/public/viewDetailOrder/${orderId}`)
}
