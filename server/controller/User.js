import { driver, extract } from '../../database/index.js';

export const createUser = (name, pin = '') => {
  const session = driver.session();
  name = name.toLowerCase();
  return session
    .run(
      'CREATE (n:User { name: $name, pin: $pin }) RETURN n',
      { name, pin }
    )
    .then(result => {
      session.close();
      return extract(result);
    })
    .catch(error => {
      throw error;
    });
};
