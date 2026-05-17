import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/user/:id/json', async (req, res) => {
    await redis.set(`user:${req.params.id}:json`, JSON.stringify(req.body));
    res.json({ status: 'success', message: 'User data cached as JSON' });
});

app.get('/user/:id/json', async (req, res) => {
    const rawData = await redis.get(`user:${req.params.id}:json`);
    res.json({user:rawData ? JSON.parse(rawData) : null});
});

app.post('/user/:id/hash', async (req, res) => {
    await redis.hset(`user:${req.params.id}:hash`, req.body);
    res.json({ status: 'success', message: 'User data cached as Hash' });
});

app.get('/user/:id/hash', async (req, res) => {
    const data = await redis.hgetall(`user:${req.params.id}:hash`);
    res.json({user:data});
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});