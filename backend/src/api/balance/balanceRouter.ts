import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

import authenticateJWT from '@/common/middleware/authentificater';
import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import alchemy from '@/common/utils/alchemy';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import BalanceViewModel from './viewModels/balance.viewModel';

export const balanceRegistry = new OpenAPIRegistry();

const BalanceViewModelSchema = z.object({
  contractAddress: z.string(),
  balance: z.string(),
  symbol: z.string().optional(),
  name: z.string().optional(),
  logo: z.string().optional(),
});

export const balancesRouter = (() => {
  const router = express.Router();

  balanceRegistry.registerPath({
    method: 'get',
    path: '/balance/:address',
    tags: ['Balance'],
    summary: 'Fetch token balances and metadata for a specific address',
    description: 'Fetches the token balances and metadata (name, symbol, logo) for a given Ethereum address.',
    parameters: [
      {
        name: 'address',
        in: 'path',
        required: true,
        description: 'The Ethereum address whose token balances and metadata are to be fetched.',
      },
    ],
    responses: {
      200: {
        description: 'Fetched token balances successfully',
        content: {
          'application/json': {
            schema: z.object({
              status: z.enum(['Success']),
              message: z.string(),
              responseObject: z.array(BalanceViewModelSchema),
              statusCode: z.number(),
            }),
          },
        },
      },
      401: {
        description: 'Unauthorized request (JWT authentication failure)',
        content: {
          'application/json': {
            schema: z.object({
              error: z.string(),
            }),
          },
        },
      },
    },
  });

  router.get('/:address', authenticateJWT, async (req: Request<{ address: string }>, res: Response) => {
    const { address } = req.params;

    const balances = await alchemy.core.getTokenBalances(address);

    // Fetch metadata for each token
    const tokenDetails = await Promise.all(
      balances.tokenBalances.map<Promise<BalanceViewModel>>(async (token) => {
        const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
        return {
          contractAddress: token.contractAddress,
          balance: (parseInt(token.tokenBalance ?? '0') / 10 ** (metadata.decimals ?? 18)).toFixed(4),
          symbol: metadata.symbol,
          name: metadata.name,
          logo: metadata.logo,
        };
      })
    );

    const serviceResponse = new ServiceResponse<BalanceViewModel[]>(
      ResponseStatus.Success,
      'Fetched Balances',
      tokenDetails,
      StatusCodes.OK
    );
    return handleServiceResponse(serviceResponse, res);
  });

  return router;
})();
