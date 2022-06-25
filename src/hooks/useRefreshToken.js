import axios from "../apiAccessor/axiosApi";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/auth/refresh', {
            withCredentials: true
        });

        setAuth(previous => {
            return {...previous, accessToken: response.data.accessToken.token }
        });
        return response.data.accessToken.token;
    }
    return refresh;
}

export default useRefreshToken;