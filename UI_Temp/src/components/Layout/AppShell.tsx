import AppShellHeader from "./AppShellHeader";
import AppShellSiderMenu from "./AppShellSiderMenu";
import AppShellFooter from "./AppShellFooter";
import AppShellContent from "./AppShellContent";
import { Layout } from "antd";

function AppShell() {
  return (
    <>
      <Layout hasSider>
        <AppShellSiderMenu />
        <Layout>
          <AppShellHeader />
          <AppShellContent />
          <AppShellFooter />
        </Layout>
      </Layout>
    </>
  );
}

export default AppShell;
