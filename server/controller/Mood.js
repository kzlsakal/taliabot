import { driver, extract } from '../../database/index.js';

export const setMood = (user, mood) => {
  const session = driver.session();
  user = user.toLowerCase();
  mood = mood.toLowerCase();
  return session
    .run(
      'MERGE (u:User {name: $user}) MERGE (m:Mood {mood: $mood}) '
      + 'MERGE (u)-[f:FEEL]->(m) RETURN m',
      { user, mood }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};
