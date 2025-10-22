#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { addComponent, checkDependencies, initProject } from "./utils";
import { getAllComponents } from "./registry";
import * as path from "path";

const program = new Command();

program
  .name("flowerui")
  .description("Add beautiful UI components to your Expo React Native project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize flowerui in your project")
  .action(async () => {
    const spinner = ora("Initializing flowerui...").start();

    try {
      const cwd = process.cwd();
      await initProject(cwd);
      spinner.succeed(chalk.green("✓ FlowerUI initialized successfully!"));
      console.log(
        chalk.cyan(
          "\nYou can now add components using: npx flowerui@latest add <component-name>"
        )
      );
    } catch (error) {
      spinner.fail(chalk.red("Failed to initialize flowerui"));
      console.error(error);
      process.exit(1);
    }
  });

program
  .command("add")
  .description("Add a component to your project")
  .argument("[components...]", "Component names to add")
  .option("-o, --overwrite", "Overwrite existing files", false)
  .option("-y, --yes", "Skip confirmation prompts", false)
  .action(async (components: string[], options) => {
    try {
      const cwd = process.cwd();
      let selectedComponents = components;

      // If no components specified, show interactive selection
      if (!selectedComponents || selectedComponents.length === 0) {
        const allComponents = getAllComponents();
        const response = await prompts({
          type: "multiselect",
          name: "components",
          message: "Select components to add:",
          choices: allComponents.map((comp) => ({
            title: comp.name,
            description: comp.description,
            value: comp.name,
          })),
          min: 1,
        });

        if (!response.components || response.components.length === 0) {
          console.log(chalk.yellow("No components selected. Exiting."));
          process.exit(0);
        }

        selectedComponents = response.components;
      }

      // Process each component
      for (const componentName of selectedComponents) {
        console.log(chalk.cyan(`\n📦 Adding ${componentName}...`));

        // Check dependencies
        const { missing, peerMissing } = await checkDependencies(
          componentName,
          cwd
        );

        if (peerMissing.length > 0) {
          console.log(
            chalk.yellow(
              `\n⚠️  Missing peer dependencies detected!`
            )
          );
          console.log(chalk.cyan("\nRequired packages:"));
          peerMissing.forEach(dep => {
            console.log(chalk.dim(`  • ${dep}`));
          });
          console.log(
            chalk.green(
              `\n📦 Install with:\n   ${chalk.bold(`npx expo install ${peerMissing.join(" ")}`)}`
            )
          );
          console.log(
            chalk.dim(
              "\nOr if using bare React Native:\n   " + 
              chalk.bold(`npm install ${peerMissing.join(" ")}`)
            )
          );

          if (!options.yes) {
            const { continue: shouldContinue } = await prompts({
              type: "confirm",
              name: "continue",
              message: "Continue anyway?",
              initial: true,
            });

            if (!shouldContinue) {
              console.log(chalk.yellow("Cancelled."));
              continue;
            }
          }
        }

        const spinner = ora(`Installing ${componentName}...`).start();

        try {
          await addComponent({
            componentName,
            cwd,
            overwrite: options.overwrite,
          });

          spinner.succeed(
            chalk.green(`✓ Successfully added ${componentName}`)
          );

          // Show usage instructions
          const component = getAllComponents().find(
            (c) => c.name === componentName
          );
          if (component?.instructions && component.instructions.length > 0) {
            console.log(chalk.cyan("\n📝 Next steps:"));
            component.instructions.forEach((instruction, index) => {
              console.log(chalk.dim(`  ${index + 1}. ${instruction}`));
            });
          }
        } catch (error) {
          spinner.fail(chalk.red(`Failed to add ${componentName}`));
          console.error(chalk.red(error instanceof Error ? error.message : String(error)));
          if (!options.yes) {
            const { continue: shouldContinue } = await prompts({
              type: "confirm",
              name: "continue",
              message: "Continue with remaining components?",
              initial: true,
            });

            if (!shouldContinue) {
              process.exit(1);
            }
          }
        }
      }

      console.log(chalk.green("\n✨ All done!"));
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program
  .command("list")
  .description("List all available components")
  .action(() => {
    const components = getAllComponents();

    console.log(chalk.cyan.bold("\n📦 Available Components:\n"));

    components.forEach((component) => {
      console.log(chalk.green(`  • ${component.name}`));
      console.log(chalk.dim(`    ${component.description}`));
      console.log("");
    });

    console.log(
      chalk.dim(
        `Run ${chalk.cyan("npx flowerui@latest add <component-name>")} to add a component.`
      )
    );
  });

program.parse();
