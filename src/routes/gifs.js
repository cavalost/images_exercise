const { Router } = require('express');
const { getGifs, getGifRandom } = require('../services/gifs');

const router = Router();

router.get('/search', async (req, res, next) => {
    const { api_key } = req.headers;
    if (!api_key) next(new Error('You have to provide your API KEY!'));

    const {
        search,
        limit = 25,
        offset = 0,
        rating = 'g',
        lang = 'en'
    } = req.query;

    if (!search || !search.trim()) next(new Error('You have to provide a text to search!'));
    if (!['g', 'pg', 'pg-13', 'r'].includes(rating.toLowerCase())) next(new Error('Wrong content rating!'));
    try {
        const response = await getGifs({
            search: search.trim(),
            limit,
            offset,
            rating,
            lang,
            api_key
        });
        return res.json(response);
    } catch (error) {
        return next(new Error(error));
    }
});

router.get('/random', async (req, res, next) => {
    const { api_key } = req.headers;
    if (!api_key) next(new Error('You have to provide your API KEY!'));

    const {
        rating = 'g',
        lang = 'en'
    } = req.query;

    if (!['g', 'pg', 'pg-13', 'r'].includes(rating.toLowerCase())) next(new Error('Wrong content rating!'));
    try {
        const response = await getGifRandom({
            rating,
            lang,
            api_key
        });
        return res.json(response);
    } catch (error) {
        return next(new Error(error));
    }
});

module.exports = router;
