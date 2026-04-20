import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';

const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div className="min-h-screen bg-black-primary" />}>
              <Admin />
            </Suspense>
          }
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
