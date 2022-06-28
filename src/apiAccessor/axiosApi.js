import axios from "axios"
import { QueryClient } from "react-query";

export default axios.create({
    baseURL: process.env.REACT_APP_AUCTION_API_URL 
});

const authAxios = axios.create({
    baseURL: process.env.REACT_APP_AUCTION_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

const queryClient = new QueryClient();

export { authAxios, queryClient }

