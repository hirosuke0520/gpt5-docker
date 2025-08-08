"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-sm text-red-600">
      Failed to load leads: {error.message}
      <button className="ml-2 underline" onClick={reset}>Retry</button>
    </div>
  );
}