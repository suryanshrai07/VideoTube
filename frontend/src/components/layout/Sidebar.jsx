import { useState } from "react";
import NavItem from "../navigation/NavigationItems";
import { mainNavItems, bottomNavItems } from "../../data/sidebarData";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState(1);

  return (
    <aside className="w-55 sm:w-60 md:w-70 hidden bg-black h-full sm:flex flex-col p-4  border-r border-[#EAECF0]">
      <nav className="flex flex-col gap-2 ">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.id} 
            label={item.label}
            icon={item.icon}
            active={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </nav>

      <div className="flex-1" />

      <nav className="flex flex-col gap-2">
        {bottomNavItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={activeItem === item.id}
            onClick={() => setActiveItem(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
}
