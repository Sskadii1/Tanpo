import { motion } from "framer-motion";
import receptionImage from "@assets/image_1756826895703.png";
import hallwayImage from "@assets/image_1756826900682.png";
import classroomImage from "@assets/image_1756826924894.png";
import playAreaImage from "@assets/image_1756826929758.png";
import lockerImage from "@assets/image_1756826942179.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface FacilityCardProps {
  image: string;
  title: string;
  description: string;
}

function FacilityCard({ image, title, description }: FacilityCardProps) {
  return (
    <div className="text-center">
      <img 
        src={image}
        alt={title}
        className="rounded-xl w-full h-48 object-cover mb-4"
        data-testid={`facility-image-${title.toLowerCase().replace(/\s+/g, '-')}`}
      />
      <h4 className="font-display font-semibold text-tanpopo-green mb-2">{title}</h4>
      <p className="text-tanpopo-green/70 text-sm">{description}</p>
    </div>
  );
}

export default function Facilities() {
  const mainFacilities = [
    {
      title: "Phòng học thông minh",
      description: "Các phòng học được trang bị hệ thống âm thanh, ánh sáng tự nhiên và nội thất an toàn, tạo không gian học tập thoải mái và hiệu quả.",
      features: ["Bàn ghế ergonomic phù hợp với trẻ em", "Hệ thống điều hòa không khí hiện đại", "Bảng tương tác thông minh", "Khu vực đọc sách thoải mái"],
      image: receptionImage
    },
    {
      title: "Sân chơi an toàn",
      description: "Sân chơi ngoài trời rộng rãi với các thiết bị vui chơi đạt chuẩn quốc tế, giúp trẻ vận động và phát triển thể chất.",
      features: ["Cầu trượt và xích đu an toàn", "Sân bóng mini có mái che", "Khu vực cát trắng vệ sinh", "Camera giám sát 24/7"],
      image: hallwayImage
    }
  ];

  const additionalFacilities = [
    {
      image: classroomImage,
      title: "Khu ăn uống",
      description: "Thực đơn dinh dưỡng được chế biến tại chỗ"
    },
    {
      image: playAreaImage,
      title: "Phòng âm nhạc",
      description: "Không gian sáng tạo với nhạc cụ phù hợp"
    },
    {
      image: lockerImage,
      title: "Phòng y tế",
      description: "Chăm sóc sức khỏe tận tình và chuyên nghiệp"
    }
  ];

  return (
    <section id="co-so-vat-chat" className="py-20 bg-tanpopo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="facilities-title">
            Cơ sở vật chất
          </h2>
          <p className="text-xl text-tanpopo-green/70 max-w-3xl mx-auto">
            Không gian học tập hiện đại, an toàn và thân thiện, được thiết kế đặc biệt cho trẻ em mầm non
          </p>
        </motion.div>
        
        {mainFacilities.map((facility, index) => (
          <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center mb-16 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="fade-in"
            >
              <img 
                src={facility.image}
                alt={facility.title}
                className="rounded-2xl shadow-lg w-full h-auto"
                data-testid={`main-facility-${index}`}
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`fade-in ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}
            >
              <h3 className="text-3xl font-display font-semibold text-tanpopo-green mb-6">{facility.title}</h3>
              <p className="text-tanpopo-green/70 mb-6 text-lg">{facility.description}</p>
              <ul className="space-y-3 text-tanpopo-green/70">
                {facility.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="mr-3 text-tanpopo-green">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ))}
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 fade-in"
        >
          {additionalFacilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
