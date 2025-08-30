
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DefaultLayout from './DefaltLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './pages/Profile';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Checkout from './pages/Checkout';
import GoogleAuthLoading from './pages/GoogleAuthLoading';
import ProtectedRoute from './contexts/ProtectRoute';
import Shop from './pages/Shop';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/auth-google-result' element={<GoogleAuthLoading />} />
          <Route path='/' element={<DefaultLayout />}>
            <Route index element={<Home />} />               {/* đường dẫn "/" */}
            <Route path='/my-cart' element={<CartPage />} />
            <Route path='/product/:id' element={<ProductDetailPage />} />
            <Route path='/profile' element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path='/shop' element={<Shop/>}/>
            <Route path='/checkout' element={<Checkout />} />
          </Route>
          {/* <Route path='/login' element={<MaintenancePage/>}></Route> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App
