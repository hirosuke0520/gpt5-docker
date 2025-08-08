import { NextRequest } from 'next/server';
import { proxy } from '../../_utils';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/companies/${params.id}`);
}
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/companies/${params.id}`);
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return proxy(req, `/companies/${params.id}`);
}
