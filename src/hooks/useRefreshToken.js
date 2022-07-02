import axios from "../apiAccessor/axiosApi";
import useAuth from "./useAuth";
import { getTokensFromStorage } from '../utility/storage';

const useRefreshToken = () => {
    const { changeTokens } = useAuth();

    const refresh = async () => {
        const tokens = getTokensFromStorage();
        const response = await axios.post('/auth/refresh',
        JSON.stringify(tokens),
        {
            withCredentials: true
        });

        const newTokens = {
            accessToken: response.data.accessToken.token,
            refreshToken: response.data.refreshToken
        }
        changeTokens(newTokens);
        
        return response.data.accessToken.token;
    }
    return refresh;
}

export default useRefreshToken;