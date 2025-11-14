import { Layout, Button, Space, Typography, Tag, Avatar } from "antd";
import {
  LogoutOutlined,
  UserOutlined,
  GoogleOutlined,
  WindowsOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../stores/authStore";
import "./Header.css";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export const Header = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const getProviderIcon = () => {
    return user.provider === "google" ? (
      <GoogleOutlined />
    ) : (
      <WindowsOutlined />
    );
  };

  const getRoleColor = () => {
    return user.role === "Admin" ? "blue" : "green";
  };

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="header-title">
          <Typography.Title level={4} style={{ margin: 0, color: "white" }}>
            Workflow Canvas
          </Typography.Title>
        </div>

        <Space size="large">
          <Space>
            <Avatar
              icon={<UserOutlined />}
              style={{ backgroundColor: "#1890ff" }}
            />
            <Space direction="horizontal" size={12}>
              <Text strong style={{ color: "white" }}>
                {user.name}
              </Text>
              <Text
                style={{ color: "rgba(255, 255, 255, 0.65)", fontSize: "12px" }}
              >
                {getProviderIcon()} {user.email}
              </Text>
            </Space>
          </Space>

          <Tag
            color={getRoleColor()}
            style={{ fontSize: "14px", padding: "4px 12px" }}
          >
            {user.role}
          </Tag>

          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={logout}
          >
            Logout
          </Button>
        </Space>
      </div>
    </AntHeader>
  );
};
