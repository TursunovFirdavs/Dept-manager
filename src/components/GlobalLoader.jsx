import { Loader2 } from "lucide-react";
import { Suspense } from "react";

// Router sahifalari uchun suspense loader
export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-dvh w-full bg-[#fafafa] dark:bg-[#0a0a0a]">
    <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-500" />
  </div>
);

// Suspense bilan o'rash uchun HOC
// eslint-disable-next-line react-refresh/only-export-components
export const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);
