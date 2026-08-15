import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Stats from "./components/home/Stats";
import Systems from "./components/home/Systems";
import MapSection from "./components/home/Map";
import MyDino from "./components/home/MyDino";
import SkinEditor from "./components/home/SkinEditor";
import Voice from "./components/home/Voice";
import Rules from "./components/home/Rules";
import Support from "./components/home/Support";
import Community from "./components/home/Community";
import CTA from "./components/home/CTA";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Stats />
        <Systems />
        <MapSection />
        <MyDino />
        <SkinEditor />
        <Voice />
        <Rules />
        <Support />
        <Community />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
