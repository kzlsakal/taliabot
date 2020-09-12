import express from 'express';
export const talia = express();
export const port = process.env.PORT || 24528;

talia.get('/', (req, res) => {
  res.end('greetings from talia');
});
