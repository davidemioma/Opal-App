import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-100">404</h1>

        <h2 className="mb-4 text-3xl font-semibold text-gray-300">
          Oops! Page Not Found
        </h2>

        <p className="mb-8 text-xl text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 hover:bg-blue-600"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
