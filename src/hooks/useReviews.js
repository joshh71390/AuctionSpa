import { useQuery } from "react-query";
import useAuthAxios from "./useAuthAxios";

const useReviews = () => {
    const authAxios = useAuthAxios();

    return useQuery(["lot"],
    async() => await authAxios.get('/reviews')
    .then(response => response.data), 
    {
        staleTime: 120000
    })
}

export default useReviews