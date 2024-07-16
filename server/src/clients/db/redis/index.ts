import Redis from 'ioredis';

export const redisClient = new Redis(
  'rediss://default:AXYnAAIncDE0NmZkNWU5NGQyYTQ0OTQ3YTA0ZDU0OWMyNzUzYjU5NHAxMzAyNDc@gentle-mongoose-30247.upstash.io:6379',
);
