
import Icon
 from "../shared/Icon";

export default function NavItem({ label, icon, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-4 py-3 
        text-white border border-white-700 rounded
        hover:bg-gray-800 transition-colors cursor-pointer
        ${active ? 'bg-gray-800' : ''}
      `}
    >
      <Icon name={icon} className="shrink-0" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}