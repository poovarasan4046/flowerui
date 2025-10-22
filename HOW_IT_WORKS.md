# How FlowerUI Installation Works 🌸

## The Key Concept: Copy, Don't Install

FlowerUI works like **shadcn/ui** - it **copies source code** into your project, it doesn't install components as npm packages.

---

## ❓ What Happens When You Run:

```bash
npx @poovarasan4046/flowerui@latest add bottom-sheet
```

### Step by Step:

1. **npx downloads the CLI tool temporarily**
   - This is just the command-line tool, not React Native
   - It gets deleted after running

2. **CLI copies the component file**
   - Source: From the npm package `components/bottom-sheet.tsx`
   - Destination: To your project `components/bottom-sheet.tsx`
   - **It's just a file copy!**

3. **CLI checks your package.json**
   - Looks for peer dependencies like `react-native-safe-area-context`
   - Shows warnings if missing

4. **CLI shows installation instructions**
   ```bash
   ⚠️  Missing peer dependencies detected!
   
   Required packages:
     • react-native-safe-area-context
   
   📦 Install with:
      npx expo install react-native-safe-area-context
   ```

5. **You manually install the dependencies** (if needed)

---

## ✅ What Gets "Installed"?

| What | How | Where |
|------|-----|-------|
| Component source code | Copied as `.tsx` file | `your-project/components/` |
| CLI tool | Downloaded temporarily by npx | Deleted after use |
| React Native dependencies | **NOT auto-installed** | You install manually |

---

## 🚫 What Does NOT Happen:

❌ React Native is NOT installed  
❌ Expo is NOT installed  
❌ Dependencies are NOT auto-installed  
❌ No packages added to your `package.json`  
❌ No `node_modules` bloat  

---

## 📋 Pre-requisites (User Must Have):

Before using FlowerUI, the user needs an existing project with:

✅ **React Native or Expo project** already set up
```bash
npx create-expo-app my-app
# or
npx react-native init MyApp
```

✅ **Basic dependencies installed**
```bash
npm install react react-native
```

---

## 🔧 What the User Must Do:

### 1. Have a React Native/Expo Project

```bash
# Create new Expo project
npx create-expo-app my-app
cd my-app
```

### 2. Run FlowerUI CLI

```bash
npx @poovarasan4046/flowerui@latest add bottom-sheet
```

### 3. Install Missing Dependencies (if prompted)

```bash
# The CLI will tell you to run this:
npx expo install react-native-safe-area-context
```

### 4. Use the Component

```tsx
import { BottomSheet } from './components/bottom-sheet';

function MyScreen() {
  return (
    <BottomSheet visible={true} onClose={() => {}}>
      <Text>Hello!</Text>
    </BottomSheet>
  );
}
```

---

## 💡 Why This Approach?

### Advantages:

✅ **Full source code access** - Modify as needed
✅ **No version conflicts** - Each component is independent  
✅ **Better tree-shaking** - Only bundle what you use  
✅ **Learn from code** - See exactly how it works  
✅ **Easy customization** - Change colors, animations, etc.  

### vs Traditional npm Install:

Traditional way:
```bash
npm install some-ui-library
```
- ❌ Components are in `node_modules` (black box)
- ❌ Hard to customize deeply
- ❌ Version lock-in
- ❌ Large bundle size

FlowerUI way:
```bash
npx @poovarasan4046/flowerui@latest add bottom-sheet
```
- ✅ Component code in your project
- ✅ Easy to customize
- ✅ No version lock
- ✅ Only what you need

---

## 📦 What Actually Gets Installed as npm Package?

Only the **CLI tool** is an npm package:
- Package: `@poovarasan4046/flowerui`
- Purpose: Command-line tool to copy files
- Size: Small (~40KB)
- Used with: `npx` (temporary download)

The **components** are NOT npm packages:
- They're just `.tsx` files
- Stored in the npm package's `components/` folder
- Copied into your project when you run the CLI

---

## 🎯 Summary

```
User's Project (Expo/RN)
         ↓
   Runs: npx @poovarasan4046/flowerui add bottom-sheet
         ↓
   CLI Tool (temporary)
         ↓
   Copies: bottom-sheet.tsx → your-project/components/
         ↓
   Checks: package.json for dependencies
         ↓
   Shows: Install command if missing deps
         ↓
   User runs: npx expo install react-native-safe-area-context
         ↓
   User imports: import { BottomSheet } from './components/bottom-sheet'
         ↓
   ✅ Done!
```

---

## 🔍 Technical Details

### The npm package contains:

```
@poovarasan4046/flowerui/
├── dist/           # Compiled CLI code
│   └── cli.js      # The actual CLI tool
├── components/     # Component source files
│   └── bottom-sheet.tsx
└── package.json    # Package config with "bin" entry
```

### When npx runs:

1. Downloads package to temp location
2. Runs `dist/cli.js`
3. CLI reads from `components/`
4. CLI writes to user's project `components/`
5. Cleans up temp files

---

## ✨ Updated in v0.1.2

Better dependency messages:
```bash
⚠️  Missing peer dependencies detected!

Required packages:
  • react-native-safe-area-context

📦 Install with:
   npx expo install react-native-safe-area-context

Or if using bare React Native:
   npm install react-native-safe-area-context
```

---

Hope this clarifies how it works! 🚀
