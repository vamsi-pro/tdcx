import axios from 'axios'

// configs
import { tdcxAPI } from '../configs/constant'

const Headers = (authToken) => {
    return {
        headers: { Authorization: `Bearer ${authToken}` },
    }
}

export const fetchTaskList = (token) => {
    return axios.get(`${tdcxAPI}/tasks`, Headers(token))
}

export const fetchDashboardList = (token) => {
    return axios.get(`${tdcxAPI}/dashboard`, Headers(token))
}

export const createTask = (task, token) => {
    return axios.post(`${tdcxAPI}/tasks`, { name: task }, Headers(token))
}

export const updateTask = (id, token) => {
    return axios.put(`${tdcxAPI}/tasks/${id}`, Headers(token))
}

export const deleteTask = (id, token) => {
    return axios.delete(`${tdcxAPI}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
}
