import React from 'react';
import { ArrowLeft, Printer, FileDown, Search, Filter, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { ScreenId, NavigationTransition } from '../types';

interface ScreenProps {
  onNavigate: (to: ScreenId, transition?: NavigationTransition) => void;
}

export const TestReportDetails: React.FC<ScreenProps> = ({ onNavigate }) => {
  const summary = [
    { label: '总测试用例数', val: '1,024', sub: '', icon: CheckCircle2, color: 'text-primary' },
    { label: '通过数', val: '982', sub: '+5%', icon: CheckCircle2, color: 'text-success' },
    { label: '失败数', val: '42', sub: '', icon: XCircle, color: 'text-error' },
    { label: '通过率', val: '95.8%', sub: 'Progress', icon: CheckCircle2, color: 'text-primary' },
  ];

  const results = [
    { id: 'TEI-A01', name: '系统初始化握手验证', status: 'pass', time: '124ms', detail: '[TX] INIT_REQ -> [RX] INIT_ACK (Latency: 12ms) -> Verified' },
    { id: 'TEI-B12', name: '异常数据帧溢出测试', status: 'fail', time: '5,001ms', detail: 'Timeout waiting for BUFFER_FULL_ERR. Received nothing.' },
    { id: 'TEI-C04', name: '持续心跳包稳定性 (1min)', status: 'pass', time: '60,005ms', detail: '60/60 Heartbeats verified. Avg latency 4.2ms. Max jitter 1.1ms.' },
    { id: 'TEI-D01', name: '配置文件重载响应', status: 'pass', time: '450ms', detail: 'RELOAD_CMD sent -> Context switched -> OK status' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <button 
            onClick={() => onNavigate(ScreenId.FUNCTIONAL_TEST, 'push_back')}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dim transition-colors mb-4 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            返回功能测试
          </button>
          <h2 className="text-4xl font-bold text-on-surface">测试报告详情</h2>
          <p className="text-on-surface-variant mt-2 font-medium">报告 ID: TR-2023-10-24-001 | 生成时间: 2023-10-24 14:30:00</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-md hover:bg-primary-dim transition-colors">
            <FileDown size={20} />
            导出 PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant relative overflow-hidden group">
            {idx === 3 && <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent" />}
            
            <div className="flex justify-between items-start relative z-10">
               <div>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{item.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-black ${item.color === 'text-error' ? 'text-error' : 'text-on-surface'}`}>{item.val}</span>
                    {item.sub && item.sub !== 'Progress' && (
                      <span className="text-xs font-bold text-success flex items-center">{item.sub}</span>
                    )}
                  </div>
               </div>
               <item.icon size={32} className={`opacity-20 group-hover:opacity-40 transition-opacity ${item.color}`} />
            </div>

            {item.sub === 'Progress' && (
              <div className="mt-6 relative z-10">
                <div className="w-full bg-surface-variant rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: item.val }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="px-8 py-6 border-b border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-xl font-bold text-on-surface">详细结果列表</h3>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:flex-initial">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="搜索用例..." 
                  className="w-full md:w-64 pl-12 pr-4 py-2 bg-surface rounded-xl border border-outline-variant text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
                />
             </div>
             <button className="p-2.5 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors">
                <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-tighter">测试项</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-tighter">用例名称</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-tighter">状态</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-tighter text-right">耗时 (ms)</th>
                <th className="px-8 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-tighter w-1/3">详细步骤</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {results.map((res, i) => (
                <tr key={i} className={`hover:bg-surface-variant/30 transition-colors ${res.status === 'fail' ? 'bg-error-container/5' : ''}`}>
                  <td className="px-8 py-5 text-sm font-bold font-mono text-on-surface-variant">{res.id}</td>
                  <td className="px-8 py-5 text-sm font-semibold">{res.name}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${res.status === 'pass' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${res.status === 'pass' ? 'bg-success' : 'bg-error'}`} />
                      {res.status === 'pass' ? '通过' : '失败'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-mono text-right text-on-surface-variant">{res.time}</td>
                  <td className="px-8 py-5 text-xs text-on-surface-variant truncate max-w-xs font-medium" title={res.detail}>
                    {res.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-4 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
          <p className="text-xs font-bold text-on-surface-variant opacity-60">显示 1 - 4，共 1,024 条</p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant rounded-lg text-on-surface-variant opacity-40 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-variant hover:text-primary transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
