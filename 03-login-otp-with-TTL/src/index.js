import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');


function otpKey(phone) {
    return `otp:${phone}`;
}

app.post('/send-otp', async (req, res) => {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redis.set(otpKey(phone), otp, 'EX', 30); // OTP valid for 30 seconds

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    console.log(`OTP Sent for ${phone}: ${otp}`); // In real app, send via SMS

    res.json({ message: 'OTP sent' , otp }); 
});

app.post('/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    const storedOtp = await redis.get(otpKey(phone));

    if (!phone || !otp) {
        return res.status(400).json({ error: 'Phone number and OTP are required' });
    }
    if(!storedOtp){
        return res.status(400).json({ error: 'OTP expired or not found' });
    }
    if(storedOtp != otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    await redis.del(otpKey(phone)); // Remove OTP after successful verification

    res.json({ message: 'OTP verified successfully' });
});

app.get('/otp/:phone/ttl', async (req, res) => {
    const { phone } = req.params;
    const ttl = await redis.ttl(otpKey(phone));
    res.json({ message: `OTP TTL for ${phone}`, ttl });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});