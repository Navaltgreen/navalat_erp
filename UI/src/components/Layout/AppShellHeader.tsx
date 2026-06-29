import { Layout } from "antd";
import ProfileAvatarDropdown from "./ProfileAvatarDropdown";

const { Header } = Layout;

function AppShellHeader() {
  return (
    <Header
      style={{
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "48px",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <ProfileAvatarDropdown />
    </Header>
  );
}

export default AppShellHeader;
