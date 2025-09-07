import { motion } from "framer-motion";
import { scrollToSection } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface ProgramCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  color: string;
  index: number;
  large?: boolean;
}

function ProgramCard({ icon, title, description, features, image, color, index, large = false }: ProgramCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover-lift fade-in group"
      data-testid={`program-card-${index}`}
    >
      <div className={`grid ${large ? 'lg:grid-cols-5' : 'md:grid-cols-5'} gap-0 h-full`}>
        {/* Image Section */}
        <div className={`${large ? 'lg:col-span-2' : 'md:col-span-2'} relative overflow-hidden`}>
          <div 
            className="absolute inset-0 bg-gradient-to-br opacity-20"
            style={{ backgroundColor: color }}
          />
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className={`${large ? 'lg:col-span-3' : 'md:col-span-3'} p-8 flex flex-col justify-between ${large ? 'min-h-[350px]' : 'min-h-[280px]'}`}>
          <div>
            <h3 className="text-2xl font-display font-bold text-tanpopo-green mb-4">{title}</h3>
            <p className="text-tanpopo-green/70 mb-6 leading-relaxed">{description}</p>
            
            <ul className="space-y-2 mb-6">
              {features.slice(0, large ? 4 : 3).map((feature, idx) => (
                <li key={idx} className="flex items-center text-tanpopo-green/60">
                  <div 
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center justify-between">
            <button 
              className="px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{ backgroundColor: color }}
              onClick={() => scrollToSection('lien-he')}
            >
              Tìm hiểu thêm
            </button>
            <div className="text-tanpopo-green/40 text-sm">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const programs = [
    {
      icon: "🎨",
      title: "Sáng tạo & Nghệ thuật",
      description: "Phát triển khả năng sáng tạo, thẩm mỹ và tư duy nghệ thuật qua các hoạt động vẽ, tô màu, làm đồ chơi từ nguyên liệu tự nhiên.",
      features: ["Vẽ tranh tự do", "Tạo hình từ đất sét", "Làm đồ chơi handmade"],
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#FF6B6B"
    },
    {
      icon: "🧮",
      title: "Toán học sớm",
      description: "Làm quen với số học qua trò chơi và hoạt động thực hành, giúp trẻ hình thành tư duy logic cơ bản.",
      features: ["Đếm số qua trò chơi", "Nhận biết hình khối", "So sánh kích thước"],
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#4ECDC4"
    },
    {
      icon: "🌱",
      title: "Khám phá thiên nhiên",
      description: "Tìm hiểu về thế giới xung quanh qua việc trồng cây, chăm sóc động vật nhỏ và các thí nghiệm khoa học đơn giản.",
      features: ["Vườn rau mini", "Quan sát côn trùng", "Thí nghiệm nước"],
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#45B7D1"
    },
    {
      icon: "🗣️",
      title: "Phát triển ngôn ngữ",
      description: "Rèn luyện khả năng giao tiếp, kể chuyện và phát âm chuẩn qua các hoạt động đọc sách, kể chuyện cổ tích.",
      features: ["Đọc sách hàng ngày", "Kể chuyện sáng tạo", "Luyện phát âm"],
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#F7DC6F"
    },
    {
      icon: "🤸",
      title: "Thể chất & Vận động",
      description: "Phát triển sức khỏe và kỹ năng vận động qua các trò chơi thể thao phù hợp với lứa tuổi mầm non.",
      features: ["Yoga trẻ em", "Trò chơi vận động", "Thể dục nhịp điệu"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#BB8FCE"
    },
    {
      icon: "🤝",
      title: "Kỹ năng xã hội",
      description: "Học cách chia sẻ, hợp tác và giải quyết xung đột một cách hòa bình qua các hoạt động nhóm.",
      features: ["Hoạt động nhóm", "Học cách chia sẻ", "Giải quyết tranh cãi"],
      image: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      color: "#85C1E9"
    }
  ];

  return (
    <section id="chuong-trinh-hoc" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="programs-title">
            Chương trình học
          </h2>
          <p className="text-2xl text-tanpopo-green/70 max-w-3xl mx-auto">
            Tại Tanpopo Academy™, trẻ bắt đầu hành trình hội nhập toàn cầu qua giáo dục song ngữ, khám phá STEAM và nền tảng nuôi dưỡng bằng tình yêu thương và sáng tạo.
          </p>
        </motion.div>
        
        <div className="space-y-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
