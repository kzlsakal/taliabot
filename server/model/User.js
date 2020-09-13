import { driver, extract } from '../../database/index.js';

export const getUser = (name) => {
  const session = driver.session();
  name = name.toLowerCase();
  return session
    .run(
      'MATCH (n:User {name: $name}) RETURN n',
      { name }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    })
}

// getUser('kizilsakal1').then(res => console.log(res));