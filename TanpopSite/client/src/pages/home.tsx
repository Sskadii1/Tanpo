import { useEffect } from "react";
import TopNav from "@/components/layout/top-nav";
import HoverSidebar from "@/components/layout/hover-sidebar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import Programs from "@/components/sections/programs";
import Facilities from "@/components/sections/facilities";
import Staff from "@/components/sections/staff";

import Contact from "@/components/sections/contact";
import Testimonials from "@/components/sections/testimonials";

export default function Home() {
  useEffect(() => {
    // Fade in animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-tanpopo-white">
      <TopNav />
      <HoverSidebar />
      <main className="pt-16 lg:pl-16">
        <Hero />
        <Programs />
        <Facilities />
        <Staff />
        <Contact />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
