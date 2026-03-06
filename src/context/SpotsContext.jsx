import { createContext, useContext, useState, useEffect } from 'react';

const SpotsContext = createContext({ remaining: 40, decrement: () => {} });

export function SpotsProvider({ children }) {
  const [remaining, setRemaining] = useState(40);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/api/stats`)
      .then((r) => r.json())
      .then((d) => setRemaining(d.remaining))
      .catch(() => {});
  }, []);

  const decrement = () => setRemaining((prev) => Math.max(0, prev - 1));

  return (
    <SpotsContext.Provider value={{ remaining, decrement }}>
      {children}
    </SpotsContext.Provider>
  );
}

export function useSpots() {
  return useContext(SpotsContext);
}
