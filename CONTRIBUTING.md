# Contributing to FlowerUI

Thank you for your interest in contributing to FlowerUI! 🌸

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/your-username/flowerui.git
cd flowerui
```

3. Install dependencies:

```bash
npm install
```

4. Build the project:

```bash
npm run build
```

5. Link the CLI locally for testing:

```bash
npm link
```

Now you can use `flowerui` command locally to test your changes.

## Project Structure

```
flowerui/
├── components/          # Component source files
│   └── bottom-sheet.tsx
├── src/                 # CLI source code
│   ├── cli.ts          # Main CLI entry point
│   ├── registry.ts     # Component registry
│   ├── utils.ts        # Utility functions
│   └── index.ts        # Public API
├── .github/
│   └── workflows/      # GitHub Actions
├── dist/               # Compiled output (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Adding a New Component

### 1. Create the Component

Create your component file in the `components/` directory:

```bash
touch components/button.tsx
```

Example component structure:

```tsx
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ title, onPress, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable 
      style={[styles.button, variant === 'secondary' && styles.secondary]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
  },
  secondary: {
    backgroundColor: '#6B7280',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### 2. Register the Component

Add your component to the registry in `src/registry.ts`:

```typescript
export const REGISTRY: Record<string, ComponentConfig> = {
  // ... existing components
  "button": {
    name: "button",
    description: "A customizable button component with variants",
    files: ["button.tsx"],
    dependencies: [],
    peerDependencies: ["react", "react-native"],
    instructions: [
      "Import: import { Button } from './components/button'",
      "Use: <Button title='Click me' onPress={() => {}} />"
    ]
  }
};
```

### 3. Test Your Component

Build and test the CLI:

```bash
npm run build

# Test in a sample React Native project
cd /path/to/test-project
flowerui add button
```

### 4. Document Your Component

Update the README.md with:
- Component description
- Usage example
- Props documentation
- Dependencies

## Development Workflow

### Building

```bash
# Build once
npm run build

# Watch mode for development
npm run dev
```

### Testing

```bash
# Test the CLI
npm test

# Or manually test
flowerui add bottom-sheet --help
```

### Code Quality

Before submitting a PR, ensure:

1. **TypeScript**: No type errors
```bash
npm run build
```

2. **Format**: Code is properly formatted
```bash
# Add prettier if needed
npm install -D prettier
npx prettier --write "src/**/*.ts" "components/**/*.tsx"
```

3. **Naming**: Follow existing conventions
   - Component files: `kebab-case.tsx`
   - Component names: `PascalCase`
   - Functions: `camelCase`

## Component Guidelines

### Best Practices

1. **TypeScript**: Always use TypeScript with proper type definitions
2. **Props Interface**: Export props interface for each component
3. **Styling**: Use StyleSheet.create() for styles
4. **Accessibility**: Include accessibility props where appropriate
5. **Documentation**: Add JSDoc comments for complex logic
6. **Dependencies**: Minimize external dependencies

### Component Checklist

- [ ] Component works on both iOS and Android
- [ ] TypeScript types are properly defined
- [ ] Props are documented with JSDoc
- [ ] Component is responsive
- [ ] Accessibility is considered
- [ ] Examples are provided
- [ ] No console warnings

### Example Template

```tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

/**
 * Description of your component
 */
export interface YourComponentProps {
  /** Prop description */
  someProp: string;
  /** Optional prop description */
  optionalProp?: boolean;
  /** Style override */
  style?: ViewStyle;
}

/**
 * YourComponent - Brief description
 * 
 * @example
 * ```tsx
 * <YourComponent someProp="value" />
 * ```
 */
export function YourComponent({ 
  someProp, 
  optionalProp = false,
  style 
}: YourComponentProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Component implementation */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Styles
  },
});
```

## Pull Request Process

1. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Your Changes**
   - Write clear, concise commit messages
   - Keep commits focused and atomic

3. **Test Thoroughly**
   - Test on both iOS and Android if possible
   - Test the CLI installation process

4. **Update Documentation**
   - Update README.md if needed
   - Add component documentation
   - Update CHANGELOG.md

5. **Submit PR**
   - Provide a clear description
   - Reference any related issues
   - Include screenshots/videos for UI changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New component
- [ ] Bug fix
- [ ] Enhancement
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] CLI installation works

## Screenshots/Videos
(if applicable)

## Related Issues
Closes #123
```

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `package.json`
```bash
npm version patch  # or minor, or major
```

2. Push changes and tags
```bash
git push && git push --tags
```

3. Create a GitHub release
4. Package is automatically published to npm

## Need Help?

- 💬 [GitHub Discussions](https://github.com/yourusername/flowerui/discussions)
- 🐛 [Report Issues](https://github.com/yourusername/flowerui/issues)
- 📧 Contact the maintainers

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Show empathy towards other community members

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
