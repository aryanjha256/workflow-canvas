import { useRef, useEffect, useState } from "react";
import { Card, Typography, Tag } from "antd";
import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { WorkflowNode } from "../../types";
import { useCanvasStore } from "../../stores/canvasStore";
import { useAuthStore } from "../../stores/authStore";
import "./Node.css";

const { Text } = Typography;

interface NodeComponentProps {
  node: WorkflowNode;
}

export const Node = ({ node }: NodeComponentProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const {
    updateNodePosition,
    startConnection,
    completeConnection,
    deleteNode,
    selectedNodeId,
    selectNode,
    setIsDraggingNode,
  } = useCanvasStore();

  const { isAdmin } = useAuthStore();
  const isAdminUser = isAdmin();
  const isSelected = selectedNodeId === node.id;

  const getNodeIcon = () => {
    switch (node.type) {
      case "input":
        return <PlayCircleOutlined style={{ fontSize: "20px" }} />;
      case "processing":
        return <ThunderboltOutlined style={{ fontSize: "20px" }} />;
      case "output":
        return <CheckCircleOutlined style={{ fontSize: "20px" }} />;
    }
  };

  const getNodeColor = () => {
    switch (node.type) {
      case "input":
        return "#52c41a";
      case "processing":
        return "#1890ff";
      case "output":
        return "#f5222d";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdminUser) return;

    if ((e.target as HTMLElement).classList.contains("connection-point")) {
      return;
    }

    e.stopPropagation();
    selectNode(node.id);
    setIsDragging(true);
    setIsDraggingNode(true);

    const rect = nodeRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const canvas = document.querySelector(".canvas-content");
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - dragOffset.x;
        const newY = e.clientY - canvasRect.top - dragOffset.y;

        updateNodePosition(node.id, { x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDraggingNode(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, updateNodePosition, setIsDraggingNode, node.id]);

  const handleOutputClick = (e: React.MouseEvent) => {
    if (!isAdminUser) return;
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    startConnection(node.id, "output", {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const handleInputClick = (e: React.MouseEvent) => {
    if (!isAdminUser) return;
    e.stopPropagation();
    completeConnection(node.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(node.id);
  };

  return (
    <div
      ref={nodeRef}
      className={`workflow-node ${node.type} ${isSelected ? "selected" : ""} ${
        node.hasError ? "error" : ""
      } ${isDragging ? "dragging" : ""}`}
      style={{
        left: node.position.x,
        top: node.position.y,
        cursor: isAdminUser ? "move" : "default",
      }}
      onMouseDown={handleMouseDown}
    >
      <Card
        size="small"
        bordered={false}
        className="node-card"
        style={{ borderLeft: `4px solid ${getNodeColor()}` }}
      >
        <div className="node-header">
          <div className="node-title">
            {getNodeIcon()}
            <Text strong style={{ marginLeft: "8px" }}>
              {node.label}
            </Text>
          </div>
          {isAdminUser && (
            <DeleteOutlined
              className="delete-icon"
              onClick={handleDelete}
              style={{ color: "#ff4d4f", cursor: "pointer" }}
            />
          )}
        </div>
        <Tag
          color={getNodeColor()}
          style={{ fontSize: "11px", marginTop: "4px" }}
        >
          {node.type.toUpperCase()}
        </Tag>
        <Text
          type="secondary"
          style={{ fontSize: "11px", display: "block", marginTop: "4px" }}
        >
          ID: {node.id}
        </Text>

        {/* Connection Points */}
        {node.type !== "output" && isAdminUser && (
          <div
            className="connection-point output-point"
            onClick={handleOutputClick}
            title="Drag to create connection"
          />
        )}
        {node.type !== "input" && isAdminUser && (
          <div
            className="connection-point input-point"
            onClick={handleInputClick}
            title="Connect here"
          />
        )}
      </Card>
    </div>
  );
};
