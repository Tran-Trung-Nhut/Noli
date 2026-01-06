import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import authApi from "../apis/auth.api";
import { HttpStatusCode } from "axios";

type ServerWakeContextType = {
    isAwake: boolean;
    isWaking: boolean;
    wakeNow: () => Promise<void>;
};

const ServerWakeContext = createContext<ServerWakeContextType | undefined>(undefined);

export const ServerWakeProvider = ({ children }: { children: ReactNode }) => {
    const [isAwake, setIsAwake] = useState<boolean>(false);
    const [isWaking, setIsWaking] = useState<boolean>(false);
    const calledRef = useRef<boolean>(false);
    const showOverlayTimeout = useRef<number | null>(null);

    const wakeNow = async () => {
        if (calledRef.current) return;
        calledRef.current = true;
        setIsWaking(true);
        const result = await authApi.ping()

        if (result.status === HttpStatusCode.Ok) {
            setIsAwake(true)
        } else {
            setIsAwake(false)
        }

        if (showOverlayTimeout.current) {
            window.clearTimeout(showOverlayTimeout.current);
            showOverlayTimeout.current = null;
        }
    };

    useEffect(() => {
        // gọi 1 lần khi app mount
        // delay 350ms trước khi hiện overlay để tránh flicker nếu server rất nhanh
        showOverlayTimeout.current = window.setTimeout(() => {
            // chỉ show overlay nếu vẫn chưa awake
            // setIsWaking(true) handled inside wakeNow
        }, 350);

        // bắt đầu gọi ping 1 lần
        void wakeNow();

        return () => {
            if (showOverlayTimeout.current) window.clearTimeout(showOverlayTimeout.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ServerWakeContext.Provider value={{ isAwake, isWaking, wakeNow }}>
            {children}
        </ServerWakeContext.Provider>
    );
};

export const useServerWake = (): ServerWakeContextType => {
    const ctx = useContext(ServerWakeContext);
    if (!ctx) throw new Error("useServerWake must be used inside ServerWakeProvider");
    return ctx;
};
