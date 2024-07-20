import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://neobook.online/neonews'
})
export default instance