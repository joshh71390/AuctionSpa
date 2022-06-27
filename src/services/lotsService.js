import axios from '../apiAccessor/axiosApi';

const path = process.env.REACT_APP_AUCTION_API_URL;

const getSaleLots = async () => {
    return await axios.get(`${path}/lots/sale`)
    .then(response => response.data);
}

export {getSaleLots}