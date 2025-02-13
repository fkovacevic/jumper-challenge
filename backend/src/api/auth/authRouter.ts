import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ethers } from 'ethers';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import SignUpRequestModel from './request-models/signUp.requestModel';

const JWT_SECRET = process.env.JWT_SECRET!;
export const authRegistry = new OpenAPIRegistry();

type User = {
  address: string;
  accessToken: string;
};

// Database Mock
const users: User[] = [];

const SignUpRequestSchema = z.object({
  address: z.string().min(42).max(42),
  message: z.string(),
  signature: z.string(),
});

export const authRouter = (() => {
  const router = express.Router();

  authRegistry.registerPath({
    method: 'post',
    path: '/auth/sign-up',
    tags: ['Authentication'],
    summary: 'Sign up a new user by verifying an Ethereum signature',
    request: {
      body: {
        content: {
          'application/json': {
            schema: SignUpRequestSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Account created successfully',
      },
      401: {
        description: "Provided Address Doesn't match the signature",
      },
    },
  });

  router.post('/sign-up', (req: Request<void, void, SignUpRequestModel>, res: Response) => {
    const { address, message, signature } = req.body;

    const resolvedAddress = ethers.verifyMessage(message, signature);

    if (resolvedAddress !== address) {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        "Provided Address Doesn't match the signature",
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(serviceResponse, res);
    }

    const accessToken = jwt.sign({ address }, JWT_SECRET, { expiresIn: '24h' });

    // Mock saving of user in DB
    users.push({ address, accessToken });

    const serviceResponse = new ServiceResponse(
      ResponseStatus.Success,
      'Created Account',
      accessToken,
      StatusCodes.CREATED
    );

    return handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
