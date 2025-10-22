export interface ComponentConfig {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  devDependencies?: string[];
  peerDependencies: string[];
  instructions?: string[];
}

export const REGISTRY: Record<string, ComponentConfig> = {
  "bottom-sheet": {
    name: "bottom-sheet",
    description: "A beautiful, customizable bottom sheet component with snap points and gesture handling",
    files: ["bottom-sheet.tsx"],
    dependencies: [],
    peerDependencies: [
      "react",
      "react-native",
      "react-native-safe-area-context"
    ],
    instructions: [
      "Import the component: import { BottomSheet } from './components/bottom-sheet'",
      "Make sure react-native-safe-area-context is properly set up in your app",
      "Wrap your app with SafeAreaProvider if not already done"
    ]
  }
  // Add more components here as you build them
};

export function getComponent(name: string): ComponentConfig | undefined {
  return REGISTRY[name];
}

export function getAllComponents(): ComponentConfig[] {
  return Object.values(REGISTRY);
}
