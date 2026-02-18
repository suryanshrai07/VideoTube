import { Home, ThumbsUp, History, Video, Folder, Users, HelpCircle, Settings } from 'lucide-react';

const iconMap = {
  'home': Home,
  'thumbs-up': ThumbsUp,
  'history': History,
  'video': Video,
  'folder': Folder,
  'users': Users,
  'help-circle': HelpCircle,
  'settings': Settings
};

export default function Icon({ name, className = "" }) {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) return null;
  
  return <IconComponent className={className} size={20} />;
}