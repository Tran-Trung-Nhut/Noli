import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import Navbar from './components/Header';
import {Outlet} from 'react-router-dom'

const DefaultLayout = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar />
      <main>
        <Outlet/>
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout
