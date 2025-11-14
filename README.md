# Workflow Canvas - Interactive Node-Based Workflow Editor# React + TypeScript + Vite

A modern, interactive web-based workflow canvas application built with React, TypeScript, Ant Design, and Zustand. This application allows users to create and visualize data flow workflows by dragging nodes onto a canvas and connecting them.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🚀 Live DemoCurrently, two official plugins are available:

[Add your deployed URL here]- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 📹 Demo Video

## React Compiler

[Add video link here if available]

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## ✨ Features

## Expanding the ESLint configuration

### Core Features

- ✅ **Authentication System**If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

  - Mock Google SSO

  - Mock Microsoft SSO```js

  - Role-based authentication (Admin/Viewer)export default defineConfig([

  - Session persistence globalIgnores(['dist']),

    {

- ✅ **Role-Based Access Control (RBAC)** files: ['**/*.{ts,tsx}'],

  - **Admin Role**: Full CRUD access - create, edit, move, connect, and delete nodes extends: [

  - **Viewer Role**: Read-only access - view nodes and connections without modification // Other configs...

  - Dynamic UI adaptation based on user role

    // Remove tseslint.configs.recommended and replace with this

- ✅ **Interactive Canvas** tseslint.configs.recommendedTypeChecked,

  - Drag and drop nodes from sidebar onto canvas // Alternatively, use this for stricter rules

  - Move nodes around the workspace tseslint.configs.strictTypeChecked,

  - Visual grid background for better alignment // Optionally, add this for stylistic rules

  - Empty state with helpful instructions tseslint.configs.stylisticTypeChecked,

- ✅ **Three Node Types** // Other configs...

  - **Input Node** (Green): Starting point for data flow, only outgoing connections ],

  - **Processing Node** (Blue): Transform data, both incoming and outgoing connections languageOptions: {

  - **Output Node** (Red): Endpoint for data, only incoming connections parserOptions: {

        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- ✅ **Connection System** tsconfigRootDir: import.meta.dirname,

  - Click and drag to create connections between nodes },

  - Visual connection points on nodes // other options...

  - Curved SVG paths for connections },

  - Real-time visual feedback during connection creation },

  - Arrow markers to show data flow direction])

````

- ✅ **Connection Validation Rules**

  - Input nodes: Can only have outgoing connectionsYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

  - Output nodes: Can only have incoming connections

  - Processing nodes: Can have both incoming and outgoing connections```js

  - Prevents invalid connections (e.g., output-to-input, self-connections, duplicates)// eslint.config.js

import reactX from 'eslint-plugin-react-x'

- ✅ **Flow Validation**import reactDom from 'eslint-plugin-react-dom'

  - "Validate Flow" button to check entire workflow

  - Highlights nodes with errors in redexport default defineConfig([

  - Detailed error messages for each validation issue  globalIgnores(['dist']),

  - Checks for missing required connections  {

    files: ['**/*.{ts,tsx}'],

- ✅ **Additional Features**    extends: [

  - Delete nodes (and their connections)      // Other configs...

  - Clear entire canvas      // Enable lint rules for React

  - Node selection with visual feedback      reactX.configs['recommended-typescript'],

  - Responsive design      // Enable lint rules for React DOM

  - Professional UI with Ant Design components      reactDom.configs.recommended,

    ],

## 🏗️ Architecture    languageOptions: {

      parserOptions: {

### Technology Stack        project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **Frontend Framework**: React 19 with TypeScript        tsconfigRootDir: import.meta.dirname,

- **UI Library**: Ant Design (antd)      },

- **State Management**: Zustand      // other options...

- **Build Tool**: Vite    },

- **Styling**: CSS Modules with custom CSS  },

])

### Project Structure```

````

src/
├── components/
│ ├── Auth/
│ │ ├── Login.tsx # Login screen with SSO selection
│ │ ├── Login.css
│ │ ├── Header.tsx # App header with user info
│ │ └── Header.css
│ ├── Canvas/
│ │ ├── Canvas.tsx # Main canvas workspace
│ │ └── Canvas.css
│ ├── Node/
│ │ ├── Node.tsx # Individual node component
│ │ └── Node.css
│ └── Sidebar/
│ ├── Sidebar.tsx # Node type selector sidebar
│ └── Sidebar.css
├── stores/
│ ├── authStore.ts # Authentication state management
│ └── canvasStore.ts # Canvas and nodes state management
├── services/
│ └── authService.ts # Mock SSO authentication
├── types/
│ └── index.ts # TypeScript type definitions
├── App.tsx # Root application component
├── App.css
├── main.tsx # Application entry point
└── index.css # Global styles

````

### State Management with Zustand

#### Why Zustand?
I chose Zustand for state management for the following reasons:

1. **Simplicity**: Minimal boilerplate compared to Redux or MobX
2. **Performance**: Only re-renders components that subscribe to changed state
3. **TypeScript Support**: Excellent type inference and type safety
4. **No Context Providers**: Direct store access without Provider wrapper complexity
5. **Developer Experience**: Simple API, easy to test, and great debugging
6. **Size**: Lightweight (~1KB) with no dependencies

#### Store Architecture

**Auth Store** (`authStore.ts`):
- Manages user authentication state
- Handles SSO login/logout operations
- Provides role checking utilities (isAdmin, isViewer)
- Persists authentication state in sessionStorage

**Canvas Store** (`canvasStore.ts`):
- Manages nodes and connections
- Handles drag-and-drop operations
- Implements connection creation and validation logic
- Provides workflow validation functionality
- Manages UI state (selection, dragging, errors)

### Mock SSO Implementation

The authentication system simulates real OAuth flows with configurable delays and failure rates:

- **Mock Users**: Pre-configured users for each provider and role combination
- **Session Management**: Uses sessionStorage to persist authentication tokens
- **Realistic Behavior**: Includes network delay simulation and random failure scenarios
- **Provider Support**: Google and Microsoft SSO providers

## 🔒 Role-Based Access Control

### Admin Role
- Can drag nodes from sidebar to canvas
- Can move nodes around the canvas
- Can create connections between nodes
- Can delete nodes and connections
- Can clear entire canvas
- Sees sidebar with available node types
- All interactive elements are enabled

### Viewer Role
- Can view all nodes and connections
- Can validate workflow
- Cannot modify canvas (no sidebar visible)
- Cannot drag, create, edit, or delete
- UI elements that modify state are hidden

## 🎯 Connection Validation Rules

The application enforces strict connection rules:

1. **Input Nodes**:
   - ❌ Cannot receive incoming connections
   - ✅ Must have at least one outgoing connection (validated)
   - ✅ Can connect to Processing or Output nodes

2. **Processing Nodes**:
   - ✅ Must have at least one incoming connection (validated)
   - ✅ Must have at least one outgoing connection (validated)
   - ✅ Can connect to other Processing or Output nodes
   - ❌ Cannot connect to Input nodes

3. **Output Nodes**:
   - ✅ Must have at least one incoming connection (validated)
   - ❌ Cannot have outgoing connections
   - ❌ Cannot connect to other nodes

4. **General Rules**:
   - ❌ No self-connections
   - ❌ No duplicate connections
   - ✅ Visual feedback for valid/invalid connection attempts

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd workflow-canvas
````

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to:

```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🧪 Testing the Application

### Login Testing

1. Start the application
2. Select a role (Admin or Viewer)
3. Click on either Google or Microsoft SSO button
4. You'll be automatically logged in with a mock user

### Admin Flow Testing

1. Login as Admin
2. Drag nodes from sidebar to canvas
3. Create connections by clicking output points and dragging to input points
4. Move nodes around by dragging them
5. Click "Validate Flow" to check for errors
6. Delete nodes using the delete icon
7. Clear canvas using "Clear Canvas" button

### Viewer Flow Testing

1. Login as Viewer
2. Notice sidebar is not visible
3. Verify you cannot interact with nodes (no dragging, no connections)
4. You can still validate the flow (if any nodes exist)

## 🔄 Trade-offs and Decisions

### 1. No Backend

- **Trade-off**: Used sessionStorage for persistence instead of real backend
- **Reason**: Focus on frontend architecture and state management
- **Future**: Could easily integrate with REST API or GraphQL backend

### 2. SVG for Connections

- **Trade-off**: Manual SVG path calculation instead of using a library
- **Reason**: Challenge requirement to build core logic ourselves
- **Benefit**: Full control over rendering and performance
- **Limitation**: Curved paths are simple Bezier curves (could be enhanced)

### 3. Zustand Over Redux

- **Decision**: Used Zustand instead of Redux
- **Reason**:
  - Simpler API with less boilerplate
  - Better TypeScript inference
  - Sufficient for application scale
  - Easier to understand and maintain

### 4. Component Structure

- **Trade-off**: Some components are larger (e.g., Canvas, Node)
- **Reason**: Kept related logic together for clarity
- **Future**: Could split into smaller sub-components if needed

### 5. Validation Approach

- **Decision**: Manual validation in canvas store
- **Reason**: Simple rules, easy to understand and extend
- **Alternative**: Could use a graph validation library for complex workflows

## 🎨 What I Would Improve with More Time

### High Priority

1. **Undo/Redo System**

   - Implement command pattern for action history
   - Allow users to undo/redo any action
   - Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

2. **Persistent Storage**

   - Save workflows to backend/localStorage
   - Load saved workflows
   - Multiple workflow support with naming

3. **Real-time Collaboration**

   - WebSocket integration
   - Show other users' cursors and actions
   - Conflict resolution for simultaneous edits

4. **Zoom and Pan**
   - Mouse wheel zoom
   - Drag canvas to pan
   - Mini-map for navigation
   - Fit-to-screen functionality

### Medium Priority

5. **Enhanced Connections**

   - Select and delete individual connections
   - Connection labels/conditions
   - Different connection types (data, control flow)
   - Better path routing (avoid node overlap)

6. **Node Enhancements**

   - Custom node data/properties panel
   - Node resize capability
   - Copy/paste nodes
   - Node grouping/containers
   - Custom icons and colors

7. **Advanced Validation**

   - Cycle detection in workflow
   - Data type compatibility checking
   - Real-time validation (as you build)
   - Export validation report

8. **UI/UX Improvements**
   - Keyboard shortcuts for all actions
   - Context menus (right-click)
   - Node search/filter
   - Canvas snap-to-grid option
   - Dark mode theme

### Low Priority

9. **Testing**

   - Unit tests for stores and utilities
   - Component tests with React Testing Library
   - E2E tests with Playwright/Cypress
   - Visual regression tests

10. **Export/Import**

    - Export workflow as JSON
    - Import workflow from JSON
    - Export as image/PDF
    - Share workflow via URL

11. **Advanced Features**
    - Workflow templates
    - Auto-layout algorithms
    - Workflow execution simulation
    - Performance metrics/analytics
    - Accessibility (ARIA labels, keyboard navigation)

## 🐛 Known Limitations

1. **Mobile Support**: Not optimized for touch devices (drag-and-drop may not work)
2. **Connection Routing**: Connections are simple curves (don't avoid nodes)
3. **Large Workflows**: No virtualization (performance may degrade with 100+ nodes)
4. **Browser Compatibility**: Tested only on latest Chrome/Firefox/Safari
5. **Connection Visual Feedback**: Limited visual cues during invalid connection attempts

## 📝 Key Design Decisions

### Component Isolation

Each component is self-contained with its own styles and logic, making it easy to:

- Test individually
- Reuse in different contexts
- Modify without affecting others

### Type Safety

Comprehensive TypeScript types ensure:

- Compile-time error catching
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

### Performance Considerations

- Zustand prevents unnecessary re-renders
- SVG connections update only when nodes move
- Minimal DOM manipulation
- Event delegation where appropriate

### User Experience

- Immediate visual feedback for all actions
- Clear error messages
- Confirmation dialogs for destructive actions
- Loading states for async operations
- Intuitive drag-and-drop interface

## 🤝 Contributing

This is a coding challenge project, but suggestions and feedback are welcome!

## 📄 License

MIT

## 👨‍💻 Author

[Your Name]

---

**Note**: This application was built as a coding challenge to demonstrate proficiency in React, TypeScript, state management, and complex UI interactions. It showcases architectural decisions, clean code practices, and problem-solving abilities.
