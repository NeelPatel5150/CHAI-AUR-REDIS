import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

const QUEUE_KEY = 'queue:email';

app.post('/send-email', async (req, res) => {
    const job = {
        to: req.body.to,
        subject: req.body.subject || 'No subject',
        body: req.body.body || 'No Content',
        createdAt: new Date().toISOString()
    }

    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.status(200).json({ message: 'Email job added to the queue', job });
});

app.get('/emails/process-one', async (req, res) => {
    const rawjob = await redis.rpop(QUEUE_KEY);
    if (!rawjob) {
        return res.status(404).json({ error: 'No email jobs in the queue' });
    }
    const job = JSON.parse(rawjob);
    // Simulate email sending
    console.log(`Sending email to ${job.to} with subject "${job.subject}"`);
    res.status(200).json({ message: 'Email Sent', job });
});

app.listen(3000, () => {
    console.log('Email queue server is running on http://localhost:3000');
});