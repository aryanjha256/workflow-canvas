// User and Authentication Types
export type UserRole = "Admin" | "Viewer";

export type SSOProvider = "google" | "microsoft";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider: SSOProvider;
}

// Node Types
export type NodeType = "input" | "processing" | "output";

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: Position;
  label?: string;
  hasError?: boolean;
}

// Connection Types
export interface Connection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
}

export interface ConnectionPoint {
  nodeId: string;
  type: "input" | "output";
}

// Canvas State
export interface CanvasState {
  nodes: WorkflowNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  isDraggingConnection: boolean;
  tempConnection: {
    sourceNodeId: string;
    sourceType: "output";
    currentPosition: Position;
  } | null;
  validationErrors: string[];
}

// Validation Types
export interface ValidationError {
  nodeId: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
