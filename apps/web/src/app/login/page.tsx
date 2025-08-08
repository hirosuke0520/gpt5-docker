"use client";
import React from 'react';

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="input input-bordered w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="input input-bordered w-full border rounded p-2" />
        </div>
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
