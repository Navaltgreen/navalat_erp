import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

function AppShellContent() {
  return (
    <Content style={{ margin: "12px 12px 0", overflow: "initial" }}>
      <Outlet />
    </Content>
  );
}

export default AppShellContent;
