import { create } from "zustand";
import type {
  WorkflowNode,
  Connection,
  Position,
  NodeType,
  ValidationError,
} from "../types";

interface CanvasState {
  nodes: WorkflowNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  isDraggingNode: boolean;
  isDraggingConnection: boolean;
  tempConnection: {
    sourceNodeId: string;
    sourceType: "output";
    currentPosition: Position;
  } | null;
  validationErrors: ValidationError[];
  scale: number;
  offset: Position;

  // Node Actions
  addNode: (type: NodeType, position: Position) => void;
  updateNodePosition: (nodeId: string, position: Position) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setIsDraggingNode: (isDragging: boolean) => void;

  // Connection Actions
  startConnection: (
    sourceNodeId: string,
    sourceType: "output",
    position: Position
  ) => void;
  updateTempConnection: (position: Position) => void;
  completeConnection: (targetNodeId: string) => void;
  cancelConnection: () => void;
  deleteConnection: (connectionId: string) => void;

  // Validation
  validateFlow: () => void;
  clearValidationErrors: () => void;

  // Canvas Actions
  setScale: (scale: number) => void;
  setOffset: (offset: Position) => void;
  clearCanvas: () => void;
}

let nodeIdCounter = 1;
let connectionIdCounter = 1;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  connections: [],
  selectedNodeId: null,
  isDraggingNode: false,
  isDraggingConnection: false,
  tempConnection: null,
  validationErrors: [],
  scale: 1,
  offset: { x: 0, y: 0 },

  // Node Actions
  addNode: (type: NodeType, position: Position) => {
    const newNode: WorkflowNode = {
      id: `node-${nodeIdCounter++}`,
      type,
      position,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  updateNodePosition: (nodeId: string, position: Position) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    }));
  },

  deleteNode: (nodeId: string) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      connections: state.connections.filter(
        (conn) => conn.sourceNodeId !== nodeId && conn.targetNodeId !== nodeId
      ),
      selectedNodeId:
        state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  selectNode: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },

  setIsDraggingNode: (isDragging: boolean) => {
    set({ isDraggingNode: isDragging });
  },

  // Connection Actions
  startConnection: (
    sourceNodeId: string,
    sourceType: "output",
    position: Position
  ) => {
    set({
      isDraggingConnection: true,
      tempConnection: {
        sourceNodeId,
        sourceType,
        currentPosition: position,
      },
    });
  },

  updateTempConnection: (position: Position) => {
    set((state) => {
      if (!state.tempConnection) return state;
      return {
        tempConnection: {
          ...state.tempConnection,
          currentPosition: position,
        },
      };
    });
  },

  completeConnection: (targetNodeId: string) => {
    const { tempConnection, nodes, connections } = get();
    if (!tempConnection) return;

    const sourceNode = nodes.find((n) => n.id === tempConnection.sourceNodeId);
    const targetNode = nodes.find((n) => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      set({ isDraggingConnection: false, tempConnection: null });
      return;
    }

    // Validation: Check connection rules
    const isValid = validateConnection(sourceNode, targetNode, connections);

    if (isValid) {
      const newConnection: Connection = {
        id: `connection-${connectionIdCounter++}`,
        sourceNodeId: tempConnection.sourceNodeId,
        targetNodeId,
      };

      set((state) => ({
        connections: [...state.connections, newConnection],
        isDraggingConnection: false,
        tempConnection: null,
      }));
    } else {
      set({ isDraggingConnection: false, tempConnection: null });
    }
  },

  cancelConnection: () => {
    set({ isDraggingConnection: false, tempConnection: null });
  },

  deleteConnection: (connectionId: string) => {
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== connectionId),
    }));
  },

  // Validation
  validateFlow: () => {
    const { nodes, connections } = get();
    const errors: ValidationError[] = [];

    nodes.forEach((node) => {
      const incomingConnections = connections.filter(
        (c) => c.targetNodeId === node.id
      );
      const outgoingConnections = connections.filter(
        (c) => c.sourceNodeId === node.id
      );

      if (node.type === "input") {
        if (incomingConnections.length > 0) {
          errors.push({
            nodeId: node.id,
            message: "Input nodes cannot have incoming connections",
          });
        }
        if (outgoingConnections.length === 0) {
          errors.push({
            nodeId: node.id,
            message: "Input node must have at least one outgoing connection",
          });
        }
      }

      if (node.type === "processing") {
        if (incomingConnections.length === 0) {
          errors.push({
            nodeId: node.id,
            message:
              "Processing node must have at least one incoming connection",
          });
        }
        if (outgoingConnections.length === 0) {
          errors.push({
            nodeId: node.id,
            message:
              "Processing node must have at least one outgoing connection",
          });
        }
      }

      if (node.type === "output") {
        if (outgoingConnections.length > 0) {
          errors.push({
            nodeId: node.id,
            message: "Output nodes cannot have outgoing connections",
          });
        }
        if (incomingConnections.length === 0) {
          errors.push({
            nodeId: node.id,
            message: "Output node must have at least one incoming connection",
          });
        }
      }
    });

    // Update nodes with error status
    set((state) => ({
      validationErrors: errors,
      nodes: state.nodes.map((node) => ({
        ...node,
        hasError: errors.some((e) => e.nodeId === node.id),
      })),
    }));
  },

  clearValidationErrors: () => {
    set((state) => ({
      validationErrors: [],
      nodes: state.nodes.map((node) => ({ ...node, hasError: false })),
    }));
  },

  // Canvas Actions
  setScale: (scale: number) => {
    set({ scale: Math.max(0.1, Math.min(3, scale)) });
  },

  setOffset: (offset: Position) => {
    set({ offset });
  },

  clearCanvas: () => {
    set({
      nodes: [],
      connections: [],
      selectedNodeId: null,
      validationErrors: [],
    });
  },
}));

// Helper function to validate connections
function validateConnection(
  sourceNode: WorkflowNode,
  targetNode: WorkflowNode,
  existingConnections: Connection[]
): boolean {
  // Can't connect to itself
  if (sourceNode.id === targetNode.id) return false;

  // Check if connection already exists
  const connectionExists = existingConnections.some(
    (c) => c.sourceNodeId === sourceNode.id && c.targetNodeId === targetNode.id
  );
  if (connectionExists) return false;

  // Input nodes can only have outgoing connections
  if (sourceNode.type === "input" && targetNode.type === "input") return false;

  // Output nodes can only have incoming connections
  if (sourceNode.type === "output") return false;
  if (
    targetNode.type === "output" &&
    sourceNode.type !== "processing" &&
    sourceNode.type !== "input"
  )
    return false;

  // Processing nodes can connect to anything except input nodes
  if (targetNode.type === "input") return false;

  return true;
}
