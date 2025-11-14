import { useState } from "react";
import { Card, Button, Space, Radio, Typography, Alert, Spin } from "antd";
import { GoogleOutlined, WindowsOutlined } from "@ant-design/icons";
import type { UserRole, SSOProvider } from "../../types";
import { useAuthStore } from "../../stores/authStore";
import "./Login.css";

const { Title, Text } = Typography;

export const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Admin");
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async (provider: SSOProvider) => {
    clearError();
    await login(provider, selectedRole);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className="login-header">
            <Title level={2}>Workflow Canvas</Title>
            <Text type="secondary">Sign in to continue</Text>
          </div>

          {error && (
            <Alert
              message="Authentication Failed"
              description={error}
              type="error"
              closable
              onClose={clearError}
            />
          )}

          <div className="role-selection">
            <Text strong>Select Role:</Text>
            <Radio.Group
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              buttonStyle="solid"
              size="large"
              style={{ width: "100%" }}
            >
              <Radio.Button
                value="Admin"
                style={{ width: "50%", textAlign: "center" }}
              >
                Admin
              </Radio.Button>
              <Radio.Button
                value="Viewer"
                style={{ width: "50%", textAlign: "center" }}
              >
                Viewer
              </Radio.Button>
            </Radio.Group>
            <Text
              type="secondary"
              style={{ fontSize: "12px", marginTop: "8px", display: "block" }}
            >
              {selectedRole === "Admin"
                ? "Full access: Create, edit, and delete nodes"
                : "Read-only: View nodes and connections"}
            </Text>
          </div>

          <div className="sso-buttons">
            <Text strong style={{ marginBottom: "12px", display: "block" }}>
              Choose SSO Provider:
            </Text>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                size="large"
                icon={<GoogleOutlined />}
                onClick={() => handleLogin("google")}
                loading={isLoading}
                disabled={isLoading}
                block
                className="google-button"
              >
                Sign in with Google
              </Button>
              <Button
                type="default"
                size="large"
                icon={<WindowsOutlined />}
                onClick={() => handleLogin("microsoft")}
                loading={isLoading}
                disabled={isLoading}
                block
                className="microsoft-button"
              >
                Sign in with Microsoft
              </Button>
            </Space>
          </div>

          {isLoading && (
            <div style={{ textAlign: "center" }}>
              <Spin tip="Authenticating..." />
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
};
