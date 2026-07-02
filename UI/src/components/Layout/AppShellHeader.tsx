import { Layout } from "antd";
import { useQueryToStoreSync } from "../../hooks/useQueryToStoreSync";
import { useTeamsQuery } from "../../query/global/query";
import { useGlobalStore } from "../../store/global/store";
import ProfileAvatarDropdown from "./ProfileAvatarDropdown";

const { Header } = Layout;

function AppShellHeader() {
  const { setTeams, setError, resetTeams } = useGlobalStore();
  const { data: teams, error } = useTeamsQuery();

  useQueryToStoreSync({
    query: {
      data: teams,
      error,
    },
    setData: setTeams,
    setError,
    resetData: resetTeams,
  });

  return (
    <Header
      style={{
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <ProfileAvatarDropdown />
    </Header>
  );
}

export default AppShellHeader;
