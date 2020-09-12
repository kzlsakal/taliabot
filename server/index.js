import { port, talia } from './talia.js';

talia.listen(port, () => console.log(`Talia listening on ${port}`));
