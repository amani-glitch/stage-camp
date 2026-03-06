import { SpotsProvider } from '../context/SpotsContext';
import Hero from '../components/Hero';
import About from '../components/About';
import Objectives from '../components/Objectives';
import Pillars from '../components/Pillars';
import Eligibility from '../components/Eligibility';
import Schedule from '../components/Schedule';
import Info from '../components/Info';
import InscriptionForm from '../components/InscriptionForm';

export default function Home() {
  return (
    <SpotsProvider>
      <main>
        <Hero />
        <About />
        <Objectives />
        <Pillars />
        <Eligibility />
        <Schedule />
        <Info />
        <InscriptionForm />
      </main>
    </SpotsProvider>
  );
}
