import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import { setAccessTokenGetter, setAccessTokenSetter } from "../apis/axios.client";
import authApi from "../apis/auth.api";

export type PublicUserInfo = {
    id: number,
    firstName: string,
    lastName: string,
    image: string,
    role: string
}

type AuthContextType = {
    userInfo: PublicUserInfo | null
    accessToken: string
    isLoading: boolean
    login: (userInfo: PublicUserInfo, accessToken: string) => void;
    logout: () => void
    setLoading: (isLoading: boolean) => void
    setAccessToken: (accessToken: string) => void
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [userInfo, setUserInfo] = useState<PublicUserInfo | null>(null);
    const [accessToken, setAccessToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const login = (userInfo: PublicUserInfo, accessToken: string) => {
        setUserInfo(userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        setAccessToken(accessToken)
        localStorage.setItem("accessToken", accessToken);
        setIsLoading(false);
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem("userInfo");
        setAccessToken("")
        localStorage.removeItem("accessToken");
    };


    // const refreshAccessToken = async () => {
    //     const result = await authApi.refresh();
    //     login(result.data.userInfo, result.data.accessToken);
    // };

    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    }

    useEffect(() => {
        const storedUserInfo = localStorage.getItem("userInfo") as string
        const storedAccessToken = localStorage.getItem("accessToken")
        if (storedUserInfo && storedUserInfo !== 'undefined' && storedUserInfo !== 'null' && storedAccessToken) {
            setUserInfo(JSON.parse(storedUserInfo));
            setAccessToken(storedAccessToken);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        setAccessTokenGetter(() => accessToken)
        setAccessTokenSetter((accessToken: string) => setAccessToken(accessToken))
    }, [accessToken])

    return (
        <AuthContext.Provider value={{
            login,
            logout,
            userInfo,
            accessToken,
            setAccessToken,
            setLoading,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
