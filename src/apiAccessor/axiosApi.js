import axios from "axios"

const openAxios = axios.create({
    baseURL: process.env.REACT_APP_AUCTION_API_URL 
});

const authAxios = axios.create({
    baseURL: process.env.REACT_APP_AUCTION_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export { openAxios, authAxios }

