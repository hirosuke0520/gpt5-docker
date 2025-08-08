import { cookies } from 'next/headers';

export default function AuthHeader() {
  const hasJwt = cookies().get('crm_jwt');
  return (
    <div className="flex items-center gap-3">
      {hasJwt ? (
        <form action="/api/auth/logout" method="POST">
          <button className="text-sm underline" type="submit">Logout</button>
        </form>
      ) : (
        <a className="text-sm underline" href="/login">Login</a>
      )}
    </div>
  );
}
