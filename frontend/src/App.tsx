import Footer from './components/Footer';
import Navbar from './components/NavBar';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  );
};

export default App
