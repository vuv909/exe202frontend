import axios from 'axios'
import { API_URL } from 'src/configs/env'
import axiosClient from './axiosClient'

export const foodApi = {
  createFood: data => {
    return axiosClient.post(`${API_URL}/food`, data)
  },
  getFoods: () => axiosClient.get(`${API_URL}/food`),
  deleteFood: (id) => axiosClient.delete(`${API_URL}/food?id=${id}`),
  updateFood: (data) => axiosClient.put(`${API_URL}/food`, data)
}
