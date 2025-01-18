# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-09

### Added

-   Light/dark mode toggle button with sun/moon icon
-   System color scheme detection for initial theme
-   Dark mode styles throughout the game:
    -   Dark backgrounds for containers
    -   Light text colors
    -   Themed grid and cell colors
    -   Adjusted button styles
    -   Themed win message colors
-   TypeScript support for theme prop

### Changed

-   Refactored LightsOutGame component to accept isDark prop
-   Enhanced button feedback with different colors for light/dark modes
-   Improved visual hierarchy in dark mode
-   Updated cell colors for better contrast in both themes

### Fixed

-   toggleLights function undefined error
-   Missing dependency in resetGame useCallback
-   Proper TypeScript types for all props and functions

## [1.0.0] - 2024-01-09

### Added

-   Initial game implementation
-   5x5 grid of toggleable lights
-   Move counter
-   Win condition detection
-   Reset game functionality
-   Haptic feedback for interactions
-   Basic light theme styling
