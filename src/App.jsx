import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Admin from './pages/Admin';

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/admin"
          element={<Admin />}
        />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
              <Chatbot />
            </>
          }
        />
      </Routes>
    </>
  );
}
