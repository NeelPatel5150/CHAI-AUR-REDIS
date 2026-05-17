import {Worker} from 'bullmq';
import {emailQueue, connection} from './queue.js';

const worker = new Worker(
  'email',
  async (job) => {
    console.log('Processing job with data:', job.id,job.name, job.data)
  await new Promise((resolve) => setTimeout(resolve, 1500)),
  console.log('Email Job completed:', job.id, job.name, job.data)
  },
    {connection}
);

worker.on('completed', (job) => {
  console.log(`Job name ${job.name} with id ${job.id} has been completed, ${job.data}`);
});

worker.on('failed', (job, err) => {
  console.error(`Job name ${job.name} with id ${job.id} has failed with error:`, err);
});