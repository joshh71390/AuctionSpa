import axios from "../apiAccessor/axiosApi";
import useAuth from "./useAuth";
import { getTokensFromStorage } from '../utility/storage';

const useRefreshToken = () => {
    const { changeTokens, signOut } = useAuth();

    const refresh = async () => {
        const tokens = getTokensFromStorage();
        const response = await axios.post('/auth/refresh',
        JSON.stringify(tokens),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
        .then(response => response.data)
        .catch(() => signOut());

        const { accessToken, refreshToken } = response;
        const newTokens = { accessToken: accessToken.token, refreshToken: refreshToken };
        changeTokens(newTokens);
        
        return response.data.accessToken.token;
    }
    return refresh;
}

export default useRefreshToken;