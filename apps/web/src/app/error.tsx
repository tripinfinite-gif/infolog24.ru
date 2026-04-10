"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Что-то пошло не так</h1>
      <p className="mt-4 text-lg text-gray-600">
        {error.message || "Произошла непредвиденная ошибка"}
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
      >
        Попробовать снова
      </button>
    </main>
  );
}
