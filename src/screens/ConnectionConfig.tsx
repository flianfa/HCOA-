import React from 'react';
import { Settings2, RefreshCw, FileText, Link2, Activity, Zap, Globe } from 'lucide-react';
import { ScreenId, NavigationTransition } from '../types';

interface ScreenProps {
  onNavigate: (to: ScreenId, transition?: NavigationTransition) => void;
}

export const ConnectionConfig: React.FC<ScreenProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-[#2c3e50] tracking-tight">HCOA 测试系统</h2>
          <p className="text-[#7f8c8d] mt-2 font-medium">串口配置与链路维护终端</p>
        </div>
        <div className="flex gap-4 mb-1">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#27ae60]/10 text-[#27ae60] text-xs font-bold ring-1 ring-[#27ae60]/20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#27ae60] animate-pulse"></div>
            WebSocket: 已连接
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold ring-1 ring-gray-200">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            串口: 就绪
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Detailed Config */}
        <div className="col-span-12 lg:col-span-8 flex flex-col space-y-6">
          <div className="bg-white border border-[#dbe3f1] rounded-[2rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Settings2 size={20} className="text-[#4a4bd7]" />
                <h3 className="text-lg font-extrabold text-[#2c3e50] uppercase tracking-wider">端口通讯参数</h3>
              </div>
              <button className="flex items-center gap-2 text-[#4a4bd7] text-sm font-bold hover:bg-[#4a4bd7]/5 px-3 py-1 rounded-lg transition-colors">
                <RefreshCw size={16} />
                刷新列表
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-widest ml-1">系统串口 (UART)</label>
                <select className="w-full bg-[#f8faff] border border-[#dbe3f1] rounded-xl px-4 py-3.5 text-sm font-bold text-[#2c3e50] focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] outline-none transition-all cursor-pointer appearance-none">
                  <option>COM4 (USB-to-Serial CH340)</option>
                  <option>COM1 (Internal Bus)</option>
                  <option>COM6 (Virtual Bridge)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-widest ml-1">物理波特率</label>
                <select className="w-full bg-[#f8faff] border border-[#dbe3f1] rounded-xl px-4 py-3.5 text-sm font-bold text-[#2c3e50] focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] outline-none transition-all appearance-none cursor-pointer">
                  <option>9600 bps</option>
                  <option>115200 bps</option>
                  <option>230400 bps</option>
                  <option>921600 bps</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <label className="text-[10px] font-black text-[#7f8c8d] uppercase tracking-widest ml-1">本地日志存盘路径</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  defaultValue="C:\LabData\Logs\Session_A" 
                  className="flex-1 bg-[#f8faff] border border-[#dbe3f1] rounded-xl px-4 py-3.5 text-sm font-mono text-[#2c3e50] focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] outline-none transition-all"
                />
                <button className="px-6 py-3.5 border border-[#dbe3f1] rounded-xl text-sm font-bold text-[#34495e] hover:bg-gray-50 transition-colors whitespace-nowrap">
                  浏览...
                </button>
                <button className="px-6 py-3.5 bg-[#4a4bd7] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4a4bd7]/20 hover:bg-[#3d3dbd] active:scale-95 transition-all whitespace-nowrap">
                  手动保存
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { id: ScreenId.FUNCTIONAL_TEST, icon: Activity, title: '功能测试', desc: '执行原子级用例', color: 'bg-[#4a4bd7]' },
              { id: ScreenId.STRESS_TEST, icon: Zap, title: '压力测试', desc: '长时间稳定性压测', color: 'bg-[#e74c3c]' },
              { id: ScreenId.NETWORK_TOPOLOGY, icon: Globe, title: '拓扑图', desc: '可视化实时 PLC 拓扑', color: 'bg-[#2ecc71]' },
            ].map((gate) => (
              <button 
                key={gate.id}
                onClick={() => onNavigate(gate.id, 'none')}
                className="text-left bg-white border border-[#dbe3f1] p-6 rounded-[2rem] hover:shadow-lg transition-all group flex flex-col items-center text-center space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl ${gate.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                   <gate.icon size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#2c3e50]">{gate.title}</h4>
                  <p className="text-[9px] text-[#7f8c8d] font-bold uppercase tracking-tighter">{gate.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Connection History (Scrollable) & Action */}
        <div className="col-span-12 lg:col-span-4 flex flex-col bg-[#f8faff] rounded-[2rem] border border-[#dbe3f1] shadow-sm relative overflow-hidden min-h-[500px]">
          <div className="p-6 bg-white border-b border-[#dbe3f1] flex justify-between items-center">
            <h3 className="text-sm font-black text-[#2c3e50] uppercase tracking-widest">近期连接预设</h3>
            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-bold uppercase">History</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[400px]">
             {[
               { port: 'COM4', baud: '9600', time: '14:20:01', active: true },
               { port: 'COM1', baud: '115200', time: 'Yesterday' },
               { port: 'COM4', baud: '9600', time: '05-11' },
               { port: 'COM2', baud: '9600', time: '05-10' },
               { port: 'COM6', baud: '921600', time: '05-09' },
             ].map((item, i) => (
               <div key={i} className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${item.active ? 'bg-white border-[#4a4bd7] shadow-md shadow-[#4a4bd7]/5' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}>
                  <div>
                    <p className="text-sm font-black text-[#2c3e50]">{item.port}</p>
                    <p className="text-[10px] font-bold text-[#7f8c8d] uppercase">{item.baud} bps</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#95a5a6] uppercase">{item.time}</p>
                    {item.active && <span className="text-[8px] font-black text-[#2ecc71] uppercase">Current</span>}
                  </div>
               </div>
             ))}
          </div>

          <div className="p-6 bg-white border-t border-[#dbe3f1]">
            <button 
              onClick={() => onNavigate(ScreenId.FUNCTIONAL_TEST, 'push')}
              className="w-full h-16 bg-[#4a4bd7] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#4a4bd7]/20 hover:bg-[#3d3dbd] hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <Link2 size={24} className="group-hover:rotate-12 transition-transform" />
              开启并行链路
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


