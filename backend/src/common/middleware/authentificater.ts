import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { ResponseStatus, ServiceResponse } from '../models/serviceResponse';
import { handleServiceResponse } from '../utils/httpHandlers';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    const serviceResponse = new ServiceResponse(
      ResponseStatus.Failed,
      'No token provided',
      null,
      StatusCodes.UNAUTHORIZED
    );
    return handleServiceResponse(serviceResponse, res);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err) => {
    if (err) {
      const serviceResponse = new ServiceResponse(
        ResponseStatus.Failed,
        'Invalid Token',
        null,
        StatusCodes.UNAUTHORIZED
      );
      return handleServiceResponse(serviceResponse, res);
    }

    next();
  });
};

export default authenticateJWT;
