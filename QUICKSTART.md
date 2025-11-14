# Quick Start Guide - Workflow Canvas

## 🎯 What's Been Built

A complete interactive workflow canvas application with:

- ✅ Authentication (Google & Microsoft SSO mock)
- ✅ Role-Based Access Control (Admin & Viewer)
- ✅ Drag & Drop Nodes
- ✅ Visual Connections with SVG
- ✅ Connection Validation
- ✅ Flow Validation
- ✅ Node Management (Add, Move, Delete)

## 🚀 Application is Running!

Visit: **http://localhost:5173/**

## 🧪 How to Test

### 1. Test as Admin

1. Open http://localhost:5173/
2. Select **Admin** role
3. Click "Sign in with Google" or "Sign in with Microsoft"
4. You'll see:

   - Sidebar with node types (left side)
   - Empty canvas with grid background
   - Header showing your user info

5. **Create a workflow:**

   - Drag "Input Node" from sidebar to canvas
   - Drag "Processing Node" to canvas
   - Drag "Output Node" to canvas
   - Click the blue dot (→) on Input Node and drag to Processing Node
   - Click the blue dot on Processing Node and drag to Output Node
   - Nodes will be connected with curved lines

6. **Test features:**
   - Move nodes by dragging them
   - Delete a node by hovering and clicking the red X
   - Click "Validate Flow" to check if workflow is correct
   - Click "Clear Canvas" to remove everything

### 2. Test as Viewer

1. Logout (top right)
2. Select **Viewer** role
3. Sign in
4. You'll see:
   - NO sidebar (read-only mode)
   - Cannot drag or edit nodes
   - Can only view and validate

### 3. Test Validation

Create an invalid workflow to test validation:

1. Login as Admin
2. Add only an Input Node (no connections)
3. Click "Validate Flow"
4. You'll see error: "Input node must have at least one outgoing connection"
5. The node will be highlighted in red

## 📁 Project Structure

```
src/
├── components/          # All React components
│   ├── Auth/           # Login, Header
│   ├── Canvas/         # Main workspace
│   ├── Node/           # Node component
│   └── Sidebar/        # Node palette
├── stores/             # Zustand state management
│   ├── authStore.ts    # Authentication state
│   └── canvasStore.ts  # Canvas/nodes state
├── services/           # Business logic
│   └── authService.ts  # Mock SSO
├── types/              # TypeScript definitions
└── App.tsx             # Root component
```

## 🎨 Key Features Explained

### Authentication

- Mock SSO with simulated network delay
- Session persistence (refresh page, stays logged in)
- 10% random failure rate (to test error handling)

### Node Types

1. **Input (Green)**: Data entry point

   - Only output connections allowed
   - Must have at least 1 outgoing connection

2. **Processing (Blue)**: Data transformation

   - Both input and output connections
   - Must have at least 1 incoming AND 1 outgoing

3. **Output (Red)**: Data endpoint
   - Only input connections allowed
   - Must have at least 1 incoming connection

### Connection Rules

- ✅ Input → Processing
- ✅ Input → Output
- ✅ Processing → Processing
- ✅ Processing → Output
- ❌ Output → anything (no outgoing)
- ❌ anything → Input (no incoming)
- ❌ Self-connections
- ❌ Duplicate connections

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 Testing Checklist

- [ ] Login with Google SSO (both roles)
- [ ] Login with Microsoft SSO (both roles)
- [ ] Logout functionality
- [ ] Drag nodes from sidebar (Admin only)
- [ ] Move nodes on canvas (Admin only)
- [ ] Create connections between nodes (Admin only)
- [ ] Delete individual nodes (Admin only)
- [ ] Clear entire canvas (Admin only)
- [ ] Validate workflow with errors
- [ ] Validate workflow without errors
- [ ] Viewer cannot edit anything
- [ ] Session persists on page refresh
- [ ] Visual feedback (node selection, errors)
- [ ] Connection point hover effects
- [ ] Connection lines update when moving nodes

## 🐛 If Something Doesn't Work

1. **Check browser console** for errors (F12)
2. **Clear sessionStorage**: Open Dev Tools → Application → Session Storage → Clear
3. **Refresh the page**
4. **Check terminal** for any build errors

## 📝 Next Steps

1. Test all features thoroughly
2. Take screenshots for documentation
3. Deploy to Vercel/Netlify (optional)
4. Update README with your repo link and live demo
5. Create a demo video (optional but recommended)

## 🎉 Success Indicators

You've successfully completed the challenge if:

- [x] Authentication works with role selection
- [x] Admin can create and edit workflows
- [x] Viewer has read-only access
- [x] Nodes can be dragged and connected
- [x] Connection rules are enforced
- [x] Validation highlights errors
- [x] UI adapts based on role
- [x] Code is clean and well-organized
- [x] TypeScript types are comprehensive
- [x] Zustand manages state effectively

---

**Congratulations! Your Workflow Canvas is ready! 🚀**
