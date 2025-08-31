// src/components/WakeOverlay.tsx
import React from "react";
import { useServerWake } from "../contexts/ServerStatusContext";
import logo from "../assets/logo.png"

const Dot: React.FC<{ delay: string }> = ({ delay }) => (
    <span
        className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-600 transform translate-y-0"
        style={{
            animation: "wake-bounce 0.9s cubic-bezier(.2,.8,.2,1) infinite",
            animationDelay: delay,
        }}
    />
);

const WakeOverlay: React.FC = () => {
    const { isAwake, isWaking } = useServerWake();

    // nếu server awake → không hiển thị
    if (isAwake || !isWaking) return null;

    return (
        <div
            aria-live="polite"
            role="status"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white/70 to-slate-50/70 backdrop-blur-sm"
        >
            <div className="w-[92%] max-w-md mx-auto p-6 rounded-2xl shadow-xl border border-white/30 bg-gradient-to-t from-white/60 to-white/30 backdrop-blur-md">
                <div className="flex flex-col items-center gap-4">
                    {/* logo + ring */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-indigo-200 to-pink-200 opacity-40 blur-xl animate-pulse" />
                        <div className="z-10 w-28 h-28 rounded-xl bg-white/90 border border-white/40 flex items-center justify-center shadow-md">
                            <img src={logo}/>
                        </div>
                    </div>

                    {/* headline */}
                    <h3 className="text-lg font-semibold text-slate-800">Đang gọi server dậy — chịu khó chốc nữa nhé!</h3>

                    {/* playful message */}
                    <p className="text-center text-sm text-slate-600 px-2">
                        Đang gõ đầu server để nó tỉnh lại phục vụ cho bạn. Thường mất khoảng <span className="font-medium text-indigo-600">~50 giây</span>.<br/>
                        Bạn có thể nhâm nhi 1 tách cà phê ☕ hoặc xem tíc tốc 1 tí — mình sẽ tự động tiếp tục khi server trả lời.
                    </p>

                    {/* loader: spinner + three dots */}
                    <div className="flex items-center gap-4 mt-1">

                        <div className="flex items-center gap-2">
                            <Dot delay="0s" />
                            <Dot delay="0.12s" />
                            <Dot delay="0.24s" />
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 mt-1">Khi server tỉnh dậy, trang sẽ tự động tiếp tục.</div>
                </div>
            </div>

            {/* keyframes: since Tailwind config may not have custom keyframes, we inject a small style block */}
            <style>{`
        @keyframes wake-bounce {
          0% { transform: translateY(0); opacity: 0.9; }
          30% { transform: translateY(-6px); opacity: 1; }
          60% { transform: translateY(0); opacity: 0.9; }
          100% { transform: translateY(0); opacity: 0.9; }
        }
      `}</style>
        </div>
    );
};

export default WakeOverlay;
