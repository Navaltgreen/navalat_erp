import { Layout } from "antd";

const { Footer } = Layout;

function AppShellFooter() {
  return (
    <Footer style={{ textAlign: "center" }}>
      Navix ©{new Date().getFullYear()} Created by Oceanix Team
    </Footer>
  );
}

export default AppShellFooter;
