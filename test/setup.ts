import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(
  // This function is going to be executed before every single test across all of different spec files
  async () => {
    try {
      await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (err) {}
  },
);
