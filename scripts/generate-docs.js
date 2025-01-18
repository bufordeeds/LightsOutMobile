#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

async function generateComponentDocs() {
	const componentsDir = path.join(PROJECT_ROOT, 'components');
	let docs = '# Components\n\n';

	try {
		const files = await fs.readdir(componentsDir, { recursive: true });
		for (const file of files) {
			if (
				file.endsWith('.tsx') &&
				!file.includes('__tests__') &&
				!file.includes('.web.tsx')
			) {
				const filePath = path.join(componentsDir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const relativePath = path.relative(PROJECT_ROOT, filePath);

				// Extract component name from filename
				const componentName = path.basename(file, '.tsx');
				docs += `## ${componentName}\n\n`;
				docs += `**File:** \`${relativePath}\`\n\n`;

				// Extract and clean imports
				const imports = content.match(/import[^;]+;/g);
				if (imports) {
					docs += '### Imports\n\n';
					docs += '```typescript\n';
					// Clean up import paths by removing quotes and file extensions
					docs += imports
						.map((imp) =>
							imp.replace(/'([^']+)'/g, (_, p) => {
								// Remove file extensions and clean up paths
								return `'${p.replace(/\.(tsx?|js|jsx)$/, '')}'`;
							})
						)
						.join('\n');
					docs += '\n```\n\n';
				}

				// Extract component description from comments
				const description = content.match(/\/\*\*([\s\S]*?)\*\//);
				if (description) {
					docs += '### Description\n\n';
					docs += description[1].replace(/\s*\*\s*/g, '') + '\n\n';
				}

				// Extract props interface/type
				const propsMatch = content.match(
					/interface\s+(\w+Props)\s*{([^}]+)}/
				);
				if (propsMatch) {
					docs += '### Props\n\n';
					docs += '```typescript\n';
					docs += `interface ${propsMatch[1]} {\n${propsMatch[2]}\n}\n`;
					docs += '```\n\n';
				}

				// Extract the full component implementation
				const componentMatch = content.match(
					/export\s+(?:default\s+)?(?:function|const)\s+\w+[^{]*{[\s\S]*?(?=export|$)/
				);
				if (componentMatch) {
					docs += '### Implementation\n\n';
					docs += '```typescript\n';
					docs += componentMatch[0].trim();
					docs += '\n```\n\n';
				}

				docs += '---\n\n';
			}
		}
	} catch (error) {
		console.error('Error generating component docs:', error);
	}

	return docs;
}

async function generateHooksDocs() {
	const hooksDir = path.join(PROJECT_ROOT, 'hooks');
	let docs = '# Hooks\n\n';

	try {
		const files = await fs.readdir(hooksDir);
		for (const file of files) {
			if (file.endsWith('.ts') && !file.includes('.web.ts')) {
				const filePath = path.join(hooksDir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const relativePath = path.relative(PROJECT_ROOT, filePath);

				// Extract hook name from filename
				const hookName = path.basename(file, '.ts');
				docs += `## ${hookName}\n\n`;
				docs += `**File:** \`${relativePath}\`\n\n`;

				// Extract imports
				const imports = content.match(/import[^;]+;/g);
				if (imports) {
					docs += '### Imports\n\n';
					docs += '```typescript\n';
					docs += imports.join('\n');
					docs += '\n```\n\n';
				}

				// Extract hook description from comments
				const description = content.match(/\/\*\*([\s\S]*?)\*\//);
				if (description) {
					docs += '### Description\n\n';
					docs += description[1].replace(/\s*\*\s*/g, '') + '\n\n';
				}

				// Extract types/interfaces used by the hook
				const types = content.match(
					/(?:interface|type)\s+[^{]+{[^}]+}/g
				);
				if (types) {
					docs += '### Types\n\n';
					docs += '```typescript\n';
					docs += types.join('\n\n');
					docs += '\n```\n\n';
				}

				// Extract full hook implementation
				const implementation = content.match(
					/export\s+function\s+\w+[^{]*{[\s\S]*?(?=export|$)/
				);
				if (implementation) {
					docs += '### Implementation\n\n';
					docs += '```typescript\n';
					docs += implementation[0].trim();
					docs += '\n```\n\n';
				}

				docs += '---\n\n';
			}
		}
	} catch (error) {
		console.error('Error generating hooks docs:', error);
	}

	return docs;
}

async function generateConstantsDocs() {
	const constantsDir = path.join(PROJECT_ROOT, 'constants');
	let docs = '# Constants\n\n';

	try {
		const files = await fs.readdir(constantsDir);
		for (const file of files) {
			if (file.endsWith('.ts')) {
				const filePath = path.join(constantsDir, file);
				const content = await fs.readFile(filePath, 'utf-8');
				const relativePath = path.relative(PROJECT_ROOT, filePath);

				// Extract constants file name
				const constantsName = path.basename(file, '.ts');
				docs += `## ${constantsName}\n\n`;
				docs += `**File:** \`${relativePath}\`\n\n`;

				// Extract imports
				const imports = content.match(/import[^;]+;/g);
				if (imports) {
					docs += '### Imports\n\n';
					docs += '```typescript\n';
					docs += imports.join('\n');
					docs += '\n```\n\n';
				}

				// Extract constant declarations
				const declarations = content.match(
					/(?:export\s+)?(?:const|let|var)\s+[^;]+;/g
				);
				if (declarations) {
					docs += '### Declarations\n\n';
					docs += '```typescript\n';
					docs += declarations.join('\n');
					docs += '\n```\n\n';
				}

				// Extract types/interfaces
				const types = content.match(
					/(?:interface|type)\s+[^{]+{[^}]+}/g
				);
				if (types) {
					docs += '### Types\n\n';
					docs += '```typescript\n';
					docs += types.join('\n\n');
					docs += '\n```\n\n';
				}

				docs += '---\n\n';
			}
		}
	} catch (error) {
		console.error('Error generating constants docs:', error);
	}

	return docs;
}

async function generateAppStructureDocs() {
	const appDir = path.join(PROJECT_ROOT, 'app');
	let docs = '# App Structure\n\n';

	try {
		// Add project overview
		docs += '## Overview\n\n';
		docs +=
			'This is a React Native app built with Expo Router, featuring:\n\n';
		docs += '- Tab-based navigation\n';
		docs += '- Light and dark theme support\n';
		docs += '- Custom components with theming\n';
		docs += '- Animations and gestures\n';
		docs += '- TypeScript support\n\n';

		// Generate directory tree
		docs += '## Directory Structure\n\n';
		docs += '```\n';
		const files = await fs.readdir(appDir, { recursive: true });
		for (const file of files) {
			if (!file.includes('node_modules')) {
				const indent = file.split('/').length - 1;
				docs += ' '.repeat(indent * 2) + file + '\n';
			}
		}
		docs += '```\n\n';

		// Analyze routing and navigation
		docs += '## Routing Analysis\n\n';

		// Read and analyze layout files
		const layoutContent = await fs
			.readFile(path.join(appDir, '_layout.tsx'), 'utf-8')
			.catch(() => '');
		if (layoutContent) {
			docs += '### Root Layout\n\n';
			docs += '```typescript\n';
			const layoutImplementation = layoutContent.match(
				/export\s+default\s+function[^{]*{[\s\S]*?(?=export|$)/
			);
			if (layoutImplementation) {
				docs += layoutImplementation[0].trim();
			}
			docs += '\n```\n\n';
		}

		// Analyze tab navigation
		const tabsLayoutPath = path.join(appDir, '(tabs)', '_layout.tsx');
		const tabsContent = await fs
			.readFile(tabsLayoutPath, 'utf-8')
			.catch(() => '');
		if (tabsContent) {
			docs += '### Tab Navigation\n\n';
			docs += '```typescript\n';
			const tabsImplementation = tabsContent.match(
				/export\s+default\s+function[^{]*{[\s\S]*?(?=export|$)/
			);
			if (tabsImplementation) {
				docs += tabsImplementation[0].trim();
			}
			docs += '\n```\n\n';
		}

		// List all routes
		docs += '### Available Routes\n\n';
		const routes = files.filter(
			(f) =>
				f.endsWith('.tsx') &&
				!f.includes('_layout') &&
				!f.includes('+not-found')
		);
		for (const route of routes) {
			const routePath = path.join(appDir, route);
			const routeContent = await fs
				.readFile(routePath, 'utf-8')
				.catch(() => '');
			if (routeContent) {
				const routeName = route
					.replace(/\.tsx$/, '')
					.replace(/\/index$/, '');
				docs += `#### ${routeName}\n\n`;
				docs += `**File:** \`app/${route}\`\n\n`;

				// Extract route implementation
				const routeImplementation = routeContent.match(
					/export\s+default\s+function[^{]*{[\s\S]*?(?=export|$)/
				);
				if (routeImplementation) {
					docs += '```typescript\n';
					docs += routeImplementation[0].trim();
					docs += '\n```\n\n';
				}
			}
		}
	} catch (error) {
		console.error('Error generating app structure docs:', error);
	}

	return docs;
}

async function generateConfigDocs() {
	let docs = '# Configuration\n\n';

	try {
		// Package.json
		const packageJson = JSON.parse(
			await fs.readFile(path.join(PROJECT_ROOT, 'package.json'), 'utf-8')
		);

		docs += '## Dependencies\n\n';
		docs += '### Production Dependencies\n\n';
		docs += '```json\n';
		docs += JSON.stringify(packageJson.dependencies, null, 2);
		docs += '\n```\n\n';

		docs += '### Development Dependencies\n\n';
		docs += '```json\n';
		docs += JSON.stringify(packageJson.devDependencies, null, 2);
		docs += '\n```\n\n';

		// TSConfig
		const tsConfig = await fs.readFile(
			path.join(PROJECT_ROOT, 'tsconfig.json'),
			'utf-8'
		);
		docs += '## TypeScript Configuration\n\n';
		docs += '```json\n';
		docs += tsConfig;
		docs += '\n```\n\n';
	} catch (error) {
		console.error('Error generating config docs:', error);
	}

	return docs;
}

async function main() {
	try {
		const docs = [
			await generateComponentDocs(),
			await generateHooksDocs(),
			await generateConstantsDocs(),
			await generateAppStructureDocs(),
			await generateConfigDocs()
		].join('\n');

		const docsDir = path.join(PROJECT_ROOT, 'docs');
		await fs.mkdir(docsDir, { recursive: true });
		await fs.writeFile(path.join(docsDir, 'project-docs.md'), docs);

		console.log(
			'Documentation generated successfully in docs/project-docs.md'
		);
	} catch (error) {
		console.error('Error generating documentation:', error);
		process.exit(1);
	}
}

main();
