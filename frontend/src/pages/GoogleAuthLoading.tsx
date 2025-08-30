// src/pages/auth/success.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // nếu dùng React Router
import LoadingAuth from "../components/LoadingAuth";
import authApi from "../apis/authApi";
import { HttpStatusCode } from "axios";
import { useAuth } from "../contexts/AuthContext";
import cartApi from "../apis/cartApi";
import { getGuestToken } from "../utils";

const GoogleAuthLoading = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { login } = useAuth()

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)

            const result = await authApi.refresh()

            if (result.status !== HttpStatusCode.Ok) navigate('/login?error=Đăng nhập bằng google thất bại. Vui lòng thử lại sao')

            

            login(result.data.data.userInfo, result.data.data.accessToken)

            await cartApi.mergeCart(getGuestToken(), result.data.data.userInfo.id)

            setLoading(false)
            navigate('/')
        };

        fetchUser();
    }, [navigate]);

    if (loading) return <LoadingAuth />
    return <></>
}

export default GoogleAuthLoading
