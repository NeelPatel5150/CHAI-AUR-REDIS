import express from "express";
import { Queue } from "bullmq";
import { emailQueue, connection } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", (req, res) => {
  const job = emailQueue.add("welcome-email", {
    to: req.body.to,
    name: req.body.name || "Customer",
  },
{
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
});
  res.json({ message: "Welcome email job has been added to the queue", jobId: job.id });
});

app.listen(3000, () => {
  console.log("Server is running http://localhost:3000");
});
