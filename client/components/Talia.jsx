import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import Line from './Line.jsx'
import helpers from '../helpers/index.jsx';

const Styled = {
  Global: createGlobalStyle`
    html {
      height: 100%;
      position: relative;
      width: 100%;
    }
    body {
      background-color: rgb(40, 42, 55);
      box-style: border-box;
      color: rgb(190, 195, 205);
      font-family: monospace, sans-serif;
      font-size: 24px;
      font-size: 1.5vmax;
      height: 100%;
      margin: 0;
      overflow: hidden;
      position: relative;
      width: 100%;
      user-select: none;
    }
    form {
      display: inline;
    }
    #talia {
      height: 100%;
      width: 100%;
    }
  `,
  Console: styled.section`
    border: 0.1rem solid rgb(190, 195, 205);
    cursor: pointer;
    height: 90%;
    margin: 1rem;
    padding: 1rem;
    position: relative;
    scrollbar-width: none;
    overflow-y: scroll;
    user-select: none;
    &::-webkit-scrollbar {
      display: none;
    }
    & p {
      margin: 0;
    }
    & .taliabot {
      color: rgb(140, 235, 250);
    }
    & .taliabot-response {
      color: rgb(255, 180, 110);
    }
    & .user-command::before {
      content: "> ";
    }
  `,
  Command: styled.input`
    border: 0;
    background-color: rgb(40, 42, 55);
    color: rgb(190, 195, 205);
    cursor: pointer;
    font-family: monospace, sans-serif;
    font-size: 24px;
    font-size: 1.5vmax;
    height: 24px;
    height: 1.5vmax;
    width: 90%;
    &:focus {
      outline: none;
    }
  `,
  Submit: styled.input`
    display: none;
  `,
};

const Talia = () => {
  const [ terminal, type ] = useState([...helpers.greetings]);
  const [ guest, setGuest ] = useState('user');
  const [ stage, setStage ] = useState('username');
  const [ currentMood, setMood ] = useState('normal');
  const [ currentAction, setAction ] = useState('wait');
  const [ offered, offer ] = useState([]);

  const respond = {};

  respond.checkLogin = (answer) => {
    let loggedIn = true;
    if (stage === 'username' || stage === 'pin') {
      type(terminal.concat(
        [[answer, 'user-command']],
        helpers.typeBot('love your enthusiasm! please login first.')
      ));
      loggedIn = false;
    }
    return loggedIn;
  }

  respond.checkTraining = (answer) => {
    let training = false;
    if (answer.indexOf('train action') > -1) {
      training = true;
      const loggedIn = respond.checkLogin(answer);
      if (!loggedIn) {
        return training;
      }
      setStage('trainAction');
      type(terminal.concat(
        [[answer, 'user-command']],
        helpers.typeBot(`awesome! you are training me for "${currentMood}". `
        + '[action name, change mood to x, abort]')
      ));
    }
    if (answer.indexOf('train mood') > -1) {
      training = true;
      const loggedIn = respond.checkLogin(answer);
      if (!loggedIn) {
        return training;
      }
      setStage('trainMood');
      type(terminal.concat(
        [[answer, 'user-command']],
        helpers.typeBot(
          'i love ideas! how do people feel sometimes? [mood type, abort]'
        )
      ));
    }
    return training;
  }

  respond.username = (user) => {
    const isTraining = respond.checkTraining(user);
    if (isTraining) {
      return;
    }
    setGuest({ user });
    type(terminal.concat(
      [[user, 'user-command']],
      helpers.typeBot('... and your pin please')
    ));
    setStage('pin');
  };

  respond.pin = (pin) => {
    const isTraining = respond.checkTraining(pin);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    helpers.enter(guest.user, pin)
      .then(res => {
        setStage('feeling');
        const user = res.data[0];
        if (res.status === 200) {
          type(terminal.concat(helpers.typeBot(
            `Welcome back ${guest.user}! How are you feeling today?`
          )));
          return;
        }
        if (res.status === 201) {
          type(terminal.concat(helpers.typeBot(
            `${guest.user}, you are now one of us! How are you feeling today?`
          )));
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          respond.retry();
          return;
        }
      });
      setTimeout(helpers.enableInput, 1000);
  };

  respond.retry = (answer) => {
    helpers.disableInput();
    setGuest('user');
    setStage('username');
    type(terminal.concat(helpers.typeBot(
      'hmm. try again with the right pin or choose a new name.'
    )));
    setTimeout(helpers.enableInput, 1000);
  }

  respond.feeling = (mood, disliked) => {
    const isTraining = respond.checkTraining(mood);
    if (isTraining) {
      return;
    }
    let dislikePrompt = [];
    if (disliked) {
      dislikePrompt = helpers.typeBot(`i won't talk about ${disliked} anymore.`);
    }
    helpers.disableInput();
    setMood(mood);
    helpers.setUserMood(mood, guest.user)
      .then(() => helpers.getUserAction(mood, guest.user))
      .then(res => {
        const action = helpers.returnRandomAction(res.data, offered);
        if (!action) {
          setStage('moreActions');
          type(terminal.concat(
            [[mood, 'user-command']],
            dislikePrompt,
            helpers.typeBot(
              `sorry, i don't have anything new for "${mood}". `
              + '[add action, recommend]'
            )
          ));
          return;
        }
        offer([action, ...offered]);
        setAction(action);
        setStage('decide');
        type(terminal.concat(
          [[mood, 'user-command']],
          dislikePrompt,
          helpers.typeBot(
            `you may try ${action.action}! what do you think? `
            + '[never, another, yes]'
          )
        ));
      });
      setTimeout(helpers.enableInput, 1000);
  };

  respond.decide = (answer) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    switch(answer) {
      case 'never':
        setStage('feeling');
        helpers.dislikeUserAction(currentAction.action, guest.user)
          .then(() => {
            respond.feeling(currentMood, currentAction.action);
          });
        break;
      case 'another':
        setStage('feeling');
        respond.feeling(currentMood);
        break;
      case 'yes':
        helpers.setUserAction(currentAction.action, currentMood, guest.user)
          .then(() => {
            let authorPrompt = '';
            if (currentAction.author !== guest.user) {
              authorPrompt = `It was recommended by ${currentAction.author} `;
            }
            setStage('decideToTrain');
            type(terminal.concat(
              [[answer, 'user-command']],
              helpers.typeBot(
                `i'm glad that helped! ${authorPrompt}Would you like to train `
                + 'me? [yes, no]'
              )
            ));
          });
          break;
    }
    setTimeout(helpers.enableInput, 1000);
  };

  respond.moreActions = (answer, disliked) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    let dislikePrompt = [];
    if (disliked) {
      dislikePrompt = helpers.typeBot(`i won't talk about ${disliked} anymore.`);
    }
    helpers.disableInput();
    switch (answer) {
      case 'add action':
        setStage('trainAction');
        type(terminal.concat(
          [[answer, 'user-command']],
          helpers.typeBot(`you are training me for "${currentMood}". `
          + '[action name, change mood to x, abort]')
        ));
        break;
      case 'recommend':
        helpers.getPublicAction(currentMood, guest.user)
        .then(res => {
          const action = helpers.returnRandomAction(res.data, offered);
          if (!action) {
            setStage('moreActions');
            type(terminal.concat(
              [[answer, 'user-command']],
              dislikePrompt,
              helpers.typeBot(
                `sorry, nothing new yet about "${currentMood}" from others. `
                + '[train action]'
              )
            ));
            return;
          }
          offer([action, ...offered]);
          setAction(action);
          setStage('decidePublic');
          type(terminal.concat(
            [[answer, 'user-command']],
            dislikePrompt,
            helpers.typeBot(
              `you may try ${action.action}! what do you think? `
              + '[never, another, yes]'
            )
          ));
        });
        break;
    }
    setTimeout(helpers.enableInput, 1000);
  };

  respond.decidePublic = (answer) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    switch(answer) {
      case 'never':
        helpers.dislikeUserAction(currentAction.action, guest.user)
        .then(() => {
            setStage('moreActions');
            respond.moreActions('recommend', currentAction.action);
          });
        break;
      case 'another':
        setStage('moreActions');
        respond.moreActions('recommend');
        break;
      case 'yes':
        helpers.setUserAction(currentAction.action, currentMood, guest.user)
          .then(() => {
            let authorPrompt = '';
            if (currentAction.author !== guest.user) {
              authorPrompt = `It was recommended by ${currentAction.author} `;
            }
            setStage('decideToTrain');
            type(terminal.concat(
              [[answer, 'user-command']],
              helpers.typeBot(
                `i'm glad that helped! ${authorPrompt}`
                + 'Would you like to train me? [yes, no]'
              )
            ));
          });
          break;
    }
    setTimeout(helpers.enableInput, 1000);
  };

  respond.decideToTrain = (answer) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    switch(answer) {
      case 'yes':
        setStage('trainAction');
        type(terminal.concat(
          [[answer, 'user-command']],
          helpers.typeBot(
            `awesome! you are training me for "${currentMood}". `
            + '[action name, change mood to x, abort]'
          )
        ));
        break;
      case 'no':
        setStage('feeling');
        type(terminal.concat(
          [[answer, 'user-command']],
          helpers.typeBot(
            'no worries! let me know if you want any other recommendations [mood]'
          )
        ));
        break;
    }
    setTimeout(helpers.enableInput, 1000);
  }

  respond.trainAction = (answer) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    if (answer.indexOf('change mood to ') > -1) {
      const mood = answer.replace('change mood to ', '');
      setMood(mood);
      helpers.setUserMood(mood, guest.user)
        .then(() => {
          type(terminal.concat(
            [[answer, 'user-command']],
            helpers.typeBot(
              `now training for "${mood}". [action name, change mood to x, abort]`
            )
          ));
        });
    } else if (answer === 'abort') {
      setStage('feeling');
      type(terminal.concat(
        [[answer, 'user-command']],
        helpers.typeBot(
          'no worries! let me know if you want any other recommendations [mood]'
        )
      ));
    } else {
      helpers.setUserAction(answer, currentMood, guest.user)
        .then(res => {
          const action = res.data[0].properties;
          offer([action, ...offered]);
          setAction(action);
          type(terminal.concat(
            [[answer, 'user-command']],
            helpers.typeBot(
              `you are amazing! what else you got for "${currentMood}"? `
              + '[action, change mood to x, abort]'
            )
          ));
        });
    }
    setTimeout(helpers.enableInput, 1000);
  }

  respond.trainMood = (answer) => {
    const isTraining = respond.checkTraining(answer);
    if (isTraining) {
      return;
    }
    helpers.disableInput();
    if (answer === 'abort') {
      setStage('feeling');
        type(terminal.concat(
          [[answer, 'user-command']],
          helpers.typeBot(
            'no worries! let me know if you want any other recommendations [mood]'
          )
        ));
    } else {
      setMood(answer);
      helpers.setUserMood(answer, guest.user)
        .then(res => {
          type(terminal.concat(
            [[answer, 'user-command']],
            helpers.typeBot(
              'you are beautiful! what else can you think of? [mood type, abort]'
            )
          ));
        });
    }

    setTimeout(helpers.enableInput, 1000);
  }

  const typeConsole = (event) => {
    event.preventDefault();
    const userInput = event.target.children[0];
    if (userInput.value !== '') {
      respond[stage](userInput.value.toLowerCase());
      userInput.value = '';
    }
  };


  useEffect(helpers.scrollDown);

  return (
    <Styled.Console id="console" onClick={helpers.focus}>
      <Styled.Global />
        {terminal.map((line, idx) => (
          <Line key={'l' + idx} line={line} idx={'l' + idx} />
        ))}
        <form onSubmit={typeConsole} spellCheck="false" autoComplete="off">
            > <Styled.Command id="command" autoFocus maxLength="50" />
            <Styled.Submit type="submit" />
        </form>
    </Styled.Console>
  );
};

export default Talia;
