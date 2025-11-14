import { useEffect } from "react";
import { Layout, ConfigProvider } from "antd";
import { Login } from "./components/Auth/Login";
import { Header } from "./components/Auth/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Canvas } from "./components/Canvas/Canvas";
import { useAuthStore } from "./stores/authStore";
import "@ant-design/v5-patch-for-react-19";
import "./App.css";

const { Content, Sider } = Layout;

function App() {
  const { user, checkAuth, isAdmin } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!user) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            borderRadius: 6,
          },
        }}
      >
        <Login />
      </ConfigProvider>
    );
  }

  const isAdminUser = isAdmin();

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <Layout className="app-layout">
        <Header />
        <Layout className="content-layout">
          {isAdminUser && (
            <Sider width={280} theme="light" style={{ overflow: "auto" }}>
              <Sidebar />
            </Sider>
          )}
          <Content className="main-content">
            <Canvas />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
