import { driver, extract } from '../../database/index.js';

export const getUserMoods = (user) => {
  const session = driver.session();
  user = user.toLowerCase();
  return session
    .run(
      'MATCH (u:User {name: $user})-[:FEEL]->(m:Mood) RETURN m',
      { user }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};
