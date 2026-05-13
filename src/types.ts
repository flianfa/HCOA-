export enum ScreenId {
  CONNECTION_CONFIG = 'connection-config',
  FUNCTIONAL_TEST = 'functional-test',
  STRESS_TEST = 'stress-test',
  STRESS_TEST_DASHBOARD = 'stress-test-dashboard',
  NETWORK_TOPOLOGY = 'network-topology',
  TEST_REPORT_DETAILS = 'test-report-details',
}

export type NavigationTransition = 'none' | 'push' | 'push_back';

export interface NavigationState {
  currentScreen: ScreenId;
  history: ScreenId[];
  lastTransition?: NavigationTransition;
}
