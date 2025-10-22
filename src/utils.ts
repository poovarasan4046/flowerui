import * as fs from "fs-extra";
import * as path from "path";
import { getComponent } from "./registry";

export interface AddComponentOptions {
  componentName: string;
  cwd: string;
  overwrite?: boolean;
}

export async function addComponent(options: AddComponentOptions): Promise<void> {
  const { componentName, cwd, overwrite = false } = options;

  // Get component config from registry
  const component = getComponent(componentName);
  if (!component) {
    throw new Error(
      `Component "${componentName}" not found in registry.\nAvailable components: ${Object.keys(
        require("./registry").REGISTRY
      ).join(", ")}`
    );
  }

  // Determine the components directory
  const componentsDir = path.join(cwd, "components");
  await fs.ensureDir(componentsDir);

  // Copy each file from the source components directory
  const sourceComponentsDir = path.join(__dirname, "..", "components");

  for (const file of component.files) {
    const sourcePath = path.join(sourceComponentsDir, file);
    const destPath = path.join(componentsDir, file);

    // Check if file exists
    if (!overwrite && (await fs.pathExists(destPath))) {
      throw new Error(
        `File "${file}" already exists. Use --overwrite flag to replace it.`
      );
    }

    // Check if source file exists
    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(
        `Source component file "${sourcePath}" not found. Please ensure the package is properly installed.`
      );
    }

    // Copy the file
    await fs.copy(sourcePath, destPath, { overwrite });
  }
}

export async function checkDependencies(
  componentName: string,
  cwd: string
): Promise<{
  missing: string[];
  peerMissing: string[];
}> {
  const component = getComponent(componentName);
  if (!component) {
    return { missing: [], peerMissing: [] };
  }

  const packageJsonPath = path.join(cwd, "package.json");
  if (!(await fs.pathExists(packageJsonPath))) {
    return {
      missing: component.dependencies || [],
      peerMissing: component.peerDependencies || [],
    };
  }

  const packageJson = await fs.readJson(packageJsonPath);
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const missing = (component.dependencies || []).filter(
    (dep) => !allDeps[dep]
  );
  const peerMissing = (component.peerDependencies || []).filter(
    (dep) => !allDeps[dep]
  );

  return { missing, peerMissing };
}

export async function initProject(cwd: string): Promise<void> {
  const componentsDir = path.join(cwd, "components");
  await fs.ensureDir(componentsDir);

  // Create a .gitkeep file to ensure the directory is tracked
  const gitkeepPath = path.join(componentsDir, ".gitkeep");
  await fs.writeFile(gitkeepPath, "");
}
