import axios from '../apiAccessor/axiosApi';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

const useItems = () => {
    const [search] = useSearchParams({
        forSale: true,
        sortBy: 'dateDesc'
    });

    return useQuery(['filter', search.toString()], 
    async () => await axios.get('lots/sale', {params: search})
    .then(res => res.status !== 404 ? res.data : []), {
        staleTime: 120000
    })
}

export default useItems