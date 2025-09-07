import { scrollToSection, CONTACT_INFO } from "@/lib/constants";
import logoPath from "@assets/Artboard 2_1755664583240.png";

export default function Footer() {
  return (
    <footer className="bg-tanpopo-green text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src={logoPath} 
                alt="Tanpopo Academy Logo" 
                className="w-10 h-10 rounded-full object-cover bg-white p-1"
              />
              <span className="font-display font-semibold text-lg">Tanpopo Academy</span>
            </div>
            <p className="text-white/80 mb-4">
              Mỗi trẻ một tài năng, mỗi ngày một khám phá.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-facebook"
              >
                📘
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-instagram"
              >
                📷
              </a>
              <a 
                href="#" 
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                data-testid="footer-email"
              >
                📧
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Chương trình học</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <button 
                  onClick={() => scrollToSection('chuong-trinh-hoc')}
                  className="hover:text-white transition-colors"
                  data-testid="footer-programs"
                >
                  STEAM
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('chuong-trinh-hoc')}
                  className="hover:text-white transition-colors"
                >
                  MULTI-INTELLIGENCES
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('chuong-trinh-hoc')}
                  className="hover:text-white transition-colors"
                >
                  LANGUAGE DEVELOPMENT
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('chuong-trinh-hoc')}
                  className="hover:text-white transition-colors"
                >
                  PRE-PRIMARY EDUCATION
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Thông tin</h3>
            <ul className="space-y-2 text-white/80">
              <li>
                <button 
                  onClick={() => scrollToSection('doi-ngu')}
                  className="hover:text-white transition-colors"
                  data-testid="footer-staff"
                >
                  Đội ngũ giáo viên
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('co-so-vat-chat')}
                  className="hover:text-white transition-colors"
                  data-testid="footer-facilities"
                >
                  Cơ sở vật chất
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('tuyen-sinh')}
                  className="hover:text-white transition-colors"
                  data-testid="footer-admissions"
                >
                  Tuyển sinh
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('lien-he')}
                  className="hover:text-white transition-colors"
                  data-testid="footer-contact"
                >
                  Hỗ trợ
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-semibold mb-4">Liên hệ nhà trường</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>📍 {CONTACT_INFO.address}</li>
              <li>📞 {CONTACT_INFO.phone}</li>
              <li>✉️ {CONTACT_INFO.email}</li>
              <li>🕒 {CONTACT_INFO.hours.weekdays}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>&copy; 2025 Tanpopo Academy. All Rights Reserved. </p>
        </div>
      </div>
    </footer>
  );
}
