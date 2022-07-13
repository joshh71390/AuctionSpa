import { useQuery } from "react-query";
import useAuthAxios from "./useAuthAxios";
import { useSearchParams } from "react-router-dom";

const useReviews = () => {
    const authAxios = useAuthAxios();
    const [search] = useSearchParams({});

    return useQuery(["reviews", search.toString()],
    async() => await authAxios.get('/reviews', {params: search})
    .then(response => response.data), 
    {
        staleTime: 120000
    })
}

export default useReviews