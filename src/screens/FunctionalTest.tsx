import React from 'react';
import { Play, Square, FileText, ChevronRight, CheckCircle2, RotateCw, Terminal, Search, Activity, Globe } from 'lucide-react';
import { ScreenId, NavigationTransition } from '../types';

interface ScreenProps {
  onNavigate: (to: ScreenId, transition?: NavigationTransition) => void;
}

export const FunctionalTest: React.FC<ScreenProps> = ({ onNavigate }) => {
  // Data matching the screenshot, with more nodes to test scrolling
  const devices = Array.from({ length: 15 }, (_, i) => ({
    name: `STA Node ${i + 1}`,
    id: `0x${(i + 1).toString(16).padStart(2, '0')}`,
    rssi: `-${40 + Math.floor(Math.random() * 20)}dBm`,
    selected: i < 5,
    active: i === 0
  }));

  const testCases = [
    { id: 'dev_info', name: 'dev_info', desc: '设备信息查询', status: 'pass' },
    { id: 'dev_spec', name: 'dev_spec', desc: '设备规格查询', status: 'pass' },
    { id: 'ping', name: 'ping', desc: 'Ping测试', status: 'running' },
    { id: 'reset_bind', name: 'reset_bind', desc: '重置绑定', status: 'waiting' },
    { id: 'ota_update', name: 'ota_update', desc: 'OTA 升级测试', status: 'waiting' },
    { id: 'memory_test', name: 'memory_test', desc: '堆存信息查询', status: 'waiting' },
    { id: 'storage_check', name: 'storage_check', desc: '保存完备查询', status: 'waiting' },
    { id: 'network_perf', name: 'network_perf', desc: '网络吞吐测试', status: 'waiting' },
    { id: 'power_test', name: 'power_test', desc: '功能压力测试', status: 'waiting' },
    { id: 'power_test_2', name: 'power_test', desc: '功能压力测试', status: 'pass' },
    { id: 'ota_update_2', name: 'ota_update', desc: 'OTA 分片驱动测试', status: 'waiting' },
    { id: 'power_test_3', name: 'power_test', desc: '功能压力测试', status: 'waiting' },
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header Bar */}
          <div className="h-16 px-8 flex items-center justify-between border-b border-[#dbe3f1] bg-white shrink-0">
            <div className="flex items-center gap-6">
              <h2 className="text-2xl font-black text-[#2c3e50] tracking-tight">功能测试用例</h2>
              <div className="flex gap-3">
                 <span className="bg-[#e8f0fe] text-[#4285f4] text-xs font-bold px-3 py-1 rounded">9 Selected</span>
                 <div className="flex items-center gap-2 text-[#7f8c8d] text-xs font-bold">
                    <div className="w-2 h-2 rounded-full bg-[#27ae60] animate-pulse"></div>
                    运行中 (2/9)
                 </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#c0392b] text-white rounded font-bold shadow-md hover:bg-[#a93226] transition-all">
                <Square size={16} fill="currentColor" />
                停止测试
              </button>
              <button 
                onClick={() => onNavigate(ScreenId.TEST_REPORT_DETAILS, 'push')}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#4a4bd7] text-white rounded font-bold shadow-md hover:opacity-90 transition-all font-sans"
              >
                <FileText size={16} />
                查看报告
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
            {/* New Progress Bar Card from Screenshot */}
            <div className="bg-white border border-[#dbe3f1] rounded-lg p-5 flex items-center gap-6 shadow-sm shrink-0">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#34495e]">总体进度</span>
                  <span className="text-xs font-bold text-[#2c3e50]">22%</span>
                </div>
                <div className="flex gap-1 h-1.5 w-full">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full ${i < 2 ? 'bg-[#4a4bd7]' : i === 2 ? 'bg-[#4a4bd7] opacity-30 animate-pulse' : 'bg-gray-100'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6 pl-6 border-l border-[#dbe3f1]">
                <div className="text-center">
                   <div className="w-8 h-8 rounded-full bg-[#f0fff4] flex items-center justify-center mb-1 text-[#2ecc71] mx-auto border border-[#d1fae5]">
                     <CheckCircle2 size={16} />
                   </div>
                   <p className="text-[10px] text-[#7f8c8d] font-bold">通过: 2</p>
                </div>
                <div className="text-center">
                   <div className="w-8 h-8 rounded-full bg-[#fff5f5] flex items-center justify-center mb-1 text-[#e74c3c] mx-auto border border-[#fed7d7]">
                     <span className="font-bold text-lg leading-none">×</span>
                   </div>
                   <p className="text-[10px] text-[#7f8c8d] font-bold">失败: 0</p>
                </div>
              </div>
            </div>

            {/* Toolbar from Screenshot */}
            <div className="bg-white border border-[#dbe3f1] rounded-lg px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4a4bd7]" />
                  <span className="text-xs font-bold text-[#7f8c8d] group-hover:text-[#4a4bd7] transition-colors">Select All</span>
                </label>
                <div className="flex items-center bg-[#f8faff] rounded-md border border-[#dbe3f1] p-0.5">
                   <button className="px-3 py-1 text-[10px] font-black text-[#2c3e50] uppercase">Batch Operation: On</button>
                   <div className="w-[1px] h-3 bg-[#dbe3f1]" />
                   <button className="px-3 py-1 text-[10px] font-black text-[#7f8c8d] uppercase">Off</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#95a5a6] group-focus-within:text-[#4a4bd7] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="搜索 Case ID 或描述" 
                    className="pl-9 pr-4 py-1.5 bg-[#f8faff] border border-[#dbe3f1] rounded-md text-xs w-64 focus:ring-1 focus:ring-[#4a4bd7] outline-none transition-all placeholder:text-[#95a5a6]" 
                  />
                </div>
                <select className="bg-[#f8faff] border border-[#dbe3f1] rounded-md px-3 py-1.5 text-xs font-bold text-[#2c3e50] outline-none focus:ring-1 focus:ring-[#4a4bd7]">
                   <option>所有状态</option>
                   <option>已通过</option>
                   <option>运行中</option>
                   <option>等待中</option>
                </select>
              </div>
            </div>

            {/* Test Case List from Screenshot */}
            <div className="flex-1 border border-[#dbe3f1] rounded-lg bg-white overflow-hidden flex flex-col shadow-sm">
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <tbody>
                    {testCases.map((tc, idx) => (
                      <tr 
                        key={tc.id} 
                        className={`group border-b border-[#f0f3f8] ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfdff]'} hover:bg-[#f4f8ff] transition-colors`}
                      >
                        <td className="w-12 pl-4">
                          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#4a4bd7]" defaultChecked={tc.status !== 'waiting'} />
                        </td>
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="text-sm font-bold text-[#2c3e50]">{tc.name}</p>
                            <p className="text-xs text-[#7f8c8d] mt-0.5">{tc.desc}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                             {tc.status === 'pass' && (
                               <>
                                 <span className="text-xs font-bold text-[#2ecc71]">通过</span>
                                 <CheckCircle2 size={14} className="text-[#2ecc71]" />
                               </>
                             )}
                             {tc.status === 'running' && (
                               <>
                                 <span className="text-xs font-bold text-[#4a4bd7]">运行中</span>
                                 <RotateCw size={14} className="text-[#4a4bd7] animate-spin" />
                               </>
                             )}
                             {tc.status === 'waiting' && (
                               <>
                                 <span className="text-xs font-bold text-[#95a5a6]">等待中</span>
                                 <div className="w-3.5 h-3.5 border-2 border-[#dbe3f1] rounded-full border-t-[#95a5a6] animate-spin" />
                               </>
                             )}
                             <button className="ml-4 p-1 rounded hover:bg-gray-200 text-[#95a5a6] transition-colors">
                                <span className="block w-4 h-1 border-t-2 border-b-2 border-current" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination from Screenshot */}
              <div className="h-12 border-t border-[#f0f3f8] px-4 flex items-center justify-end bg-white shrink-0">
                 <div className="flex items-center gap-4 text-[10px] font-black text-[#7f8c8d] uppercase tracking-widest">
                    <span>共 50 个项目</span>
                    <div className="flex items-center gap-1">
                       <span>1 - 10</span>
                       <div className="flex gap-1 ml-2">
                          <button className="w-6 h-6 rounded bg-[#4a4bd7] text-white flex items-center justify-center font-bold">1</button>
                          <button className="w-6 h-6 rounded hover:bg-[#f8faff] flex items-center justify-center">2</button>
                          <button className="w-6 h-6 rounded hover:bg-[#f8faff] flex items-center justify-center">3</button>
                          <span className="px-1 self-end">...</span>
                          <button className="px-2 h-6 rounded hover:bg-[#f8faff] flex items-center justify-center">下一页</button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Terminal Output */}
          <div className="h-64 bg-white border-t border-[#dbe3f1] flex flex-col shrink-0 shadow-inner">
            <div className="h-10 px-6 flex items-center justify-between border-b border-[#f0f3f8] bg-[#f8faff]/50">
              <div className="flex items-center gap-3">
                <Terminal size={14} className="text-[#2c3e50] opacity-60" />
                <span className="text-[10px] font-bold text-[#34495e] uppercase tracking-wider">终端输出</span>
                <span className="text-[10px] text-[#95a5a6] font-mono ml-4">(日志同步至: C:\LabData\Logs\Session_A)</span>
              </div>
              <div className="flex gap-4">
                <button className="text-[10px] font-bold text-[#7f8c8d] hover:text-[#4285f4] uppercase">清除</button>
                <button className="text-[10px] font-bold text-[#7f8c8d] hover:text-[#4285f4] uppercase">导出</button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#2c3e50] space-y-1 custom-scrollbar">
              <p className="text-[#7f8c8d]">[10:45:01.233] [INFO] [TEI:0x00] Initiating test suite sequence...</p>
              <p><span className="text-[#95a5a6] opacity-50">[10:45:01.350]</span> <span className="text-[#27ae60] font-bold">[通过]</span> [TEI:0x01] dev_info query successful. Response parsed.</p>
              <p><span className="text-[#95a5a6] opacity-50">[10:45:01.802]</span> <span className="text-[#27ae60] font-bold">[通过]</span> [TEI:0x02] dev_info query successful. Response parsed.</p>
              <p className="bg-[#e8f0fe] -mx-6 px-6 py-1.5 border-y border-[#4285f4]/10">
                <span className="text-[#95a5a6] opacity-50">[10:45:02.100]</span> <span className="text-[#4285f4] font-bold">[EXEC]</span> [TEI:0x01] Sending ICMP echo request (Ping) 1/4...
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
        <div className="flex gap-6 uppercase tracking-widest opacity-60 font-bold">
          <span>Worker: HCOA-RT-01</span>
          <span>Build: 20260513_STABLE</span>
        </div>
      </div>
    </div>
  );
};

