import Hero from "@/components/sections/hero";
import Intro from "@/components/sections/intro";
import ClassesList from "@/components/sections/classes-list";
import FAQTimmings from "@/components/sections/faq-timmings";
import Contact from "@/components/sections/contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <ClassesList />
      <FAQTimmings />
      <Contact />
    </main>
  );
}
