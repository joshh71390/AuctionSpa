import axios from "../apiAccessor/axiosApi";
import useAuth from "../hooks/useAuth";

const path = process.env.REACT_APP_AUCTION_API_URL;
const { auth } = useAuth();

const logIn = (email, password) => {
    const response = axios.get(`${path}/auth`, {
        
    })
}