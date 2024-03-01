import { API_URL } from 'src/configs/env'
import axiosClient from './axiosClient'

export const feedbackApi = {
    getAllFeedback: () => axiosClient.get(`${API_URL}/public/feedback/getAll`),
}
