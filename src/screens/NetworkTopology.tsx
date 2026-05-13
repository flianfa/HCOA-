import React, { useState } from 'react';
import { RotateCcw, Maximize, ZoomIn, ZoomOut, X, Network, Signal, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { ScreenProps } from '../types';

interface TopologyNode {
  id: string;
  name: string;
  mac: string;
  level: number;
  parentId: string | null;
  rssi: string;
  quality: string;
  upSpeed: string;
  downSpeed: string;
  status: 'online' | 'offline';
  type: 'CCO' | 'STA';
}

export const NetworkTopology: React.FC<ScreenProps> = ({ onNavigate }) => {
  const [selectedNode, setSelectedNode] = useState<TopologyNode | null>({
    id: '0x01',
    name: 'STA_NODE_1',
    mac: 'AA:BB:CC:DD:EE:01',
    level: 2,
    parentId: '0x00',
    rssi: '-45 dBm',
    quality: '92.00%',
    upSpeed: '12.4 Mbps',
    downSpeed: '45.2 Mbps',
    status: 'online',
    type: 'STA'
  });

  const nodes: TopologyNode[] = [
    { id: '0x00', name: 'CCO', mac: 'AA:BB:CC:DD:EE:00', level: 1, parentId: null, rssi: '0 dBm', quality: '100%', upSpeed: '-', downSpeed: '-', status: 'online', type: 'CCO' },
    { id: '0x01', name: 'STA_01', mac: 'AA:BB:C1', level: 2, parentId: '0x00', rssi: '-42', quality: '95', upSpeed: '12', downSpeed: '45', status: 'online', type: 'STA' },
    { id: '0x02', name: 'STA_02', mac: 'AA:BB:C2', level: 2, parentId: '0x00', rssi: '-48', quality: '88', upSpeed: '10', downSpeed: '38', status: 'online', type: 'STA' },
    { id: '0x04', name: 'STA_04', mac: 'AA:BB:C4', level: 3, parentId: '0x01', rssi: '-55', quality: '82', upSpeed: '8', downSpeed: '30', status: 'online', type: 'STA' },
    { id: '0x05', name: 'STA_05', mac: 'AA:BB:C5', level: 3, parentId: '0x01', rssi: '-58', quality: '80', upSpeed: '7', downSpeed: '28', status: 'online', type: 'STA' },
  ];

  const getLevelColor = (level: number, type: string) => {
    if (type === 'CCO') return 'border-[#ffeb3b] bg-[#fffde7]'; // Yellow
    if (level === 2) return 'border-[#4a90e2] bg-[#f0f7ff]'; // Blue (LV1 in common terms)
    if (level === 3) return 'border-[#2ecc71] bg-[#f0fff4]'; // Green (LV2)
    return 'border-[#dbe3f1] bg-white';
  };

  return (
    <div className="h-full flex flex-col bg-[#f8faff] overflow-hidden relative">
      {/* Header Bar */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-[#dbe3f1] bg-white shrink-0">
        <h2 className="text-xl font-bold text-[#2c3e50] flex items-center gap-3">
          <Network className="text-[#4a4bd7]" size={24} />
          拓扑浏览器
        </h2>
        <button className="flex items-center gap-2 px-6 py-2 bg-[#4a4bd7] text-white rounded-lg font-bold shadow-md hover:opacity-90 transition-all font-sans">
          <RotateCcw size={18} />
          刷新拓扑
        </button>
      </div>

      {/* Breadcrumb line */}
      <div className="px-8 py-3 flex justify-between items-center bg-white border-b border-[#f0f3f8] text-sm shrink-0">
        <div className="flex items-center gap-2">
           <span className="text-[#7f8c8d]">节点数:</span>
           <span className="font-bold text-[#4a4bd7]">12 ↑</span>
        </div>
        <button className="text-[#7f8c8d] hover:text-[#4a4bd7] font-medium">[重置视图]</button>
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative overflow-hidden bg-dot-pattern">
        {/* Connection Lines (Refined to match node positions) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
           <defs>
             <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
               <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.4" />
               <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.1" />
             </linearGradient>
           </defs>
           {/* CCO to LV1 Nodes */}
           <line x1="50%" y1="15%" x2="35%" y2="45%" stroke="url(#lineGrad)" strokeWidth="2" />
           <line x1="50%" y1="15%" x2="50%" y2="45%" stroke="url(#lineGrad)" strokeWidth="2" />
           
           {/* STA_01 (LV1) to its Children */}
           <line x1="35%" y1="48%" x2="25%" y2="75%" stroke="url(#lineGrad)" strokeWidth="2" />
           <line x1="35%" y1="48%" x2="45%" y2="75%" stroke="url(#lineGrad)" strokeWidth="2" />
        </svg>

        {/* Tree Nodes (Simulated Positions) */}
        <div className="absolute inset-0 p-12">
          {/* CCO Root */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[10%] group">
            <div className={`w-36 h-20 border-2 rounded-lg flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 ${getLevelColor(1, 'CCO')}`}>
              <span className="font-bold text-[#2c3e50] tracking-wide">CCO</span>
            </div>
          </div>

          {/* Level 1 Nodes */}
          <div className="absolute left-[35%] -translate-x-1/2 top-[40%]">
             <div className="w-44 h-24 border-2 rounded-lg p-3 shadow-md flex flex-col justify-center items-center text-center transition-all cursor-pointer hover:scale-105 hover:shadow-xl bg-[#f0f7ff] border-[#4a90e2]" onClick={() => setSelectedNode(nodes[1])}>
                <p className="text-xs font-bold text-[#2c3e50] mb-1">TEI: 0x01</p>
                <p className="text-[10px] text-[#7f8c8d] font-mono break-all opacity-80 uppercase leading-none">AA:BB:CC:DD:EE:01</p>
             </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-[40%]">
             <div className="w-44 h-24 border-2 rounded-lg p-3 shadow-md flex flex-col justify-center items-center text-center transition-all cursor-pointer hover:scale-105 bg-[#f0f7ff] border-[#4a90e2]">
                <p className="text-xs font-bold text-[#2c3e50] mb-1">TEI: 0x02</p>
                <p className="text-[10px] text-[#7f8c8d] font-mono break-all opacity-80 uppercase leading-none">AA:BB:CC:DD:EE:02</p>
             </div>
          </div>

          {/* Level 2 Nodes */}
          <div className="absolute left-[25%] -translate-x-1/2 top-[70%]">
             <div className="w-44 h-20 border-2 rounded-lg p-3 shadow-md border-[#2ecc71] bg-[#f0fff4] flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-[#2c3e50] mb-1">TEI: 0x04</p>
                <p className="text-[10px] text-[#7f8c8d] font-mono opacity-80 leading-none">AA:BB:CC:DD:EE:04</p>
             </div>
          </div>

          <div className="absolute left-[45%] -translate-x-1/2 top-[70%]">
             <div className="w-44 h-20 border-2 rounded-lg p-3 shadow-md border-[#2ecc71] bg-[#f0fff4] flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-[#2c3e50] mb-1">TEI: 0x05</p>
                <p className="text-[10px] text-[#7f8c8d] font-mono opacity-80 leading-none">AA:BB:CC:DD:EE:05</p>
             </div>
          </div>
        </div>

        {/* Floating Controls (Left) */}
        <div className="absolute left-8 top-8 flex flex-col gap-0.5 bg-white rounded-lg shadow-xl border border-[#dbe3f1] overflow-hidden">
           <button className="p-3 hover:bg-[#f4f7fc] text-[#7f8c8d] hover:text-[#4a4bd7] transition-colors"><ZoomIn size={20} /></button>
           <div className="h-[1px] mx-2 bg-[#f0f3f8]" />
           <button className="p-3 hover:bg-[#f4f7fc] text-[#7f8c8d] hover:text-[#4a4bd7] transition-colors"><ZoomOut size={20} /></button>
           <div className="h-[1px] mx-2 bg-[#f0f3f8]" />
           <button className="p-3 hover:bg-[#f4f7fc] text-[#7f8c8d] hover:text-[#4a4bd7] transition-colors"><Maximize size={20} /></button>
        </div>

        {/* Right Detail Panel Overlay */}
        {selectedNode && (
          <div className="absolute right-8 top-8 w-[420px] bg-white rounded-3xl shadow-2xl border border-[#dbe3f1] flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="p-6 flex items-center justify-between border-b border-[#f0f3f8]">
               <h3 className="text-lg font-bold text-[#2c3e50]">节点详情</h3>
               <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-[#f8faff] rounded-full transition-colors">
                  <X size={20} className="text-[#95a5a6]" />
               </button>
            </div>
            
            <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
              {/* Node Basic Info */}
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-[#eef2ff] flex items-center justify-center text-[#4a4bd7]">
                   <Activity size={32} />
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-[#2c3e50] tracking-tight">{selectedNode.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                       <div className="w-2 h-2 rounded-full bg-[#2ecc71]" />
                       <span className="text-xs font-bold text-[#2ecc71]">活跃在线</span>
                    </div>
                 </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-[#f4f7fc] p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">TEI 标识</p>
                    <p className="text-lg font-black text-[#2c3e50] font-mono">{selectedNode.id}</p>
                 </div>
                 <div className="bg-[#f4f7fc] p-4 rounded-2xl space-y-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">MAC 地址</p>
                    <p className="text-[10px] font-black text-[#2c3e50] font-mono break-all leading-tight mt-1">{selectedNode.mac}</p>
                 </div>
                 <div className="bg-[#f4f7fc] p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">所在层级</p>
                    <p className="text-lg font-black text-[#2c3e50]">Level {selectedNode.level}</p>
                 </div>
                 <div className="bg-[#f4f7fc] p-4 rounded-2xl space-y-1">
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">父节点 TEI</p>
                    <p className="text-lg font-black text-[#4a4bd7] font-mono">{selectedNode.parentId}</p>
                 </div>
              </div>

              {/* Performance Section */}
              <div className="space-y-6 pt-4">
                 <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-[0.2em]">实时性能指标</h5>
                    <div className="h-[1px] flex-1 mx-4 bg-[#f0f3f8]" />
                 </div>
                 
                 <div className="space-y-5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Signal size={16} className="text-[#94a3b8]" />
                          <span className="text-sm font-bold text-[#2c3e50]">信号强度 (RSSI)</span>
                       </div>
                       <span className="text-sm font-mono text-[#2c3e50] font-bold">{selectedNode.rssi}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Activity size={16} className="text-[#94a3b8]" />
                          <span className="text-sm font-bold text-[#2c3e50]">通信质量</span>
                       </div>
                       <span className="text-base font-black text-[#4a4bd7]">{selectedNode.quality}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <ArrowUpRight size={16} className="text-[#94a3b8]" />
                          <span className="text-sm font-bold text-[#2c3e50]">上行速率</span>
                       </div>
                       <span className="text-sm font-mono text-[#2c3e50] font-bold">{selectedNode.upSpeed}</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <ArrowDownRight size={16} className="text-[#94a3b8]" />
                          <span className="text-sm font-bold text-[#2c3e50]">下行速率</span>
                       </div>
                       <span className="text-sm font-mono text-[#2c3e50] font-bold">{selectedNode.downSpeed}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legend */}
      <div className="h-10 bg-white border-t border-[#dbe3f1] px-10 flex items-center gap-8 shrink-0">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ffeb3b] rounded-full" />
            <span className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-wider">CCO</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#4a90e2] rounded-full" />
            <span className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-wider">LV1</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#2ecc71] rounded-full" />
            <span className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-wider">LV2</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f39c12] rounded-full" />
            <span className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-wider">LV3</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#e74c3c] rounded-full" />
            <span className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-wider">LV4+</span>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .bg-dot-pattern {
          background-image: radial-gradient(#dbe3f1 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />
    </div>
  );
};

