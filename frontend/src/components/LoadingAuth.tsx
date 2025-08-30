import { Loader2 } from "lucide-react";

const LoadingAuth = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <Loader2 className="h-12 w-12 text-white animate-spin" />
    </div>
  );
}

export default LoadingAuth