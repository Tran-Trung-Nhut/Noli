import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import Navbar from './components/Header';
import { Outlet } from 'react-router-dom'
import { useLayoutEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext';
import { getGuestToken, setGuestToken } from './utils';
import cartApi from './apis/cart.api';
import { HttpStatusCode } from 'axios';
import ScrollToTop from './contexts/ScrollToTop';

const DefaultLayout = () => {
  const { userInfo } = useAuth()
  const didRun = useRef(false);


  useLayoutEffect(() => {
    const handleCart = async () => {
      const guestToken = getGuestToken()


      if (userInfo && guestToken) {
        const result = await cartApi.isCartOwnedByUser(guestToken, userInfo.id)

        if (result.status !== HttpStatusCode.Ok) return
        if (!result.data.isOwned) {
          setGuestToken((await cartApi.getCartByUserId(userInfo.id || 0)).data.guestToken)
        }
      }

      if (userInfo) {
        setGuestToken((await cartApi.getCartByUserId(userInfo.id || 0)).data.data.guestToken)
      } else {
        if(!guestToken) setGuestToken((await cartApi.createCartForGuest()).data.data.guestToken)
      }
    }

    if (!didRun.current) {
      didRun.current = true;
    } else {
      handleCart()
    }
  }, [userInfo])

  return (
    <div>
      <ScrollToTop/>
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
