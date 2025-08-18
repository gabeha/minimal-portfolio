import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
        <p className="text-gray-500 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or has been
          disabled.
        </p>
        <Link href="/" className={buttonVariants({ variant: "link" })}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
