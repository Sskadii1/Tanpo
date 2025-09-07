import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface RegistrationForm {
  parentName: string;
  phone: string;
  childName: string;
  childAge: string;
  visitTime: string;
}

export default function Admissions() {
  const { toast } = useToast();
  const [form, setForm] = useState<RegistrationForm>({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '',
    visitTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.parentName || !form.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        toast({
          title: "Thành công!",
          description: "Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
        });
        setForm({
          parentName: '',
          phone: '',
          childName: '',
          childAge: '',
          visitTime: ''
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.",
        variant: "destructive"
      });
    }
  };

  const processList = [
    {
      step: "1",
      title: "Đăng ký tham quan",
      description: "Liên hệ để đặt lịch tham quan cơ sở vật chất và tìm hiểu chương trình học."
    },
    {
      step: "2", 
      title: "Nộp hồ sơ",
      description: "Chuẩn bị hồ sơ gồm giấy khai sinh, giấy khám sức khỏe và hình ảnh của bé."
    },
    {
      step: "3",
      title: "Phỏng vấn & Làm quen", 
      description: "Buổi gặp gỡ giữa giáo viên, phụ huynh và bé để hiểu rõ nhu cầu và tính cách."
    },
    {
      step: "4",
      title: "Nhập học",
      description: "Hoàn tất thủ tục và bắt đầu hành trình học tập cùng Tanpopo Academy."
    }
  ];

  const pricingPlans = [
    {
      title: "Gói Bán trú",
      price: "100.000.000đ",
      period: "/tháng",
      features: [
        "Thời gian: 7:30 - 17:00",
        "3 bữa ăn + 2 bữa phụ", 
        "Hoạt động ngoại khóa",
        "Đưa đón tận nhà"
      ],
      highlight: true
    },
    {
      title: "Gói Nửa ngày", 
      price: "100.000.000đ",
      period: "/tháng",
      features: [
        "Thời gian: 7:30 - 11:30",
        "1 bữa phụ",
        "Học cơ bản", 
        "Phù hợp bé nhỏ"
      ],
      highlight: false
    }
  ];

  return (
    <section id="tuyen-sinh" className="py-20 bg-tanpopo-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="admissions-title">
            Tuyển sinh & Học phí
          </h2>
          <p className="text-xl text-tanpopo-green/70 max-w-3xl mx-auto">
            Thông tin chi tiết về quy trình tuyển sinh và học phí cho năm học mới
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Admission Process */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="fade-in"
          >
            <h3 className="text-3xl font-display font-semibold text-tanpopo-green mb-8">Quy trình tuyển sinh</h3>
            <div className="space-y-6">
              {processList.map((item, index) => (
                <div key={index} className="flex items-start space-x-4" data-testid={`admission-step-${index}`}>
                  <div className="w-8 h-8 bg-tanpopo-green text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-tanpopo-green mb-2">{item.title}</h4>
                    <p className="text-tanpopo-green/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Pricing */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="fade-in"
          >
            <h3 className="text-3xl font-display font-semibold text-tanpopo-green mb-8">Học phí</h3>
            <div className="space-y-6">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index}
                  className={`bg-white rounded-xl p-6 border-2 ${plan.highlight ? 'border-tanpopo-green/20' : 'border-tanpopo-beige'}`}
                  data-testid={`pricing-plan-${index}`}
                >
                  <h4 className="font-display font-semibold text-tanpopo-green mb-4 text-xl">{plan.title}</h4>
                  <div className="text-3xl font-bold text-tanpopo-green mb-4">
                    {plan.price}<span className="text-lg font-normal">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 text-tanpopo-green/70">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-tanpopo-beige/20 rounded-xl">
              <p className="text-sm text-tanpopo-green/70">
                <strong>Ưu đãi:</strong> Giảm 0% học phí tháng đầu cho bé đăng ký trước 31/12. 
                đồng phục và sách vở trong tháng đầu.
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Quick Registration Form */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 shadow-lg fade-in"
        >
          <h3 className="text-2xl font-display font-semibold text-tanpopo-green mb-6 text-center" data-testid="registration-form-title">
            Đăng ký tham quan ngay
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6" data-testid="registration-form">
            <div>
              <Label htmlFor="parentName" className="block text-tanpopo-green font-medium mb-2">
                Tên phụ huynh *
              </Label>
              <Input
                id="parentName"
                type="text"
                required
                value={form.parentName}
                onChange={(e) => setForm({...form, parentName: e.target.value})}
                className="border-tanpopo-green/20 focus:border-tanpopo-green"
                data-testid="input-parent-name"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="block text-tanpopo-green font-medium mb-2">
                Số điện thoại *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({...form, phone: e.target.value})}
                className="border-tanpopo-green/20 focus:border-tanpopo-green"
                data-testid="input-phone"
              />
            </div>
            <div>
              <Label htmlFor="childName" className="block text-tanpopo-green font-medium mb-2">
                Tên bé
              </Label>
              <Input
                id="childName"
                type="text"
                value={form.childName}
                onChange={(e) => setForm({...form, childName: e.target.value})}
                className="border-tanpopo-green/20 focus:border-tanpopo-green"
                data-testid="input-child-name"
              />
            </div>
            <div>
              <Label htmlFor="childAge" className="block text-tanpopo-green font-medium mb-2">
                Tuổi bé
              </Label>
              <Select value={form.childAge} onValueChange={(value) => setForm({...form, childAge: value})}>
                <SelectTrigger className="border-tanpopo-green/20 focus:border-tanpopo-green" data-testid="select-child-age">
                  <SelectValue placeholder="Chọn tuổi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-months-2-years">12  - 24  tháng</SelectItem>
                  <SelectItem value="2-3-years">2 - 3 tuổi</SelectItem>
                  <SelectItem value="3-4-years">3 - 4 tuổi</SelectItem>
                  <SelectItem value="4-5-years">4 - 5 tuổi</SelectItem>
                  <SelectItem value="5-6-years">5 - 6 tuổi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="visitTime" className="block text-tanpopo-green font-medium mb-2">
                Thời gian mong muốn tham quan
              </Label>
              <Input
                id="visitTime"
                type="datetime-local"
                value={form.visitTime}
                onChange={(e) => setForm({...form, visitTime: e.target.value})}
                className="border-tanpopo-green/20 focus:border-tanpopo-green"
                data-testid="input-visit-time"
              />
            </div>
            <div className="md:col-span-2">
              <Button 
                type="submit" 
                className="w-full bg-tanpopo-green text-white py-4 rounded-xl font-semibold hover:bg-tanpopo-green/90"
                data-testid="submit-registration"
              >
                Đăng ký tham quan
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
