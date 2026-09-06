import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import ServiceGrid from "@/components/ServiceGrid/ServiceGrid";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <ServiceGrid />

        <section id="how-it-works" />

        <section id="developers" />
      </main>
    </>
  );
}