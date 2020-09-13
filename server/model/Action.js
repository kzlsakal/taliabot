import { driver, extract, neo4jInt } from '../../database/index.js';

export const getUserActions = (user, mood, limit = 30) => {
  const session = driver.session();
  user = user.toLowerCase();
  mood = mood.toLowerCase();
  limit = neo4jInt(limit);
  return session
    .run(
      'MATCH (u:User {name: $user})-[:PREFER]->(a:Action)<-[:DO]-'
      + '(m:Mood {mood: $mood}) WHERE (u)-[:FEEL]->(m) RETURN a LIMIT $limit',
      { user, mood, limit }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};

export const getPublicActions = (user, mood, limit = 30) => {
  const session = driver.session();
  user = user.toLowerCase();
  mood = mood.toLowerCase();
  limit = neo4jInt(limit);
  return session
    .run(
      'MATCH (m:Mood {mood: $mood})-[:DO]->(a:Action), (u:User {name: $user}) '
      + 'WHERE NOT (u)-[:DISLIKE]->(a) RETURN a LIMIT $limit',
      { user, mood, limit }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};
