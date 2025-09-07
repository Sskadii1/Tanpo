import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface StaffCardProps {
  name: string;
  position: string;
  description: string;
  skills: string[];
  image: string;
  index: number;
}

function StaffCard({ name, position, description, skills, image, index }: StaffCardProps) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-tanpopo-white rounded-2xl p-8 text-center hover-lift fade-in shadow-sm"
      data-testid={`staff-card-${index}`}
    >
      <img 
        src={image}
        alt={`${name} - ${position}`}
        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        data-testid={`staff-image-${index}`}
      />
      <h3 className="font-display font-semibold text-tanpopo-green mb-2">{name}</h3>
      <p className="text-tanpopo-beige font-medium mb-3">{position}</p>
      <p className="text-tanpopo-green/70 text-sm mb-4">{description}</p>
      <div className="flex justify-center flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span 
            key={idx}
            className="bg-tanpopo-green/10 text-tanpopo-green px-3 py-1 rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Staff() {
  const staff = [
    {
      name: "Cô Nguyễn",
      position: "Hiệu trưởng",
      description: "15 năm kinh nghiệm trong lĩnh vực giáo dục mầm non. Thạc sĩ Tâm lý học Trẻ em.",
      skills: ["Tâm lý học", "Lãnh đạo"],
      image: "https://images.unsplash.com/photo-1494790108755-2616c96c5b81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Cô Trần", 
      position: "Giáo viên chính",
      description: "8 năm kinh nghiệm giảng dạy. Chuyên về phát triển ngôn ngữ và sáng tạo.",
      skills: ["Ngôn ngữ", "Sáng tạo"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    },
    {
      name: "Cô Lê",
      position: "Giáo viên nghệ thuật",
      description: "Chuyên gia về giáo dục thẩm mỹ và phát triển khả năng sáng tạo cho trẻ.",
      skills: ["Nghệ thuật", "Thẩm mỹ"],
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=300"
    }
  ];

  const stats = [
    { number: "15+", label: "Năm kinh nghiệm trung bình" },
    { number: "100%", label: "Giáo viên có bằng cấp chuyên môn" },
    { number: "24/7", label: "Hỗ trợ phụ huynh" }
  ];

  return (
    <section id="doi-ngu" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="staff-title">
            Đội ngũ giáo viên
          </h2>
          <p className="text-xl text-tanpopo-green/70 max-w-3xl mx-auto">
            Đội ngũ giáo viên tận tâm, giàu kinh nghiệm và được đào tạo chuyên nghiệp trong lĩnh vực giáo dục mầm non
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {staff.map((member, index) => (
            <StaffCard key={index} {...member} index={index} />
          ))}
        </div>
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-tanpopo-beige/20 rounded-2xl p-8 fade-in"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} data-testid={`staff-stat-${index}`}>
                <div className="text-3xl font-bold text-tanpopo-green mb-2">{stat.number}</div>
                <p className="text-tanpopo-green/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
