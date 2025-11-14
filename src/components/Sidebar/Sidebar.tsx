import { Card, Typography, Space } from "antd";
import {
  PlayCircleOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { NodeType } from "../../types";
import "./Sidebar.css";

const { Title, Text } = Typography;

interface NodeTypeItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: "input",
    label: "Input Node",
    icon: <PlayCircleOutlined />,
    color: "#52c41a",
    description: "Starting point for data flow",
  },
  {
    type: "processing",
    label: "Processing Node",
    icon: <ThunderboltOutlined />,
    color: "#1890ff",
    description: "Transform and process data",
  },
  {
    type: "output",
    label: "Output Node",
    icon: <CheckCircleOutlined />,
    color: "#f5222d",
    description: "Endpoint for data flow",
  },
];

export const Sidebar = () => {
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    console.log("Drag start:", nodeType);
    e.dataTransfer.setData("nodeType", nodeType);
    e.dataTransfer.effectAllowed = "copy";
    console.log("DataTransfer set:", e.dataTransfer.getData("nodeType"));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <Title level={5} style={{ marginBottom: "16px" }}>
          Node Types
        </Title>
        <Text
          type="secondary"
          style={{ fontSize: "12px", display: "block", marginBottom: "16px" }}
        >
          Drag and drop nodes onto the canvas
        </Text>

        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.type}
              draggable
              onDragStart={(e) => handleDragStart(e, nodeType.type)}
              style={{ cursor: "grab" }}
            >
              <Card
                className="node-type-card"
                size="small"
                style={{
                  borderLeft: `4px solid ${nodeType.color}`,
                }}
                hoverable
              >
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "20px", color: nodeType.color }}>
                      {nodeType.icon}
                    </span>
                    <Text strong>{nodeType.label}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {nodeType.description}
                  </Text>
                </Space>
              </Card>
            </div>
          ))}
        </Space>

        <Card
          className="sidebar-info"
          size="small"
          style={{ marginTop: "24px", backgroundColor: "#f0f2f5" }}
        >
          <Title level={5} style={{ fontSize: "13px", marginBottom: "8px" }}>
            Connection Rules
          </Title>
          <Space direction="vertical" size={4} style={{ fontSize: "11px" }}>
            <Text type="secondary">• Input: Only outgoing connections</Text>
            <Text type="secondary">• Processing: Both incoming & outgoing</Text>
            <Text type="secondary">• Output: Only incoming connections</Text>
          </Space>
        </Card>
      </div>
    </div>
  );
};
