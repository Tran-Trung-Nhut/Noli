import { createContext, useState, type ReactNode, useContext, useEffect } from "react";
import authApi from "../apis/authApi";
import { setAccessTokenGetter, setAccessTokenSetter } from "../apis/axiosClient";
import cartItemApi from "../apis/cartItemApi";
import { HttpStatusCode } from "axios";
import { getGuestToken } from "../utils";

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
    numberOfProductInCart: number
    getNumberOfCartItemByUserId: (userId: number) => void
    getNumberOfCartItemByGuestToken: (guestToken: string | null) => void
    setAccessToken: (accessToken: string) => void  
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userInfo, setUserInfo] = useState<PublicUserInfo | null>(null)
    const [accessToken, setAccessToken] = useState<string>("")
    const [numberOfProductInCart, setNumberOfProductInCart] = useState<number>(0)

    const login = (userInfo: PublicUserInfo, accessToken: string) => {
        setUserInfo(userInfo);
        setAccessToken(accessToken)
    };

    const logout = () => {
        setUserInfo(null);
        setAccessToken("")
        setNumberOfProductInCart(0)
    };

    const getNumberOfCartItemByUserId = async (userId: number) => {
        const result = await cartItemApi.getCountByUserId(userId)

        if (result.status !== HttpStatusCode.Ok) return

        setNumberOfProductInCart(result.data)
    }

    const getNumberOfCartItemByGuestToken = async (guestToken: string | null) => {
        if (!guestToken) return

        const result = await cartItemApi.getCountByGuestToken(guestToken)

        if (result.status !== HttpStatusCode.Ok) return

        setNumberOfProductInCart(result.data)
    }

    const refreshAccessToken = async () => {
        const result = await authApi.refresh();
        login(result.data.userInfo, result.data.accessToken);
        if (result.data.userInfo) getNumberOfCartItemByUserId(result.data.userInfo.id)
        else getNumberOfCartItemByGuestToken(getGuestToken())
    };



    useEffect(() => {
        refreshAccessToken();
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
            numberOfProductInCart,
            getNumberOfCartItemByUserId,
            getNumberOfCartItemByGuestToken,
            setAccessToken
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
