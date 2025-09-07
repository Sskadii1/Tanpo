import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/constants";
import logoPath from "@assets/Artboard 2_1755664583240.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.08, duration: 0.6 } 
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center tanpopo-gradient overflow-hidden">

      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Main logo display */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-8 fade-in"
        >
          <div className="w-64 h-64 mx-auto mb-6">
            <img 
              src={logoPath} 
              alt="Tanpopo Academy Logo" 
              className="w-full h-full object-cover rounded-full shadow-2xl"
            />
          </div>
        </motion.div>
        
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-display font-bold text-tanpopo-green mb-8 leading-tight fade-in"
          data-testid="hero-title"
        >
          <div className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl mb-4">
            Tanpopo Academy
          </div>
          <div className="text-lg md:text-2xl lg:text-3xl xl:text-4xl font-normal text-tanpopo-beige">
            Mỗi trẻ một tài năng - Mỗi ngày một khám phá.
          </div>
        </motion.h1>
        

        
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center fade-in"
        >
          <button 
            onClick={() => scrollToSection('lien-he')}
            className="bg-tanpopo-green text-white px-8 py-4 rounded-full font-medium hover:bg-tanpopo-green/90 transition-all duration-300 hover-lift shadow-lg"
            data-testid="hero-register-button"
          >
            Đăng ký tham quan
          </button>
          <button 
            onClick={() => scrollToSection('chuong-trinh-hoc')}
            className="border-2 border-tanpopo-green text-tanpopo-green px-8 py-4 rounded-full font-medium hover:bg-tanpopo-green hover:text-white transition-all duration-300 hover-lift"
            data-testid="hero-programs-button"
          >
            Tìm hiểu chương trình
          </button>
        </motion.div>
      </div>
    </section>
  );
}
