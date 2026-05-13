import React from 'react';
import { ArrowLeft, Bell, Settings, Share2, Activity, Zap, Layers } from 'lucide-react';
import { ScreenId, NavigationTransition } from '../types';

interface ScreenProps {
  onNavigate: (to: ScreenId, transition?: NavigationTransition) => void;
}

export const StressTestDashboard: React.FC<ScreenProps> = ({ onNavigate }) => {
  const cards = [
    { 
      title: '配网压测', 
      rate: '98.5%', 
      total: 100, pass: 98, fail: 2, 
      stats: [
        { label: '扫描', avg: '450', p95: '1.2s', p99: '2.5s', color: 'text-primary' },
        { label: '绑定', avg: '320', p95: '850ms', p99: '1.5s', color: 'text-primary' },
      ],
      totalTime: '770', avgTime: '1.5s', p99Time: '2.8s',
      errors: ['扫描超时:1', '绑定超时:1']
    },
    { 
      title: '订阅地址压测', 
      rate: '95.0%', 
      total: 50, pass: 47, fail: 3, 
      stats: [
        { label: '添加(总)', avg: '1200', p95: '1.5s', p99: '2.0s', color: 'text-tertiary' },
        { label: '添加(均)', avg: '24', p95: '45ms', p99: '80ms', color: 'text-tertiary' },
        { label: '查询', avg: '15', p95: '30ms', p99: '50ms', color: 'text-success' },
      ],
      totalTime: '22', avgTime: '40ms', p99Time: '75ms',
      errors: ['添加超时:2', '删除残留:1']
    },
    { 
      title: '场景压测', 
      rate: '100.0%', 
      total: 30, pass: 30, fail: 0, 
      stats: [
        { label: '添加', avg: '45', p95: '90ms', p99: '150ms', color: 'text-primary' },
        { label: '查询1', avg: '20', p95: '40ms', p99: '70ms', color: 'text-success' },
        { label: '删除', avg: '40', p95: '80ms', p99: '130ms', color: 'text-error' },
      ],
      totalTime: '120', avgTime: '600ms', p99Time: '900ms',
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => onNavigate(ScreenId.STRESS_TEST, 'push_back')}
          className="p-2 hover:bg-surface-container rounded-lg transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="h-4 w-[1px] bg-outline-variant mx-2" />
        <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
          压力测试看板
          <span className="text-sm font-medium text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">实时数据流</span>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-tertiary' : 'bg-success'}`} />
                <h3 className="font-bold text-on-surface">{card.title}</h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-success/10 text-success rounded-md">成功率 {card.rate}</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: 'TOTAL', val: card.total, bg: 'bg-surface-container-low' },
                { label: 'PASS', val: card.pass, bg: 'bg-primary-container/10', text: 'text-primary' },
                { label: 'FAIL', val: card.fail, bg: 'bg-error-container/10', text: 'text-error' },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} p-3 rounded-xl text-center`}>
                  <p className="text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-tighter opacity-60">{s.label}</p>
                  <p className={`text-xl font-black ${s.text || 'text-on-surface'}`}>{s.val}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-4">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-on-surface-variant opacity-60 font-bold uppercase tracking-tighter border-b border-outline-variant">
                    <th className="text-left pb-1">阶段</th>
                    <th className="text-right pb-1">均值</th>
                    <th className="text-right pb-1">P95</th>
                    <th className="text-right pb-1">P99</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {card.stats.map((s, i) => (
                    <tr key={i} className="group">
                      <td className={`py-1.5 font-bold ${s.color}`}>{s.label}</td>
                      <td className="text-right font-mono py-1.5">{s.avg}</td>
                      <td className="text-right font-mono text-on-surface-variant py-1.5">{s.p95}</td>
                      <td className="text-right font-mono text-on-surface-variant py-1.5">{s.p99}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-outline-variant font-bold">
                    <td className="py-2">总耗时</td>
                    <td className="text-right font-mono py-2">{card.totalTime}</td>
                    <td className="text-right font-mono py-2">{card.avgTime}</td>
                    <td className="text-right font-mono py-2">{card.p99Time}</td>
                  </tr>
                </tbody>
              </table>

              {card.errors && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {card.errors.map((e, i) => (
                    <span key={i} className="text-[10px] font-bold text-error bg-error/5 border border-error/20 px-2 py-0.5 rounded-full">
                      {e}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 h-24 w-full relative">
               <div className="absolute inset-0 opacity-20 flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,80 Q25,20 50,60 T100,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                    <path d="M0,90 Q25,50 50,80 T100,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary opacity-50" />
                  </svg>
               </div>
               <div className="absolute inset-x-0 bottom-0 text-center">
                  <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Success Rate Trend (Last 50)</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
