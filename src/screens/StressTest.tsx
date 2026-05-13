import React from 'react';
import { Square, LayoutDashboard, RotateCw, Activity, Terminal, FileText } from 'lucide-react';
import { ScreenId, NavigationTransition } from '../types';

interface ScreenProps {
  onNavigate: (to: ScreenId, transition?: NavigationTransition) => void;
}

export const StressTest: React.FC<ScreenProps> = ({ onNavigate }) => {
  const devices = Array.from({ length: 15 }, (_, i) => ({
    name: `STA Node ${i + 1}`,
    id: `0x${(i + 1).toString(16).padStart(2, '0')}`,
    rssi: `-${40 + Math.floor(Math.random() * 20)}dBm`,
    selected: i < 5,
    active: i === 0
  }));

  const testModules = [
    { id: 1, name: '配网压测', desc: '测试设备配网稳定性', status: 'running' },
    { id: 2, name: '订阅压测', desc: '测试消息订阅压力', status: 'idle' },
    { id: 3, name: '场景压测', desc: '场景联动压力测试', status: 'idle' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f4f7fc] overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar: Device List */}
        <div className="w-80 bg-white border-r border-[#dbe3f1] flex flex-col">
          <div className="h-14 px-4 flex items-center justify-between border-b border-[#dbe3f1] shrink-0">
            <h3 className="font-bold text-[#2c3e50] text-lg">设备列表</h3>
            <RotateCw size={16} className="text-[#95a5a6] cursor-pointer" />
          </div>
          <div className="p-4 border-b border-[#dbe3f1] bg-[#f8faff] shrink-0">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked className="w-4 h-4 rounded text-[#4a4bd7] focus:ring-[#4a4bd7]" readOnly />
              <span className="text-sm font-semibold text-[#34495e]">全选 ({devices.length} devices)</span>
            </label>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
             {devices.map((dev, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    dev.active ? 'bg-[#e8f0fe] border-[#4285f4]' : 'bg-white border-[#dbe3f1]/50'
                  }`}
                >
                  <input type="checkbox" checked={dev.selected} className="w-4 h-4 rounded text-[#4a4bd7]" readOnly />
                  <Activity size={16} className="text-[#4a4bd7] opacity-60" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#2c3e50]">{dev.name}</p>
                    <p className="text-[10px] text-[#7f8c8d] font-mono uppercase">TEI: {dev.id} | RSSI: {dev.rssi}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f7fc]">
          {/* Header Bar */}
          <div className="h-16 px-8 flex items-center justify-between border-b border-[#dbe3f1] bg-white shrink-0">
            <h2 className="text-2xl font-bold text-[#2c3e50]">压力测试配置</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2 bg-[#c0392b] text-white rounded font-bold shadow-md hover:bg-[#a93226] transition-all">
                <Square size={16} fill="currentColor" />
                停止测试
              </button>
              <button 
                onClick={() => onNavigate(ScreenId.STRESS_TEST_DASHBOARD, 'push')}
                className="flex items-center gap-2 px-6 py-2 bg-[#4a4bd7] text-white rounded font-bold shadow-md hover:opacity-90 transition-all font-sans"
              >
                <LayoutDashboard size={18} />
                查看看板
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Configuration Card */}
            <div className="bg-[#eef2ff] border border-[#dbe3f1] rounded-xl p-8 flex gap-8">
               <div className="flex-1 space-y-3">
                  <label className="text-xs font-bold text-[#2c3e50]">循环轮次 (1-9999)</label>
                  <input 
                    type="number" 
                    defaultValue="1000" 
                    className="w-full h-12 bg-white border border-[#dbe3f1] rounded-lg px-4 font-mono text-sm focus:ring-2 focus:ring-[#4a4bd7]/20 outline-none"
                  />
               </div>
               <div className="flex-1 space-y-3">
                  <label className="text-xs font-bold text-[#2c3e50]">间隔时间 (毫秒)</label>
                  <input 
                    type="number" 
                    defaultValue="500" 
                    className="w-full h-12 bg-white border border-[#dbe3f1] rounded-lg px-4 font-mono text-sm focus:ring-2 focus:ring-[#4a4bd7]/20 outline-none"
                  />
               </div>
            </div>

            {/* Toolbar / Select All for Test Modules */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4a4bd7]" defaultChecked />
                <span className="text-sm font-bold text-[#7f8c8d] group-hover:text-[#4a4bd7] transition-colors">Select All Cases</span>
              </label>
              <div className="text-xs font-bold text-[#95a5a6]">
                已选择 1/3 个场景
              </div>
            </div>

            {/* Test Module Grid */}
            <div className="grid grid-cols-3 gap-6">
              {testModules.map((m) => (
                <div 
                  key={m.id} 
                  className={`bg-white border rounded-lg p-6 space-y-4 shadow-sm transition-all relative group cursor-pointer ${
                    m.status === 'running' ? 'border-[#4a4bd7] ring-1 ring-[#4a4bd7]/20' : 'border-[#dbe3f1] hover:border-[#4a4bd7]/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#4a4bd7]" defaultChecked={m.status === 'running'} />
                    {m.status === 'running' && (
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4285f4]">
                         <RotateCw size={14} className="animate-spin" />
                         执行中
                      </div>
                    )}
                    {m.status === 'idle' && (
                      <div className="text-xs font-bold text-[#95a5a6]">
                         等待中
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#4a4bd7]">{m.name}</h3>
                  <p className="text-sm text-[#7f8c8d]">{m.desc}</p>
                  {m.status === 'running' && (
                    <div className="h-1.5 w-full bg-[#f0f3f8] rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-[#4a4bd7] animate-[pulse_2s_infinite]" style={{ width: '40%' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Terminal Output */}
          <div className="h-72 bg-white border-t border-[#dbe3f1] flex flex-col shrink-0">
            <div className="h-10 px-6 flex items-center justify-between border-b border-[#f0f3f8] bg-[#f8faff]/50">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-[#2c3e50] opacity-60" />
                <span className="text-[10px] font-bold text-[#34495e] uppercase tracking-wider">实时日志 (最多500条)</span>
              </div>
              <div className="flex gap-4">
                <button className="text-[10px] font-bold text-[#7f8c8d] hover:text-[#4285f4] uppercase">记录</button>
                <button className="text-[10px] font-bold text-[#7f8c8d] hover:text-[#4285f4] uppercase">清除</button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#2c3e50] space-y-1 custom-scrollbar">
              <p className="text-[#7f8c8d]">[10:42:01.123] [TEI:A1] [PROVISION:450] [<span className="text-[#27ae60] font-bold">通过</span>] Scan: 120ms, Bind: 330ms, Total: 450ms</p>
              <p className="bg-[#fff5f5] -mx-6 px-6 py-1 border-y border-[#feb2b2]/10">
                <span className="text-[#7f8c8d]">[10:42:02.140]</span> [TEI:A1] [PROVISION:452] [<span className="text-[#e74c3c] font-bold">失败</span>] <span className="text-[#c53030]">Scan Timeout (5000ms exceeded). Retrying...</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Local Footer Bar */}
      <div className="h-10 bg-white border-t border-[#dbe3f1] px-8 flex items-center justify-between text-[11px] font-medium text-[#7f8c8d] shrink-0">
        <div className="flex gap-8">
          <span className="flex items-center gap-2">系统状态: <span className="text-[#27ae60] font-bold">正常</span></span>
          <span className="flex items-center gap-2">WebSocket: <span className="text-[#27ae60] font-bold">已连接</span></span>
          <span className="flex items-center gap-2">全局共享串口: <span className="text-[#2c3e50] font-bold">COM4 (9600bps)</span></span>
        </div>
        <div className="flex gap-6 uppercase tracking-wider">
           <button className="hover:text-[#4a4bd7] transition-colors">系统日志</button>
           <button className="hover:text-[#4a4bd7] transition-colors">API 文档</button>
        </div>
      </div>
    </div>
  );
};

