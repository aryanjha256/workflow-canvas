import { useRef, useEffect } from "react";
import { Button, Space, message, Modal } from "antd";
import {
  CheckCircleOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { NodeType } from "../../types";
import { useCanvasStore } from "../../stores/canvasStore";
import { useAuthStore } from "../../stores/authStore";
import { Node } from "../Node/Node";
import "./Canvas.css";

export const Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Use individual selectors to ensure re-renders
  const nodes = useCanvasStore((state) => state.nodes);
  const connections = useCanvasStore((state) => state.connections);
  const tempConnection = useCanvasStore((state) => state.tempConnection);
  const validationErrors = useCanvasStore((state) => state.validationErrors);
  const addNode = useCanvasStore((state) => state.addNode);
  const updateTempConnection = useCanvasStore(
    (state) => state.updateTempConnection
  );
  const cancelConnection = useCanvasStore((state) => state.cancelConnection);
  const validateFlow = useCanvasStore((state) => state.validateFlow);
  const clearValidationErrors = useCanvasStore(
    (state) => state.clearValidationErrors
  );
  const clearCanvas = useCanvasStore((state) => state.clearCanvas);

  const { isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();

  console.log("Canvas render - nodes count:", nodes.length);
  console.log("Canvas render - nodes:", nodes);

  // Test to see if canvas receives any events
  const handleMouseEnter = () => {
    console.log("Mouse entered canvas area!");
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    console.log("Drag over canvas", e.target);
    if (!isAdminUser) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    console.log("Drop event triggered", e.target);
    if (!isAdminUser) return;
    e.preventDefault();

    const nodeType = e.dataTransfer.getData("nodeType") as NodeType;
    console.log("Drop event - nodeType:", nodeType);
    if (!nodeType) {
      console.log("No nodeType found in dataTransfer");
      return;
    }

    const rect = canvasRef.current?.getBoundingClientRect();
    console.log("Canvas rect:", rect);
    if (rect) {
      const x = e.clientX - rect.left - 90; // Center the node
      const y = e.clientY - rect.top - 50;
      console.log("Adding node at position:", { x, y });
      addNode(nodeType, { x, y });
      console.log("Nodes after add:", useCanvasStore.getState().nodes);
      message.success(
        `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} node added`
      );
    }
  };

  // Handle mouse move for temp connection
  const handleMouseMove = (e: React.MouseEvent) => {
    if (tempConnection && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      updateTempConnection({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  // Handle canvas click (to cancel connection or deselect)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === svgRef.current) {
      if (tempConnection) {
        cancelConnection();
      }
    }
  };

  // Validate flow
  const handleValidateFlow = () => {
    clearValidationErrors();
    validateFlow();
    console.log(validationErrors);

    if (validationErrors.length === 0) {
      setTimeout(() => {
        const errors = useCanvasStore.getState().validationErrors;
        if (errors.length === 0) {
          message.success("Workflow is valid! All connections are correct.");
        } else {
          Modal.error({
            title: "Validation Errors",
            icon: <ExclamationCircleOutlined />,
            content: (
              <div>
                <p>The following errors were found:</p>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>
                      <strong>Node {error.nodeId}:</strong> {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            ),
          });
        }
      }, 100);
    }
  };

  // Clear canvas
  const handleClearCanvas = () => {
    Modal.confirm({
      title: "Clear Canvas",
      content: "Are you sure you want to clear all nodes and connections?",
      okText: "Yes, Clear",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        clearCanvas();
        message.success("Canvas cleared");
      },
    });
  };

  // Draw connections
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = "";

    // Draw existing connections
    connections.forEach((connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.sourceNodeId);
      const targetNode = nodes.find((n) => n.id === connection.targetNodeId);

      if (sourceNode && targetNode) {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        const startX = sourceNode.position.x + 180; // Node width + output point offset
        const startY = sourceNode.position.y + 50; // Node height / 2
        const endX = targetNode.position.x;
        const endY = targetNode.position.y + 50;

        // Create curved path
        const midX = (startX + endX) / 2;
        const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

        line.setAttribute("d", d);
        line.setAttribute("stroke", "#1890ff");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("fill", "none");
        line.setAttribute("marker-end", "url(#arrowhead)");

        svg.appendChild(line);
      }
    });

    // Draw temporary connection
    if (tempConnection) {
      const sourceNode = nodes.find(
        (n) => n.id === tempConnection.sourceNodeId
      );
      if (sourceNode) {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );

        const startX = sourceNode.position.x + 180;
        const startY = sourceNode.position.y + 50;
        const endX = tempConnection.currentPosition.x;
        const endY = tempConnection.currentPosition.y;

        const midX = (startX + endX) / 2;
        const d = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

        line.setAttribute("d", d);
        line.setAttribute("stroke", "#1890ff");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("fill", "none");
        line.setAttribute("stroke-dasharray", "5,5");
        line.setAttribute("opacity", "0.6");

        svg.appendChild(line);
      }
    }
  }, [nodes, connections, tempConnection]);

  return (
    <div className="canvas-container">
      <div className="canvas-toolbar">
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleValidateFlow}
          >
            Validate Flow
          </Button>
          {isAdminUser && (
            <Button danger icon={<ClearOutlined />} onClick={handleClearCanvas}>
              Clear Canvas
            </Button>
          )}
        </Space>
      </div>

      <div
        ref={canvasRef}
        className="canvas-content"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseMove={handleMouseMove}
        onClick={handleCanvasClick}
        onMouseEnter={handleMouseEnter}
        style={{
          position: "relative",
          backgroundColor: "rgba(255, 0, 0, 0.1)",
        }}
      >
        {/* SVG for connections */}
        <svg
          ref={svgRef}
          className="connections-svg"
          style={{ pointerEvents: "none" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#1890ff" />
            </marker>
          </defs>
        </svg>

        {/* Render nodes */}
        {nodes.map((node) => (
          <Node key={node.id} node={node} />
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="canvas-empty-state">
            <div className="empty-content">
              {isAdminUser ? (
                <>
                  <h3>Start Building Your Workflow</h3>
                  <p>Drag and drop nodes from the sidebar to get started</p>
                </>
              ) : (
                <>
                  <h3>No Workflow Yet</h3>
                  <p>
                    The canvas is empty. An admin needs to create the workflow.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
