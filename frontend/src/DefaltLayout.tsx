import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import Navbar from './components/Header';
import { Outlet } from 'react-router-dom'
import { useLayoutEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getGuestToken, setGuestToken } from './utils';
import cartApi from './apis/cartApi';

const DefaultLayout = () => {
  const { userInfo } = useAuth()
  const didRun = useRef(false);


  useLayoutEffect(() => {
    const handleCart = async () => {
      if (getGuestToken()) return

      if (userInfo) {
        setGuestToken((await cartApi.getCartByUserId(userInfo.id || 0)).data.data.guestToken)
      } else {
        setGuestToken((await cartApi.createCartForGuest()).data.data.guestToken)
      }
    }

    if (!didRun.current) {
      handleCart()
      didRun.current = true;
    }
  }, [])

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout
