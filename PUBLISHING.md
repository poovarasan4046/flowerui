# Publishing Guide

## First Time Setup

### 1. Verify npm login
```bash
npm whoami
```

If not logged in:
```bash
npm login
```

### 2. Check package name availability
```bash
npm view flowerui
```

If the name is taken, update `package.json` with a different name (e.g., `@poovarasan4046/flowerui`)

## Publishing to npm

### Manual Publishing

```bash
# Make sure everything is built
npm run build

# Test the package locally first
npm link
cd /path/to/test-project
npx flowerui@latest add bottom-sheet

# Publish to npm
npm publish --access public
```

### For scoped packages (if name is taken)

Update `package.json`:
```json
{
  "name": "@poovarasan4046/flowerui",
  ...
}
```

Then publish:
```bash
npm publish --access public
```

Users will install with:
```bash
npx @poovarasan4046/flowerui@latest add bottom-sheet
```

## Automated Publishing with GitHub Actions

### Setup

1. Get your npm token:
```bash
npm token create
```

2. Add token to GitHub secrets:
   - Go to https://github.com/poovarasan4046/flowerui/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: (paste your npm token)

3. Create a release on GitHub:
```bash
# Update version
npm version patch  # or minor, or major

# Push tags
git push && git push --tags

# Create GitHub release
gh release create v0.1.0 --title "v0.1.0" --notes "Initial release"
```

The GitHub Action will automatically publish to npm!

## Version Management

```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0)
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major

# Push changes
git push && git push --tags
```

## Testing Before Publishing

### Test locally
```bash
# Link the package
npm link

# In another terminal, test in a React Native project
cd /path/to/test-rn-project
flowerui add bottom-sheet
```

### Test with npm pack
```bash
# Create a tarball
npm pack

# Install in test project
cd /path/to/test-project
npm install /path/to/flowerui-0.1.0.tgz
npx flowerui add bottom-sheet
```

## Post-Publishing Checklist

- [ ] Verify package on npm: https://www.npmjs.com/package/flowerui
- [ ] Test installation: `npx flowerui@latest list`
- [ ] Test adding component: `npx flowerui@latest add bottom-sheet`
- [ ] Update README if needed
- [ ] Create GitHub release with changelog
- [ ] Announce on social media (optional)

## Troubleshooting

### "Package name too similar"
Use a scoped package: `@poovarasan4046/flowerui`

### "You do not have permission to publish"
Make sure you're logged in: `npm whoami`

### "Package already exists"
Choose a different name or request ownership transfer

### Build errors
```bash
rm -rf node_modules dist
npm install
npm run build
```
