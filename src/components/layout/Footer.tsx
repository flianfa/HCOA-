import React from 'react';
import { Terminal, Cpu, Network } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="h-10 px-6 flex items-center justify-between border-t border-outline-variant bg-surface-container-low text-xs text-on-surface-variant shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="font-semibold text-on-surface">系统状态: 正常</span>
        </div>
        <span className="opacity-40">|</span>
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span>WebSocket: 已连接</span>
        </div>
        <span className="opacity-40">|</span>
        <div className="flex items-center gap-2">
          <Network size={14} />
          <span>串口: COM4 (9600bps)</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="hover:text-primary underline-offset-4 hover:underline">系统日志</button>
        <button className="hover:text-primary underline-offset-4 hover:underline">API 文档</button>
      </div>
    </footer>
  );
};
