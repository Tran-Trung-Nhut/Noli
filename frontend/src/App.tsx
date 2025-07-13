
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DefaultLayout from './DefaltLayout';
import Cart from './pages/Cart';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='*' element={<NotFound/>}/>
        <Route path='/' element={<DefaultLayout/>}>
          <Route path='/' element={<Home/>}/>
          <Route path='/my-cart' element={<Cart/>}/>
          <Route path='/product/:id' element={<ProductDetail/>}/>
        </Route>
        {/* <Route path='/login' element={<MaintenancePage/>}></Route> */}
      </Routes>
    </Router>
  );
};

export default App
