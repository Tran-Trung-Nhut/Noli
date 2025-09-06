import { Loader2 } from "lucide-react";

const LoadingAuth = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex-col items-center justify-center">
        <div className="w-full flex items-center justify-center ">
          <Loader2 className="h-12 w-12 text-white animate-spin" />
        </div>
        <p className="text-center italic text-white mt-1">{message}</p>
      </div>
    </div>
  );
}

export default LoadingAuth