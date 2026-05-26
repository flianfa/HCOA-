import React from 'react';
import { Settings2, PlayCircle, Activity, Share2, HelpCircle, ShieldCheck, ArrowDownToLine } from 'lucide-react';
import { ScreenId } from '../../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate }) => {
  const menuItems = [
    { id: ScreenId.CONNECTION_CONFIG, label: '连接', icon: Settings2 },
    { id: ScreenId.FUNCTIONAL_TEST, label: '功能测试', icon: PlayCircle },
    { id: ScreenId.STRESS_TEST, label: '压力测试', icon: Activity },
    { id: ScreenId.NETWORK_TOPOLOGY, label: '拓扑结构', icon: Share2 },
    { id: ScreenId.OTA_TOOL, label: 'OTA工具', icon: ArrowDownToLine },
  ];

  const bottomItems = [
    { label: '系统诊断', icon: ShieldCheck },
    { label: '帮助', icon: HelpCircle },
  ];

  return (
    <nav className="w-64 bg-surface-container border-r border-outline-variant flex flex-col h-full shrink-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-on-surface tracking-tight">HCOA Suite</h1>
        <p className="text-xs text-on-surface-variant mt-1 font-mono">V2.4.0 Stable</p>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || (item.id === ScreenId.STRESS_TEST && currentScreen === ScreenId.STRESS_TEST_DASHBOARD);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : ''} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="px-3 py-6 border-t border-outline-variant space-y-1">
        {bottomItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
