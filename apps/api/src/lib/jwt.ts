import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRES_IN = '7d';

export type JwtPayload = {
  sub: string; // user id
  role: 'admin' | 'member';
};

export function signJwt(payload: JwtPayload, secret: string, expiresIn: string = DEFAULT_EXPIRES_IN) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJwt<T = JwtPayload>(token: string, secret: string): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch {
    return null;
  }
}
