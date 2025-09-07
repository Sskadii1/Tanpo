export const TANPOPO_COLORS = {
  green: "#738D66", // Turf Green (Pantone 17-0119 TPX)
  white: "#E6E8E5", // Star White (Pantone 11-4202 TPX)  
  beige: "#C9A87C", // Beige (Pantone 14-1118 TPX)
};

export const SCROLL_OFFSET = 80; // Account for fixed header

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - SCROLL_OFFSET;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};

export const CONTACT_INFO = {
  address: "17-18 lô A43 KĐT Geleximco, đường Lê Trọng Tấn, phường Tây Mỗ, Hanoi, Vietnam",
  phone: "036-516-8305",
  email: "info@tanpopo.edu.vn",
  hours: {
    weekdays: "Thứ 2 - Thứ 7: 7:00 - 18:00",
    saturday: "Thứ 7: 8:00 - 12:00"
  }
};
