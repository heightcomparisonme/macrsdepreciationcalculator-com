"use client";

import { Home, Sparkles, HelpCircle, Video, Music, Mic, Gem, BookOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Sparkles, label: "AI Tools", href: "/ai-workstation", badge: "new" },
    { icon: BookOpen, label: "Glossary", href: "/glossary" },
    { icon: HelpCircle, label: "Help", href: "/docs" },
    { icon: Video, label: "Video", href: "/showcase", badge: "hot" },
    { icon: Music, label: "Music", href: "/posts", badge: "new" },
    { icon: Video, label: "Animation", href: "/pricing", badge: "new" },
    { icon: Mic, label: "Voice", href: "/discord" },
    { icon: Gem, label: "Premium", href: "/pricing" }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-14 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-4 z-50 hidden md:flex">
      <div className="mb-8">
        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col space-y-4">
        {sidebarItems.map((item, index) => {
          const isActive = pathname.includes(item.href) && item.href !== "/" ? true : pathname === item.href;

          return (
            <div key={index} className="relative group">
              <Link
                href={item.href}
                className={`w-8 h-8 flex items-center justify-center transition-colors rounded-lg ${
                  isActive
                    ? "text-sidebar-primary bg-sidebar-accent"
                    : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"
                }`}
              >
                <item.icon className="w-5 h-5" />
              </Link>

              {item.badge && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-xs flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </span>
              )}

              {/* Tooltip */}
              <div className="absolute left-12 top-0 bg-card border border-border px-2 py-1 rounded text-xs text-card-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;