import express from 'express';
import Redis from 'ioredis';

const app = express();
const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.use(express.json());

app.post('/notifications', async (req, res) => {
  const payload = {
    title: req.body.title || 'Default Title',
    createdAt: new Date().toISOString()
  };
    const reciver = await publisher.publish('notifications', JSON.stringify(payload));

    console.log(`Notification published to ${reciver} subscribers: ${JSON.stringify(payload)}`);
    
    res.json({ message: `Notification Sent to ${reciver} subscribers`, payload }); 
});

app.listen(3000, () => {
  console.log('Server is running http://localhost:3000');
});