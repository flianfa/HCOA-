import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';
import { ScreenId, NavigationState, NavigationTransition } from './types';

// Screens
import { ConnectionConfig } from './screens/ConnectionConfig';
import { FunctionalTest } from './screens/FunctionalTest';
import { StressTest } from './screens/StressTest';
import { StressTestDashboard } from './screens/StressTestDashboard';
import { NetworkTopology } from './screens/NetworkTopology';
import { TestReportDetails } from './screens/TestReportDetails';
import { OtaTool } from './screens/OtaTool';

export default function App() {
  const [nav, setNav] = useState<NavigationState>({
    currentScreen: ScreenId.CONNECTION_CONFIG,
    history: [ScreenId.CONNECTION_CONFIG],
  });

  const navigate = useCallback((to: ScreenId, transition: NavigationTransition = 'none') => {
    setNav(prev => {
      let newHistory = [...prev.history];
      if (transition === 'push') {
        newHistory.push(to);
      } else if (transition === 'push_back') {
        newHistory.pop();
        const last = newHistory[newHistory.length - 1];
        return {
          currentScreen: last || ScreenId.CONNECTION_CONFIG,
          history: newHistory.length === 0 ? [ScreenId.CONNECTION_CONFIG] : newHistory,
          lastTransition: transition,
        };
      } else {
        // none: reset history or keep? usually none in sidebar resetting roots
        newHistory = [to];
      }

      return {
        currentScreen: to,
        history: newHistory,
        lastTransition: transition,
      };
    });
  }, []);

  const renderScreen = () => {
    switch (nav.currentScreen) {
      case ScreenId.CONNECTION_CONFIG:
        return <ConnectionConfig onNavigate={navigate} />;
      case ScreenId.FUNCTIONAL_TEST:
        return <FunctionalTest onNavigate={navigate} />;
      case ScreenId.STRESS_TEST:
        return <StressTest onNavigate={navigate} />;
      case ScreenId.STRESS_TEST_DASHBOARD:
        return <StressTestDashboard onNavigate={navigate} />;
      case ScreenId.NETWORK_TOPOLOGY:
        return <NetworkTopology onNavigate={navigate} />;
      case ScreenId.TEST_REPORT_DETAILS:
        return <TestReportDetails onNavigate={navigate} />;
      case ScreenId.OTA_TOOL:
        return <OtaTool onNavigate={navigate} />;
      default:
        return <ConnectionConfig onNavigate={navigate} />;
    }
  };

  const getVariants = () => {
    if (nav.lastTransition === 'push') {
      return {
        initial: { x: 50, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 },
      };
    }
    if (nav.lastTransition === 'push_back') {
      return {
        initial: { x: -50, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 50, opacity: 0 },
      };
    }
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar currentScreen={nav.currentScreen} onNavigate={(s) => navigate(s, 'none')} />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 overflow-hidden relative bg-[#f4f7fc]">
          <AnimatePresence mode="wait">
            <motion.div
              key={nav.currentScreen}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={getVariants()}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="absolute inset-0 overflow-hidden"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
