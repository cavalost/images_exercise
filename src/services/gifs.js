const axios = require('axios');

const getGifs = async ({ search, limit, offset, rating, lang, api_key }) => {
    const { data: { data = [], pagination } } = await axios.get(`${process.env.GIPHY_API_URL}/search?api_key=${api_key}&q=${search}&limit=${limit}&offset=${offset}&rating=${rating}&lang=${lang}`);
    return {
        pagination,
        results: data.map(({ title, url }) => ({ title, url }))
    };
};

const getGifRandom = async ({ rating, lang, api_key }) => {
    const { data: { data = {} } } = await axios.get(`${process.env.GIPHY_API_URL}/random?api_key=${api_key}&rating=${rating}&lang=${lang}`);
    return {
        random: {
            title: data.title,
            url: data.url
        }
    };
};

module.exports = {
    getGifs,
    getGifRandom
};
