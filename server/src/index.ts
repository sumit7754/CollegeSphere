import { initServer } from './app';
import * as dotenv from 'dotenv';

dotenv.config();

const init = async () => {
  try {
    const app = await initServer();
    app.listen(8000, () => console.log(`Server started at PORT: 8000`));
  } catch (error) {
    console.error('Failed to start the server:', error);
  }
};

init();
