import { NextRequest } from 'next/server';
import { proxy } from '../_utils';

export async function GET(req: NextRequest) {
  return proxy(req, '/deals');
}
export async function POST(req: NextRequest) {
  return proxy(req, '/deals');
}
