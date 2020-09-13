import express from 'express';
import model from './model/index.js';
import controller from './controller/index.js';
export const talia = express();
export const port = process.env.PORT || 24528;

talia.use(express.json());

talia.get('/', (req, res) => {
  res.end('greetings from talia');
});

/**
 * Get user's moods
 */
talia.get('/moods/:user', (req, res) => {
  model.getUserMoods(req.params.user)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Get user's actions for a mood
 */
talia.get('/actions/:mood/:user', (req, res) => {
  const { user, mood } = req.params;
  model.getUserActions(user, mood)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Get public actions for the user's mood
 */
talia.get('/actions/public/:mood/:user', (req, res) => {
  const { user, mood } = req.params;
  model.getPublicActions(user, mood)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Add a new mood for the user
 */
talia.post('/moods', (req, res) => {
  const { user, mood } = req.body;
  if (user === undefined || !mood) {
    res.header(400).end('Invalid request.');
    return;
  }
  controller.setMood(user, mood)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Add a new action for the user's mood
 */
talia.post('/actions', (req, res) => {
  const { user, action, mood } = req.body;
  if (user === undefined || !action || !mood) {
    res.header(400).end('Invalid request.');
    return;
  }
  controller.setAction(user, action, mood)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Dislike an action for the user
 */
talia.put('/actions/dislike', (req, res) => {
  const { user, action } = req.body;
  if (user === undefined || !action) {
    res.header(400).end('Invalid request.');
    return;
  }
  controller.dislikeAction(user, action)
    .then(result => res.json(result).end())
    .catch(error => res.header(500).end('Something went wrong.'));
});

/**
 * Login or enroll new user
 */
talia.post('/enter', (req, res) => {
  const { user, pin } = req.body;
  if (user === undefined || pin === undefined) {
    res.header(400).end('Invalid password or user name.');
    return;
  }
  model.getUser(user)
    .then(result => {
      if (!result.length) {
        controller.createUser(user, pin)
        .then(result => res.header(201).json(result).end())
        .catch(error => res.header(500).end('Something went wrong.'));
        return;
      }
      if (result[0].properties.pin === pin) {
        res.json(result).end();
        return;
      }
      res.header(401).end('Invalid password or user name.');
    })
    .catch(error => res.header(500).end('Something went wrong.'));
});
