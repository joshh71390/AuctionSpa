import { authAxios } from "../apiAccessor/axiosApi";
import { useEffect } from "react";
import useAuth from "./useAuth";

const useAuthAxios = () => {
    const { auth } = useAuth();

    useEffect(() => {
        const requestInterceptor = authAxios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseInterceptor = authAxios.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newToken = "token_placeholder";
                    prevRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return authAxios(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            authAxios.interceptors.request.eject(requestInterceptor);
            authAxios.interceptors.response.eject(responseInterceptor);
        }
    }, [auth])

    return authAxios;
}

export default useAuthAxios;

