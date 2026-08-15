import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <h2 className="text-[#111827] font-medium text-xl mb-2">
        Page not found
      </h2>
      <p className="text-[#374151] text-sm leading-relaxed mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#111827] text-white text-sm font-semibold rounded-2xl hover:bg-[#374151] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
