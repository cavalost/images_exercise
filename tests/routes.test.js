const request = require('supertest');
const app = require('../src/app');

describe('Gifs', () => {
    it('should get gifs', async () => {
        let res = await request(app)
            .get('/gifs/search?search=sun')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('results');
        expect(res.body).toHaveProperty('pagination');

        let { pagination: { count }, results } = res.body;
        expect(count).toEqual(results.length);

        res = await request(app)
            .get('/gifs/search?search=asdfasdf')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('results');
        expect(res.body).toHaveProperty('pagination');

        ({ pagination: { count }, results } = res.body);
        expect(count).toEqual(results.length);
    });

    it('should get random gif', async () => {
        const res = await request(app)
            .get('/gifs/random')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('random');
        expect(res.body.random).toHaveProperty('title');
        expect(res.body.random).toHaveProperty('url');
    });

    it('should get error when no text to search', async () => {
        let res = await request(app)
            .get('/gifs/search')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You have to provide a text to search!');

        res = await request(app)
            .get('/gifs/search?search=')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You have to provide a text to search!');

        res = await request(app)
            .get('/gifs/search?search=%20')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You have to provide a text to search!');
    });

    it('should get error when rating is wrong', async () => {
        let res = await request(app)
            .get('/gifs/search?search=sun&rating=b')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Wrong content rating!');

        res = await request(app)
            .get('/gifs/random?rating=b')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Wrong content rating!');
    });

    it('should set rating', async () => {
        let res = await request(app)
            .get('/gifs/search?search=sun&rating=pg-13')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('results');
        expect(res.body).toHaveProperty('pagination');

        const { pagination: { count }, results } = res.body;
        expect(count).toEqual(results.length);

        res = await request(app)
            .get('/gifs/random?rating=pg-13')
            .set('api_key', process.env.api_key);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('random');
        expect(res.body.random).toHaveProperty('title');
        expect(res.body.random).toHaveProperty('url');
    });

    it('should get error when there is not a header', async () => {
        let res = await request(app)
            .get('/gifs/search?search=sun&rating=b')            
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You have to provide your API KEY!');

        res = await request(app)
            .get('/gifs/random?rating=b')
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('You have to provide your API KEY!');
    });
});

describe('Error 404', () => {
    it('should throw an error', async () => {
        const res = await request(app)
            .get('/gifs');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toEqual('Not Found');
    });
});
