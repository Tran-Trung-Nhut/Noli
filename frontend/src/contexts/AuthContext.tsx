import { HttpStatusCode } from "axios";
import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import authApi from "../apis/authApi";

export type PublicUserInfo = {
    id: number,
    firstName: string,
    lastName: string,
    image: string
}

type AuthContextType = {
    userInfo: PublicUserInfo | null
    accessToken: string
    login: (userInfo: PublicUserInfo, accessToken: string) => void;
    logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<PublicUserInfo | null>(null)
    const [accessToken, setAccessToken] = useState<string>("")

    const login = (userInfo: PublicUserInfo, accessToken: string) => {
        setUserInfo(userInfo);
        setAccessToken(accessToken)
    };

    const logout = () => {
        setUserInfo(null);
        setAccessToken("")
    };

    const refreshAccessToken = async () => {
        const result = (await authApi.refresh());

        if (result.status !== HttpStatusCode.Ok) return

        login(result.data.data.userInfo, result.data.data.accessToken);
    };

    useEffect(() => {
        refreshAccessToken();
    }, []);

    return (
        <AuthContext.Provider value={{ login, logout, userInfo, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
