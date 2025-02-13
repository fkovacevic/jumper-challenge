import request from 'supertest';

import { app } from '@/server';

describe('GET /:address - Authentication Required', () => {
  it('should return 401 if no authentication is provided', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';

    const response = await request(app).get(`/balances/${address}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });
});
