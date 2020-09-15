import React, { useState, useEffect } from 'react';
import axios from 'axios';

const scrollDown = () => {
  const view = document.getElementById('console');
  view.scrollTop = view.scrollHeight - view.clientHeight;
};

const enableInput = () => {
  const command = document.getElementById('command');
  command.disabled = false;
  command.focus();
};

const disableInput = () => {
  document.getElementById('command').disabled = true;
};


const focus = () => {
  document.getElementById('command').focus();
};

const returnRandomAction = (list, offered) => {
  const offeredActions = [];
  offered.forEach(action => offeredActions.push(action.action));
  list = list.filter(action => offeredActions.indexOf(action.properties.action) === -1);
  if (!list.length) {
    return;
  }
  const randomIdx = Math.floor(Math.random() * list.length);
  return list[randomIdx].properties;
};

const greetings = [
  [
    'hi, i am taliabot! you can say "train mood" or "train action" anytime after login.',
   'taliabot'
  ],
  [
    'my memory component is under the weather. please tell me your name :)',
    'taliabot-response'
  ]
];

const typeBot = (text) => [[
  text,
  'taliabot-response'
]];

const enter = (user, pin) => {
  return axios.post('/enter', { user, pin });
};

const setUserMood = (mood, user) => {
  return axios.post('/moods', { mood, user });
};

const getUserAction = (mood, user) => {
  return axios.get(`/actions/${mood}/${user}`);
};

const setUserAction = (action, mood, user) => {
  return axios.post('/actions', { action, mood, user });
};

const dislikeUserAction = (action, user) => {
  return axios.put('/actions/dislike', { action, user });
};

const getPublicAction = (mood, user) => {
  return axios.get(`/actions/public/${mood}/${user}`);
};

const helpers = {
  scrollDown,
  disableInput,
  enableInput,
  enter,
  focus,
  greetings,
  typeBot,
  getUserAction,
  returnRandomAction,
  setUserMood,
  dislikeUserAction,
  getPublicAction,
  setUserAction
};

export default helpers;
