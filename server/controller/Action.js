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
      + 'MERGE (m)-[d:DO]->(a) '
      + 'MERGE (u)-[f:FEEL]->(m) '
      + 'MERGE (u)-[p:PREFER]->(a) RETURN u, m, a',
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
