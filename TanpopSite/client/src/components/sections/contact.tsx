import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CONTACT_INFO } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.1, duration: 0.6 } 
  }),
};

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  childName: string;
  childAge: string;
  visitTime: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    childName: '',
    childAge: '',
    visitTime: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        toast({
          title: "Thành công!",
          description: "Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ."
        });
        setForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          childName: '',
          childAge: '',
          visitTime: ''
        });
      } else {
        throw new Error('Contact submission failed');
      }
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra",
        description: "Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Địa chỉ",
      content: [CONTACT_INFO.address]
    },
    {
      icon: "📞",
      title: "Điện thoại", 
      content: [CONTACT_INFO.phone]
    },
    {
      icon: "✉️",
      title: "Email",
      content: [CONTACT_INFO.email]
    },
    {
      icon: "🕒",
      title: "Giờ mở cửa",
      content: [CONTACT_INFO.hours.weekdays, CONTACT_INFO.hours.saturday]
    }
  ];

  return (
    <section id="lien-he" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-tanpopo-green mb-6" data-testid="contact-title">
            Liên hệ nhà trường
          </h2>
          <p className="text-xl text-tanpopo-green/70 max-w-3xl mx-auto">
            Hãy để lại thông tin để chúng tôi tư vấn và hỗ trợ bạn tốt nhất
          </p>
        </motion.div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-1 fade-in"
          >
            <h3 className="text-2xl font-display font-semibold text-tanpopo-green mb-6">Thông tin liên hệ</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4" data-testid={`contact-info-${index}`}>
                  <div className="w-10 h-10 bg-tanpopo-beige rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white">{info.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-tanpopo-green mb-1">{info.title}</h4>
                    {info.content.map((line, idx) => (
                      <p key={idx} className="text-tanpopo-green/70">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Contact Form */}
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 fade-in"
          >
            <form onSubmit={handleSubmit} className="bg-tanpopo-white rounded-2xl p-8" data-testid="contact-form">
              <h3 className="text-2xl font-display font-semibold text-tanpopo-green mb-6">Liên hệ và đăng ký tham quan</h3>
              
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="name" className="block text-tanpopo-green font-medium mb-2">
                    Họ và tên phụ huynh *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="border-tanpopo-green/20 focus:border-tanpopo-green"
                    data-testid="input-contact-name"
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
                    data-testid="input-contact-phone"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="email" className="block text-tanpopo-green font-medium mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="border-tanpopo-green/20 focus:border-tanpopo-green"
                    data-testid="input-contact-email"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="block text-tanpopo-green font-medium mb-2">
                    Chủ đề
                  </Label>
                  <Select value={form.subject} onValueChange={(value) => setForm({...form, subject: value})}>
                    <SelectTrigger className="border-tanpopo-green/20 focus:border-tanpopo-green" data-testid="select-contact-subject">
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit-registration">Đăng ký tham quan</SelectItem>
                      <SelectItem value="program-consultation">Tư vấn chương trình học</SelectItem>
                      <SelectItem value="fee-information">Thông tin học phí</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Child Information - Show when visit registration is selected */}
              {form.subject === 'visit-registration' && (
                <div className="grid md:grid-cols-3 gap-6 mb-6 p-4 bg-tanpopo-green/5 rounded-lg border border-tanpopo-green/20">
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
                        <SelectItem value="18-24-months">18-24 tháng</SelectItem>
                        <SelectItem value="2-years">2 tuổi</SelectItem>
                        <SelectItem value="3-years">3 tuổi</SelectItem>
                        <SelectItem value="4-years">4 tuổi</SelectItem>
                        <SelectItem value="5-years">5 tuổi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="visitTime" className="block text-tanpopo-green font-medium mb-2">
                      Thời gian mong muốn tham quan
                    </Label>
                    <Input
                      id="visitTime"
                      type="date"
                      value={form.visitTime}
                      onChange={(e) => setForm({...form, visitTime: e.target.value})}
                      className="border-tanpopo-green/20 focus:border-tanpopo-green"
                      data-testid="input-visit-time"
                    />
                  </div>
                </div>
              )}

              <div className="mb-6">
                <Label htmlFor="message" className="block text-tanpopo-green font-medium mb-2">
                  Tin nhắn *
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="border-tanpopo-green/20 focus:border-tanpopo-green"
                  placeholder="Xin chào, tôi muốn tìm hiểu thêm về chương trình học tại Tanpopo Academy..."
                  data-testid="textarea-contact-message"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-tanpopo-green text-white py-4 rounded-xl font-semibold hover:bg-tanpopo-green/90"
                data-testid="submit-contact"
              >
                {form.subject === 'visit-registration' ? 'Đăng ký tham quan' : 'Gửi tin nhắn'}
              </Button>
            </form>
          </motion.div>
        </div>
        
        {/* Map Section */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 fade-in"
        >
          <h3 className="text-2xl font-display font-semibold text-tanpopo-green mb-6 text-center">Vị trí trường học</h3>
          <div className="bg-tanpopo-white rounded-2xl p-4">
            <div className="w-full h-96 bg-tanpopo-green/10 rounded-xl flex items-center justify-center" data-testid="map-placeholder">
              <div className="text-center">
                <span className="text-4xl mb-4 block">🗺️</span>
                <p className="text-tanpopo-green font-medium">Bản đồ Google Maps</p>
                <p className="text-tanpopo-green/70 text-sm mt-2">{CONTACT_INFO.address}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
