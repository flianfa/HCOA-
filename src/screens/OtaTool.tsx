import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  HelpCircle, 
  User, 
  Sliders, 
  ArrowDownToLine, 
  Play, 
  RefreshCw, 
  Square, 
  CheckCircle2, 
  Activity, 
  Terminal, 
  Trash2, 
  Download, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';
import { ScreenProps } from '../types';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'outgoing' | 'incoming' | 'current';
  message: string;
}

export const OtaTool: React.FC<ScreenProps> = () => {
  // OTA Configuration State
  const [tei, setTei] = useState<string>('0x02');
  const [deviceType, setDeviceType] = useState<string>('STA');
  const [mtu, setMtu] = useState<string>('2048');
  const [transMode, setTransMode] = useState<string>('UNICAST');
  const [isSecureOta, setIsSecureOta] = useState<boolean>(true);
  const [firmwarePath, setFirmwarePath] = useState<string>('firmware_v2.4.bin');
  
  // Pressure Test State
  const [stressLoops, setStressLoops] = useState<number>(100);
  const [downgradePath, setDowngradePath] = useState<string>('firmware_v2.3_downgrade.bin');
  
  // Simulation Running State
  const [testType, setTestType] = useState<'none' | 'ota' | 'stress'>('none');
  const [otaPhase, setOtaPhase] = useState<'idle' | 'start' | 'trans' | 'activate' | 'done' | 'stopped'>('idle');
  
  // Progress Stats
  const [progress, setProgress] = useState<number>(0);
  const [sentBytes, setSentBytes] = useState<number>(0);
  const totalBytes = 1258291; // 1.2 MB
  
  // Stress Test Counters
  const [currentLoop, setCurrentLoop] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [failCount, setFailCount] = useState<number>(0);

  const normalizedTei = tei.trim().toLowerCase();
  const isTeiInvalidForSta = deviceType === 'STA' && (
    normalizedTei === '0x01' || 
    normalizedTei === '0x1' || 
    normalizedTei === '1' || 
    normalizedTei === '01'
  );

  // Logs List
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '10:42:01.123', type: 'info', message: 'OTA System Initialized.' }
  ]);

  const logEndRef = useRef<HTMLDivElement | null>(null);

  // References for simulation timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto scroll to bottom of logs when they update
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      stopAllTimers();
    };
  }, []);

  const stopAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
  };

  const getTimestamp = () => {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');
    return `${hrs}:${mins}:${secs}.${ms}`;
  };

  const addLog = (message: string, type: 'info' | 'outgoing' | 'incoming' | 'current' = 'info') => {
    setLogs(prev => [...prev, { timestamp: getTimestamp(), type, message }]);
  };

  // 1. Single OTA Test Simulation
  const startOtaTest = (isPartofStress: boolean = false) => {
    stopAllTimers();
    setOtaPhase('start');
    setProgress(0);
    setSentBytes(0);
    
    if (!isPartofStress) {
      setTestType('ota');
      setLogs([{ timestamp: getTimestamp(), type: 'info', message: 'OTA System Initialized.' }]);
    }

    addLog(`-> START REQ: TEI=${tei}, TYPE=${deviceType}, MODE=${transMode}`, 'outgoing');
    
    // Step 1: START Negotiation Phase (~1 sec)
    timerRef.current = setTimeout(() => {
      addLog(`<- START RSP: OK. MTU negotiated: ${mtu}`, 'incoming');
      addLog(`-> TRANS REQ: Begin file transmission. Size=1.2MB`, 'outgoing');
      
      setOtaPhase('trans');
      
      let currentProgress = 0;
      let totalFragments = 600;
      let fragmentIdx = 1;

      // Pulse simulation for data fragments
      progressTimerRef.current = setInterval(() => {
        fragmentIdx += Math.floor(Math.random() * 4) + 12; // Transmit batches of fragments rapidly
        if (fragmentIdx > totalFragments) fragmentIdx = totalFragments;
        
        const calculatedProgress = Math.round((fragmentIdx / totalFragments) * 100);
        setProgress(calculatedProgress);
        setSentBytes(Math.round((fragmentIdx / totalFragments) * totalBytes));

        if (fragmentIdx % 28 === 0 || fragmentIdx === totalFragments) {
          // Add subset of fragment log items so as not to choke the UI
          setLogs(prev => {
            // Filter out existing "Current" log item to clean up terminal look
            const clean = prev.filter(l => l.type !== 'current');
            return [
              ...clean, 
              { 
                timestamp: getTimestamp(), 
                type: fragmentIdx === totalFragments ? 'info' : 'current', 
                message: `Fragment ${fragmentIdx}/${totalFragments} sent. Size ${mtu} bytes.${fragmentIdx === totalFragments ? '' : ' (Current)'}` 
              }
            ];
          });
        }

        // Finish transmission
        if (fragmentIdx >= totalFragments) {
          clearInterval(progressTimerRef.current!);
          setOtaPhase('activate');
          addLog(`-> ACTIVATE REQ: Trigger firmware signature check & activate.`, 'outgoing');
          
          // Phase 3: ACTIVATE (~1.5 sec)
          timerRef.current = setTimeout(() => {
            addLog(`<- ACTIVATE RSP: OK. Validation correct. New version running.`, 'incoming');
            addLog(`Device reports Partition Switch success. Re-establishing serial hook.`, 'info');
            setProgress(100);
            setOtaPhase('done');
            
            if (isPartofStress) {
              setSuccessCount(s => s + 1);
              // Trigger next turn of stress test
              triggerNextStressTurn();
            } else {
              addLog(`OTA update completed successfully!`, 'info');
              setTestType('none');
            }
          }, 1500);
        }
      }, 150);

    }, 1000);
  };

  // 2. Stress Test Simulation
  const startStressTest = () => {
    stopAllTimers();
    setTestType('stress');
    setCurrentLoop(1);
    setSuccessCount(0);
    setFailCount(0);
    setLogs([{ timestamp: getTimestamp(), type: 'info', message: 'Stress Test Environment Initiated.' }]);
    
    // Start the first OTA loop
    addLog(`=== LOOP 1/100 Initiated ===`, 'info');
    startOtaTest(true);
  };

  const triggerNextStressTurn = () => {
    stopAllTimers();
    setCurrentLoop(prevLoop => {
      const nextLoop = prevLoop + 1;
      if (nextLoop <= stressLoops) {
        addLog(`=== LOOP ${nextLoop}/${stressLoops} Initiated ===`, 'info');
        // Wait 2 seconds between stress rounds for device reboot emulation
        timerRef.current = setTimeout(() => {
          startOtaTest(true);
        }, 2000);
        return nextLoop;
      } else {
        addLog(`=== Stress Test Completed. Total Loops: ${stressLoops} finished. ===`, 'info');
        setTestType('none');
        setOtaPhase('done');
        return prevLoop;
      }
    });
  };

  // 3. Stop Simulation
  const stopTest = () => {
    stopAllTimers();
    setOtaPhase('stopped');
    addLog(`User requested stop. Stopping OTA test...`, 'info');
    
    setTimeout(() => {
      addLog(`_task_ota will be deleted`, 'incoming');
      setTestType('none');
      setOtaPhase('idle');
    }, 1000);
  };

  // Helper formats for display
  const formatKB = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + 'KB';
  };

  return (
    <div className="h-full flex flex-col bg-[#f8faff] overflow-y-auto">
      {/* Top Header Bar */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-[#dbe3f1] bg-white shrink-0">
        <h2 className="text-xl font-bold text-[#2c3e50] flex items-center gap-3">
          <ArrowDownToLine className="text-[#4a4bd7]" size={24} />
          OTA升级配置与测试
        </h2>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#f3f4fa] text-[#7f8c8d] hover:text-[#4a4bd7] rounded-full transition-colors relative group">
            <Settings size={20} />
            <span className="absolute hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded top-10 right-0 whitespace-nowrap z-50">设置</span>
          </button>
          <button className="p-2 hover:bg-[#f3f4fa] text-[#7f8c8d] hover:text-[#4a4bd7] rounded-full transition-colors relative group">
            <HelpCircle size={20} />
            <span className="absolute hidden group-hover:block bg-slate-800 text-white text-[10px] px-2 py-1 rounded top-10 right-0 whitespace-nowrap z-50">帮助</span>
          </button>
          <div className="h-6 w-[1px] bg-[#dbe3f1]" />
          <button className="flex items-center gap-2 p-1.5 hover:bg-[#f3f4fa] rounded-full transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#e8eaff] flex items-center justify-center text-[#4a4bd7] font-bold text-xs border border-[#4a4bd7]/20">
              <User size={14} />
            </div>
            <span className="text-xs font-bold text-[#2c3e50]">管理员</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Two-Column Grid for Configuration and Control */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section 1: OTA Parameter Config */}
          <div className="bg-white rounded-2xl p-6 border border-[#dbe3f1] shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-[#f0f3f8] pb-4">
              <Sliders className="text-[#4a4bd7]" size={20} />
              <h3 className="text-base font-bold text-[#2c3e50]">OTA 参数设置</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">目标设备标识 (TEI)</label>
                <input 
                  type="text" 
                  value={tei}
                  disabled={deviceType === 'CCO'}
                  onChange={(e) => setTei(e.target.value)}
                  placeholder="e.g. 0x01 or 1"
                  className={`w-full px-4 py-2.5 rounded-xl border transition-all text-sm font-medium focus:outline-none focus:ring-2 ${
                    deviceType === 'CCO'
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-400'
                      : isTeiInvalidForSta
                      ? 'border-red-500 focus:ring-red-200 focus:border-red-500 text-red-600 bg-red-50/30'
                      : 'border-[#dbe3f1] focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] text-[#2c3e50]'
                  }`}
                />
                {deviceType === 'CCO' && (
                  <p className="text-[10px] text-gray-400 font-bold mt-1">ℹ️ CCO 模式下 TEI 固定为 0x01</p>
                )}
                {isTeiInvalidForSta && (
                  <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ STA 模式下目标 TEI 不能为 0x01 / 1</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">设备类型</label>
                <select 
                  value={deviceType}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setDeviceType(newType);
                    if (newType === 'CCO') {
                      setIsSecureOta(false);
                      setTei('0x01');
                    } else if (newType === 'STA') {
                      if (tei === '0x01' || tei === '1' || tei === '01' || tei === '0x1') {
                        setTei('0x02');
                      }
                    }
                  }}
                  className="w-full h-[42px] px-4 rounded-xl border border-[#dbe3f1] bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] text-sm text-[#2c3e50] font-medium cursor-pointer"
                >
                  <option value="STA">STA</option>
                  <option value="CCO">CCO</option>
                  <option value="MCU">MCU</option>
                  <option value="GW">GW</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">MTU 大小 (Bytes)</label>
                <input 
                  type="text" 
                  value={mtu} 
                  onChange={(e) => setMtu(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dbe3f1] focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] text-sm text-[#2c3e50] font-mono font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">传输方式</label>
                <select 
                  value={transMode}
                  onChange={(e) => setTransMode(e.target.value)}
                  className="w-full h-[42px] px-4 rounded-xl border border-[#dbe3f1] bg-white focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] text-sm text-[#2c3e50] font-medium cursor-pointer"
                >
                  <option value="UNICAST">UNICAST（单播）</option>
                  <option value="MULTICAST">MULTICAST（组播）</option>
                </select>
              </div>
            </div>

            {/* Toggle signature check */}
            <div className="flex items-center justify-between p-4 bg-[#f8faff] rounded-xl border border-[#eef2ff]">
              <div>
                <p className="text-sm font-bold text-[#2c3e50]">固件已签名 (Secure OTA)</p>
                <p className="text-xs text-[#7f8c8d] mt-1">要求设备验证固件签名方可激活</p>
              </div>
              <button 
                onClick={() => setIsSecureOta(!isSecureOta)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isSecureOta ? 'bg-[#4a4bd7]' : 'bg-[#dbe3f1]'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isSecureOta ? 'translate-x-6' : ''}`} />
              </button>
            </div>

            {/* Primary bin path select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">主固件路径</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={firmwarePath}
                  onChange={(e) => setFirmwarePath(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-[#dbe3f1] focus:outline-none text-sm text-[#2c3e50] bg-white" 
                  placeholder="选择 .bin 文件..."
                />
                <label className="px-5 py-2.5 bg-[#f4f7fc] hover:bg-[#e8eaff] border border-[#dbe3f1] text-[#2c3e50] font-bold text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center">
                  浏览文件
                  <input 
                    type="file" 
                    accept=".bin" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFirmwarePath(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Sub-section: Stress Test Params */}
            <div className="bg-[#fcfcff] border border-[#dbe3f1]/60 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-[#a18cfa]" size={16} />
                <h4 className="text-xs font-black text-[#a18cfa] uppercase tracking-wider">压测模式参数</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider">压测循环次数</label>
                  <input 
                    type="number" 
                    value={stressLoops}
                    onChange={(e) => setStressLoops(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border border-[#dbe3f1] focus:outline-none focus:ring-2 focus:ring-[#4a4bd7]/20 focus:border-[#4a4bd7] text-sm text-[#2c3e50] font-medium"
                    min={1}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#7f8c8d] uppercase tracking-wider">降级固件路径 (回退用)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={downgradePath}
                      onChange={(e) => setDowngradePath(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl border border-[#dbe3f1] focus:outline-none text-xs text-[#2c3e50] bg-white"
                      placeholder="选择降级 .bin 文件..."
                    />
                    <label className="px-3 py-1.5 bg-[#f4f7fc] hover:bg-[#e0e4fb] border border-[#dbe3f1] text-[#2c3e50] font-bold text-[10px] rounded-lg cursor-pointer transition-colors flex items-center justify-center">
                      浏览
                      <input 
                        type="file" 
                        accept=".bin" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setDowngradePath(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Operation & Monitoring and Progress/Steppers */}
          <div className="bg-white rounded-2xl p-6 border border-[#dbe3f1] shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="text-[#4a4bd7]" size={20} />
                  <h3 className="text-base font-bold text-[#2c3e50]">操作与监控</h3>
                </div>
                {/* Control Action Buttons */}
                <div className="flex gap-2 shrink-0">
                  <button 
                    disabled={testType !== 'none' || isTeiInvalidForSta}
                    onClick={() => startOtaTest()}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#4a4bd7] hover:bg-[#3b3cb9] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    <Play size={12} fill="white" />
                    开启 OTA 测试
                  </button>
                  <button 
                    disabled={testType !== 'none' || isTeiInvalidForSta}
                    onClick={startStressTest}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#7b2cbf] hover:bg-[#622399] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    <RefreshCw size={12} />
                    开始压测
                  </button>
                  <button 
                    disabled={testType === 'none'}
                    onClick={stopTest}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#d90429] hover:bg-[#b30322] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow transition-colors"
                  >
                    <Square size={12} fill="white" />
                    停止发送/测试
                  </button>
                </div>
              </div>

              {/* OTA phase states timeline layout */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-[#7f8c8d] uppercase tracking-wider">OTA 阶段状态</p>
                
                <div className="space-y-6 pl-4 relative before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#e9ecef]">
                  {/* Phase 1: START */}
                  <div className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 ${
                      otaPhase === 'done' || otaPhase === 'activate' || otaPhase === 'trans' ? 'bg-[#4a4bd7] border-[#4a4bd7] text-white' :
                      otaPhase === 'start' ? 'bg-[#4a4bd7]/10 border-[#4a4bd7] text-[#4a4bd7] animate-pulse' : 'bg-white border-[#dbe3f1] text-[#95a5a6]'
                    }`}>
                      {otaPhase === 'done' || otaPhase === 'activate' || otaPhase === 'trans' ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">1</span>}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#2c3e50]">START (初始化协商)</p>
                      <p className={`text-xs font-bold ${
                        otaPhase === 'done' || otaPhase === 'activate' || otaPhase === 'trans' ? 'text-[#4a4bd7]' : 
                        otaPhase === 'start' ? 'text-amber-500' : 'text-[#7f8c8d]'
                      }`}>
                        {otaPhase === 'done' || otaPhase === 'activate' || otaPhase === 'trans' ? '已完成' : 
                         otaPhase === 'start' ? '初始化协商中...' : '等待中'}
                      </p>
                    </div>
                  </div>

                  {/* Phase 2: TRANS */}
                  <div className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 ${
                      otaPhase === 'done' || otaPhase === 'activate' ? 'bg-[#4a4bd7] border-[#4a4bd7] text-white' :
                      otaPhase === 'trans' ? 'bg-[#4a4bd7]/10 border-[#4a4bd7] text-[#4a4bd7] animate-pulse' : 'bg-white border-[#dbe3f1] text-[#95a5a6]'
                    }`}>
                      {otaPhase === 'done' || otaPhase === 'activate' ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">2</span>}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#2c3e50]">TRANS (数据传输)</p>
                      <p className={`text-xs font-bold ${
                        otaPhase === 'done' || otaPhase === 'activate' ? 'text-[#4a4bd7]' : 
                        otaPhase === 'trans' ? 'text-amber-500' : 'text-[#7f8c8d]'
                      }`}>
                        {otaPhase === 'done' || otaPhase === 'activate' ? '已完成' : 
                         otaPhase === 'trans' ? '进行中...' : '等待中'}
                      </p>
                    </div>
                  </div>

                  {/* Phase 3: ACTIVATE */}
                  <div className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 ${
                      otaPhase === 'done' ? 'bg-[#4a4bd7] border-[#4a4bd7] text-white' :
                      otaPhase === 'activate' ? 'bg-[#4a4bd7]/10 border-[#4a4bd7] text-[#4a4bd7] animate-pulse' : 'bg-white border-[#dbe3f1] text-[#95a5a6]'
                    }`}>
                      {otaPhase === 'done' ? <CheckCircle2 size={14} /> : <span className="text-xs font-bold">3</span>}
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#2c3e50]">ACTIVATE (激活)</p>
                      <p className={`text-xs font-bold ${
                        otaPhase === 'done' ? 'text-[#4a4bd7]' : 
                        otaPhase === 'activate' ? 'text-amber-500' : 'text-[#7f8c8d]'
                      }`}>
                        {otaPhase === 'done' ? '已完成' : 
                         otaPhase === 'activate' ? '激活并重启中...' : '等待中'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress and Stress Stats */}
              <div className="space-y-3 pt-5 border-t border-[#f0f3f8]">
                <div className="flex justify-between items-center text-xs font-bold text-[#2c3e50]">
                  <span>总进度</span>
                  <span className="text-sm font-black text-[#4a4bd7] font-mono">{progress}%</span>
                </div>
                
                {/* Real Progress Bar */}
                <div className="w-full bg-[#f0f3f8] h-3.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4a4bd7] h-full rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-bold text-[#7f8c8d]">
                  {testType === 'stress' ? (
                    <span className="text-[#7b2cbf] bg-[#7b2cbf]/5 px-2 py-0.5 rounded border border-[#7b2cbf]/10">
                      当前循环: {currentLoop} / {stressLoops} (成功: {successCount} | 失败: {failCount})
                    </span>
                  ) : (
                    <span />
                  )}
                  <span>已发送: {formatKB(sentBytes)} / {formatKB(totalBytes)}</span>
                </div>
              </div>
            </div>

            {/* Info warning */}
            <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-4 flex gap-3 text-xs mt-6">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
              <div className="text-blue-800 space-y-1">
                <span className="font-bold block">设备接口协调说明:</span>
                <span>OTA工具与连接界面、压力测试、拓扑接口完全共用相同的单路串口流。升级过程中系统会自动锁定底层总线线程，保证传输过程不卡顿。</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Logs Window styled with clean white background */}
        <div className="bg-white rounded-2xl p-6 border border-[#dbe3f1] shadow-sm space-y-4">
          {/* Real-time Debug Logs panel */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-[#2c3e50] uppercase tracking-wider flex items-center gap-2">
                <Terminal size={16} className="text-[#4a4bd7]" />
                实时日志
              </h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => setLogs([])}
                  className="p-1.5 hover:bg-[#f3f4fa] text-[#7f8c8d] hover:text-red-500 rounded-lg transition-all"
                  title="清空日志"
                >
                  <Trash2 size={14} />
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n')], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ota_test_logs_${getTimestamp().replace(/[:.]/g, '')}.log`;
                    a.click();
                  }}
                  className="p-1.5 hover:bg-[#f3f4fa] text-[#7f8c8d] hover:text-[#4a4bd7] rounded-lg transition-all"
                  title="保存日志"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>

            <div className="bg-[#f8faff] text-[#2c3e50] font-mono text-[11px] rounded-xl p-5 h-80 overflow-y-auto cursor-text shadow-inner border border-[#dbe3f1] flex flex-col space-y-1.5 custom-scrollbar">
              {logs.length === 0 ? (
                <span className="text-[#95a5a6] italic block text-center mt-28">暂无日志（等待调试）</span>
              ) : (
                logs.map((log, idx) => {
                  let logTextColor = 'text-[#586069]';
                  let logPrefixBg = 'bg-[#f0f3f8] text-[#5c6e80] border border-[#dbe3f1]';
                  
                  if (log.type === 'outgoing') {
                    logTextColor = 'text-[#1a73e8] font-semibold';
                    logPrefixBg = 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]';
                  } else if (log.type === 'incoming') {
                    logTextColor = 'text-[#1e8e3e] font-semibold';
                    logPrefixBg = 'bg-[#e6f4ea] text-[#1e8e3e] border border-[#ceead6]';
                  } else if (log.type === 'current') {
                    logTextColor = 'text-[#b06000] font-semibold';
                    logPrefixBg = 'bg-[#fef7e0] text-[#b06000] border border-[#feebc8]';
                  }

                  const isCurrentRowHighlight = log.type === 'current';

                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 px-3 py-1.5 rounded transition-all leading-relaxed ${
                        isCurrentRowHighlight ? 'bg-[#fef7e0]/60 border border-[#fde293]' : 'hover:bg-[#f1f3f4]/50'
                      }`}
                    >
                      <span className="opacity-60 text-[#7f8c8d] shrink-0 select-none">[{log.timestamp}]</span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded shrink-0 self-start font-bold ${logPrefixBg}`}>
                        {log.type === 'outgoing' ? '->' : log.type === 'incoming' ? '<-' : 'info'}
                      </span>
                      <span className={`flex-1 break-all ${logTextColor}`}>{log.message}</span>
                    </div>
                  );
                })
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
