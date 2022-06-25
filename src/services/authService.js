import axios from "../apiAccessor/axiosApi";
import { setUser, removeUser } from "../utility/userStorage";

const path = process.env.REACT_APP_AUCTION_API_URL;

const logIn = async (email, password) => {
    const body = JSON.stringify({ email, password });
    await axios.post(`${path}/auth`, body)
        .then(response => {
            if (response.status === 200){
                setUser(response.data);
            }
        });
}

const logOut = () => removeUser();

export { logIn, logOut }