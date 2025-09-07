import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image: string;
  index: number;
}

function TestimonialCard({ quote, name, role, image, index }: TestimonialCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-8 hover-lift fade-in shadow-sm"
      data-testid={`testimonial-card-${index}`}
    >
      <div className="flex mb-4">
        <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
      </div>
      <p className="text-tanpopo-green/70 mb-6">{quote}</p>
      <div className="flex items-center">
        <img 
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full mr-4 object-cover"
          data-testid={`testimonial-image-${index}`}
        />
        <div>
          <h4 className="font-semibold text-tanpopo-green">{name}</h4>
          <p className="text-tanpopo-green/60 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Tanpopo là lựa chọn tuyệt vời cho con tôi. Các cô giáo rất tận tâm và môi trường học tập thật sự an toàn, sạch sẽ.",
      name: "Chị Nguyễn Lan Anh",
      role: "Phụ huynh bé Minh An",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
    },
    {
      quote: "Con tôi rất thích đi học ở đây. Mỗi ngày về nhà đều kể những điều thú vị và kiến thức mới học được.",
      name: "Anh Trần Đức Hòa", 
      role: "Phụ huynh bé Bảo Châu",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
    },
    {
      quote: "Phương pháp giáo dục ở Tanpopo giúp con tôi phát triển toàn diện cả về tri thức lẫn nhân cách.",
      name: "Chị Phạm Thu Hường",
      role: "Phụ huynh bé Kim Ngân", 
      image: "https://images.unsplash.com/photo-1494790108755-2616c96c5b81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60"
    }
  ];

  return (
    <section className="py-20 bg-tanpopo-beige/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="testimonials-title">
            Phụ huynh nói gì về chúng tôi
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
