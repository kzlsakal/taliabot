import { driver, extract } from '../../database/index.js';

export const setAction = (user, action, mood) => {
  const session = driver.session();
  user = user.toLowerCase();
  action = action.toLowerCase();
  mood = mood.toLowerCase();
  return session
    .run(
      'MERGE (u:User {name: $user}) '
      + 'MERGE (m:Mood {mood: $mood}) '
      + 'MERGE (a:Action {action: $action}) '
      + 'ON CREATE SET a.author = $user '
      + 'MERGE (m)-[d:DO]->(a) '
      + 'MERGE (u)-[f:FEEL]->(m) '
      + 'MERGE (u)-[p:PREFER]->(a) RETURN a',
      { user, action, mood }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};

export const dislikeAction = (user, action) => {
  const session = driver.session();
  user = user.toLowerCase();
  action = action.toLowerCase();
  return session
    .run(
      'MERGE (u:User {name: $user}) '
      + 'MERGE (a:Action {action: $action}) '
      + 'MERGE (u)-[p:DISLIKE]->(a) RETURN a',
      { user, action }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};
