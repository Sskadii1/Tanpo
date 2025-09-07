import { scrollToSection } from "@/lib/constants";

interface SidebarItemProps {
  icon: string;
  label: string;
  sectionId: string;
}

function SidebarItem({ icon, label, sectionId }: SidebarItemProps) {
  return (
    <button
      onClick={() => scrollToSection(sectionId)}
      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-tanpopo-green/5 transition-colors cursor-pointer w-full text-left"
      data-testid={`sidebar-${sectionId}`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-tanpopo-green">
        {label}
      </span>
    </button>
  );
}

export default function HoverSidebar() {
  return (
    <aside className="group fixed top-16 left-0 bottom-0 z-40 hidden lg:block">
      <div className="h-full bg-tanpopo-white/95 backdrop-blur-md border-r border-tanpopo-green/10 transition-all duration-300 overflow-hidden w-16 group-hover:w-64">
        <div className="p-3 space-y-2">
          <SidebarItem icon="📘" label="Chương trình học" sectionId="chuong-trinh-hoc" />
          <SidebarItem icon="🏫" label="Cơ sở vật chất" sectionId="co-so-vat-chat" />
          <SidebarItem icon="👩‍🏫" label="Đội ngũ" sectionId="doi-ngu" />
          <SidebarItem icon="📞" label="Liên hệ & Đăng ký" sectionId="lien-he" />
        </div>
        <div className="absolute bottom-4 left-3 right-3">
          <a 
            href="/admin" 
            className="block text-sm text-tanpopo-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            data-testid="sidebar-admin"
          >
            → Admin (/admin)
          </a>
        </div>
      </div>
    </aside>
  );
}
