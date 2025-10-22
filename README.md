# FlowerUI 🌸

Beautiful, customizable UI components for Expo React Native - Install with a CLI like shadcn/ui.

## Features

- 🎨 Beautiful, production-ready components
- 🚀 Install only what you need
- 📦 Copy components directly to your project
- 🎯 Full TypeScript support
- 🌈 Customizable and themeable
- 📱 Built specifically for Expo React Native

## Installation

No installation required! Use `npx` to run the CLI directly:

```bash
npx flowerui@latest add bottom-sheet
```

## Quick Start

### 1. Initialize FlowerUI (Optional)

```bash
npx flowerui@latest init
```

This creates a `components` directory in your project.

### 2. Add Components

Add components individually:

```bash
npx flowerui@latest add bottom-sheet
```

Or add multiple components at once:

```bash
npx flowerui@latest add bottom-sheet button card
```

### 3. Use in Your App

```tsx
import { BottomSheet } from './components/bottom-sheet';

function MyScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button title="Open Sheet" onPress={() => setVisible(true)} />
      
      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        snapPoints={[0.4, 0.85]}
      >
        {/* Your content */}
      </BottomSheet>
    </>
  );
}
```

## Available Commands

### `init`

Initialize FlowerUI in your project:

```bash
npx flowerui@latest init
```

### `add [components...]`

Add one or more components to your project:

```bash
# Add a single component
npx flowerui@latest add bottom-sheet

# Add multiple components
npx flowerui@latest add bottom-sheet button

# Interactive mode (select from list)
npx flowerui@latest add

# Overwrite existing files
npx flowerui@latest add bottom-sheet --overwrite

# Skip confirmation prompts
npx flowerui@latest add bottom-sheet --yes
```

### `list`

List all available components:

```bash
npx flowerui@latest list
```

## Available Components

### Bottom Sheet

A beautiful, customizable bottom sheet with snap points and gesture handling.

**Features:**
- Multiple snap points
- Smooth animations
- Gesture-based dragging
- Customizable backdrop
- TypeScript support

**Usage:**

```bash
npx flowerui@latest add bottom-sheet
```

**Dependencies:**
- `react-native-safe-area-context`

**Example:**

```tsx
import { BottomSheet } from './components/bottom-sheet';

<BottomSheet
  visible={isOpen}
  onClose={() => setIsOpen(false)}
  snapPoints={[0.4, 0.85]}
  initialSnapIndex={0}
  enableBackdropDismiss={true}
>
  <Text>Your content here</Text>
</BottomSheet>
```

## Requirements

- React Native >= 0.70.0
- Expo SDK >= 48
- React >= 18.0.0

## How It Works

FlowerUI works by **copying component source code directly into your project** (not installing as npm packages). This means:

1. **Full Control**: The code is yours to modify
2. **No Black Box**: See exactly what's happening
3. **No Version Lock**: Update components independently
4. **Tree Shaking**: Only bundle what you use
5. **Easy Customization**: Modify styles and behavior as needed

### What Gets Installed?

When you run `npx @poovarasan4046/flowerui@latest add bottom-sheet`:

✅ **Copies** the component source file to `components/bottom-sheet.tsx`  
✅ **Shows** installation commands for missing dependencies  
❌ **Does NOT** auto-install React Native or peer dependencies  

### What You Need to Install

You need to manually install peer dependencies when prompted:

```bash
# The CLI will show you this command if dependencies are missing
npx expo install react-native-safe-area-context

# Or for bare React Native:
npm install react-native-safe-area-context
```

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/flowerui.git
cd flowerui

# Install dependencies
npm install

# Build the CLI
npm run build

# Test locally
npm link
flowerui add bottom-sheet
```

### Adding New Components

1. Create your component in the `components/` directory
2. Add component configuration to `src/registry.ts`:

```typescript
"your-component": {
  name: "your-component",
  description: "Your component description",
  files: ["your-component.tsx"],
  dependencies: [],
  peerDependencies: ["react", "react-native"],
  instructions: [
    "Import: import { YourComponent } from './components/your-component'",
    "Additional setup instructions..."
  ]
}
```

3. Build and test:

```bash
npm run build
npm test
```

## Publishing

### Manual Publishing

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Build
npm run build

# Publish to npm
npm publish
```

### Automated Publishing (GitHub Actions)

1. Add `NPM_TOKEN` to your GitHub repository secrets
2. Create a new release on GitHub
3. The package will be automatically published to npm

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Inspiration

This project is inspired by [shadcn/ui](https://ui.shadcn.com/) - bringing the same great developer experience to React Native.

## Support

- 📖 [Documentation](https://github.com/yourusername/flowerui)
- 🐛 [Report Issues](https://github.com/yourusername/flowerui/issues)
- 💬 [Discussions](https://github.com/yourusername/flowerui/discussions)

## Roadmap

- [ ] More components (Button, Card, Input, Modal, etc.)
- [ ] Theme system
- [ ] Component variants
- [ ] Animation presets
- [ ] Dark mode support
- [ ] Accessibility improvements
- [ ] Storybook integration
- [ ] Component playground
