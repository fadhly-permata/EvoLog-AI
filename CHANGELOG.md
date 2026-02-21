# Changelog

## [0.0.5b](https://github.com/fadhly-permata/EvoLog-AI/commit/24ee0bd538da51409bb1ef93460f4e9151cad4a8) - 2026-02-20 19:26:58

### Commit Message
- `ci: add main branch protection rules`
- `ci: add extension publish workflow`
- `ci: add test workflow for extension`
- `chore: ignore changelog generator script`
- `docs: expand CHANGELOG with detailed history`
- `build: add release scripts to package.json`

### Added
- Added GitHub ruleset `.github/rulesets/main-branch-rules.yml` with branch protection rules for the main branch
- Added GitHub workflow `.github/workflows/publish.yml` for publishing extensions
- Added GitHub workflow `.github/workflows/test.yml` for testing extensions
- Added release scripts to `package.json` under the "scripts" section
- Added `.gitignore` entry for the changelog generator script

### Enhanced
- Enhanced `CHANGELOG.md` with detailed history and expanded documentation

### Updated
- Updated `package.json` to include new release scripts

### Refactored
- N/A

### Removed
- N/A

----

## [0.0.5a](https://github.com/fadhly-permata/EvoLog-AI/commit/1166458570cd1fe42b02bd98bfeb89c53a62ba49) - 2026-02-20 03:01:34

OPTIONAL: If we have breaking changes!
### Added
- Added support for `node_modules/.bin` executables in `npm-run-all`
- Added `package-lock.json` to version control

### Enhanced
- Enhanced JSON handling with proper indentation in `package.json`

### Updated
- Updated dependencies locking mechanism with `package-lock.json`

### Removed
- Removed unnecessary file changes restrictions

----

## [0.0.5](https://github.com/fadhly-permata/EvoLog-AI/commit/e13cd2e6cdedc909fbc1a270b171632493f24575) - 2026-02-20 03:01:21

### Commit Message
- docs: add CODE_OF_CONDUCT.md
- docs: add CONTRIBUTING.md guide
- docs: add SECURITY.md policy

### Added
- New documentation files for project governance and community guidelines:
    - `CODE_OF_CONDUCT.md` - Added code of conduct policy file
    - `CONTRIBUTING.md` - Added contributing guidelines file
    - `SECURITY.md` - Added security policy file

### Enhanced
N/A

### Updated
N/A

### Refactored
N/A

### Removed
N/A

----

## [0.0.4](https://github.com/fadhly-permata/EvoLog-AI/commit/09c7114b04c7bb1f930b843b7973ba8a93f4cf8f) - 2026-02-20 02:50:25

0.0.4
### Added
- Added new dependency `piscina` for worker thread pooling
- Added new dependency `uuid-random` for generating unique identifiers
- Added new file `package-lock.json` with locked dependency versions
### Enhanced
- Updated `package.json` metadata with new dependencies for improved thread handling
### Removed
- N/A

----

## [0.0.3](https://github.com/fadhly-permata/EvoLog-AI/commit/98e4e647f6bc5266a10730cbd6dbf92693ee8ba1) - 2026-02-20 02:50:15

### Commit Message
- docs: update project name in README
- chore: bump version to 0.0.3  
- build: add publish scripts to package.json

### Added
- New publish scripts in `package.json`:
  - `prepublishOnly` script
  - `publish` script

### Enhanced
- N/A

### Updated
- Project version in `package.json` from `0.0.2` to `0.0.3`
- Project name in README.md from `@perqara/node-git-tools` to `@fadhlyper/node-git-tools`

### Refactored
- N/A

### Removed
- N/A

----

## [0.0.2](https://github.com/fadhly-permata/EvoLog-AI/commit/0142d2bba4f2f216c4945fe6ddc718187e17b426) - 2026-02-20 02:37:29

### Commit Message
chore: update .gitignore pattern for vsix files  
build: bump version to 0.0.2

### Added
N/A

### Enhanced
N/A

### Updated
- Updated `.gitignore` file: Modified pattern for ignoring VSIX files from specific pattern to broader pattern
- Updated `package.json`: Bumped version number from 0.0.1 to 0.0.2

### Refactored
N/A

### Removed
N/A

----

## [0.0.1f](https://github.com/fadhly-permata/EvoLog-AI/commit/f3742fc4ecb690b92165b3d376a397b4095d1fb0) - 2026-02-20 02:34:17

### Commit Message
chore: ignore VSIX build output in gitignore  
style: reorganize asset files into dedicated directory  
chore: update dependencies in package-lock.json  
feat: enhance package metadata and configuration

### Added
- Added VSIX build output to `.gitignore` to exclude extension package files from version control
- Created new `assets/images/` directory structure for organized asset storage

### Enhanced
- Enhanced package metadata in `package.json` with improved configuration settings

### Updated
- Updated dependencies in `package-lock.json` with 6,382 additions and 6,355 deletions
- Updated asset file locations by moving from `src/assets/` to `assets/images/` directory

### Refactored
- Reorganized asset file structure by migrating `evo.png` and `evo.svg` from `src/assets/` to dedicated `assets/images/` directory

### Removed
N/A

----

## [0.0.1e](https://github.com/fadhly-permata/EvoLog-AI/commit/993dbcd186e9e60cff12635fee6606cb48b62b1e) - 2026-02-20 01:25:57

### Commit Message
Adds AI-powered commit message generation feature and refines README

### Added
- AI-powered commit message generation using Ollama integration
- VS Code command for generating and inserting commit messages into SCM
- Extension icon (evo.png and evo.svg assets)
- Error handling and user prompts for staged/unstaged changes
- Conventional commit formatting with AI analysis of code changes

### Enhanced
- README with simplified feature descriptions and setup instructions
- package.json configuration with extension icon and updated metadata

### Updated
- Extension functionality to support AI-generated commit messages from git diffs

### Refactored
- README.md structure for better clarity and user guidance

### Removed
- N/A

----

## [0.0.1d](https://github.com/fadhly-permata/EvoLog-AI/commit/98f61a568930f432bf4f945eead04ad3e99ac8ac) - 2026-02-19 23:16:29

### Commit Message
Added .gitignore file to exclude build outputs

- Introduces a basic .gitignore configuration to prevent version control from tracking compiled artifacts and test outputs in the 'out' directory
- Helps keep the repository clean by avoiding accidental commits of generated files and reduces repository bloat

### Added
- **.gitignore file** - New configuration file with basic ignore patterns for build outputs

### Enhanced
N/A

### Updated
N/A

### Refactored
N/A

### Removed
N/A

----

## [0.0.1c](https://github.com/fadhly-permata/EvoLog-AI/commit/5b217d87f4c51846e313cf4baaf37e9dfeb6d860) - 2026-02-19 23:14:55

### Commit Message
Enhances README with detailed features and modern formatting

### Added
- `README.md`: Added comprehensive documentation sections including:
  - Modern, professional formatting with emojis and badges
  - Detailed feature sections organized by functionality
  - Enhanced privacy and security information
  - Quick start guide and usage instructions
  - Configuration options reference table
  - Improved marketing language and value proposition

### Enhanced
- `README.md`: Enhanced the entire document's structure and clarity, transforming it from a basic template to a polished, informative guide

### Updated
- `README.md`: Updated content to provide clear setup and configuration instructions

### Refactored
- `README.md`: Refactored the document layout and organization for better readability and user experience

### Removed
- `README.md`: Removed 48 lines of previous content and basic template structure, replacing them with 62 lines of enhanced documentation

----

## [0.0.1b](https://github.com/fadhly-permata/EvoLog-AI/commit/605f29504b7febcc65780ef11bb32b1bbf01bc91) - 2026-02-19 22:23:23

### Commit Message
Initial Commits

### Added
- Initial project structure and configuration files including:
  - ESLint configuration for TypeScript (.vscode-test.mjs, eslint.config.mjs)
  - VS Code development configuration (.vscode/launch.json, .vscode/tasks.json, .vscode/settings.json)
  - Package.json with development dependencies
  - Extension source code structure (src/extension.ts)
  - Test files (src/test/extension.test.ts)
  - Comprehensive node_modules dependencies for:
    - TypeScript ESLint tooling (@typescript-eslint/* packages)
    - VS Code API integration (@types/vscode)
    - Testing framework (@vscode/test-electron, mocha, c8)
    - Build and development tools

### Enhanced
N/A

### Updated
N/A

### Refactored
N/A

### Removed
N/A

----

## [0.0.1a](https://github.com/fadhly-permata/EvoLog-AI/commit/d540ccab077fe77f8bced9b7d79808abf9fe2e12) - 2026-02-19 22:05:42

### Commit Message
Initial commit

### Added
- LICENSE file with Apache License 2.0
- README.md file with basic project description

### Enhanced
N/A

### Updated
N/A

### Refactored
N/A

### Removed
N/A

----




