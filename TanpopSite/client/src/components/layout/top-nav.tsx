import { useState } from "react";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/constants";
import logoPath from "@assets/Artboard 2_1755664583240.png";

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-tanpopo-white/95 backdrop-blur-md border-b border-tanpopo-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoPath} 
              alt="Tanpopo Academy Logo" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-display font-semibold text-tanpopo-green text-lg">
              Tanpopo Academy
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleLinkClick('chuong-trinh-hoc')}
              className="text-tanpopo-green hover:text-tanpopo-beige transition-colors duration-200"
              data-testid="nav-programs"
            >
              Chương trình học
            </button>
            <button 
              onClick={() => handleLinkClick('co-so-vat-chat')}
              className="text-tanpopo-green hover:text-tanpopo-beige transition-colors duration-200"
              data-testid="nav-facilities"
            >
              Cơ sở vật chất
            </button>
            <button 
              onClick={() => handleLinkClick('doi-ngu')}
              className="text-tanpopo-green hover:text-tanpopo-beige transition-colors duration-200"
              data-testid="nav-staff"
            >
              Đội ngũ
            </button>

            <button 
              onClick={() => handleLinkClick('lien-he')}
              className="text-tanpopo-green hover:text-tanpopo-beige transition-colors duration-200"
              data-testid="nav-contact"
            >
              Liên hệ & Đăng ký
            </button>
            <a 
              href="/portal" 
              className="bg-tanpopo-green text-white px-4 py-2 rounded-full hover:bg-tanpopo-green/90 transition-colors duration-200"
              data-testid="nav-login"
            >
              Đăng nhập
            </a>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-tanpopo-white border-t border-tanpopo-green/10">
          <div className="px-4 py-2 space-y-2">
            <button 
              onClick={() => handleLinkClick('chuong-trinh-hoc')}
              className="block w-full text-left py-2 text-tanpopo-green hover:text-tanpopo-beige"
              data-testid="mobile-nav-programs"
            >
              Chương trình học
            </button>
            <button 
              onClick={() => handleLinkClick('co-so-vat-chat')}
              className="block w-full text-left py-2 text-tanpopo-green hover:text-tanpopo-beige"
              data-testid="mobile-nav-facilities"
            >
              Cơ sở vật chất
            </button>
            <button 
              onClick={() => handleLinkClick('doi-ngu')}
              className="block w-full text-left py-2 text-tanpopo-green hover:text-tanpopo-beige"
              data-testid="mobile-nav-staff"
            >
              Đội ngũ
            </button>
            <button 
              onClick={() => handleLinkClick('lien-he')}
              className="block w-full text-left py-2 text-tanpopo-green hover:text-tanpopo-beige"
              data-testid="mobile-nav-contact"
            >
              Liên hệ & Đăng ký
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
