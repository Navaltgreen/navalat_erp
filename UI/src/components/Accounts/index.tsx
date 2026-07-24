import { useEffect } from "react";
import { useQueryToStoreSync } from "../../hooks/useQueryToStoreSync";
import { useDealsQuery } from "../../query/sales/deals/deals.get.query";
import { useSalesTeamMembersQuery } from "../../query/sales/team-members.query";
import useAccountsHeaderStore from "../../store/accounts/header.store";
import { useSalesTeamMembersStore } from "../../store/sales/team-members.store";
import { Select, Space } from "antd";
import AccountsTable from "./AccountsTable";
function Accounts() {
  // const selectedTeamId = useGlobalStore((state) => state.selectedTeamId);
  const { setData, setError, resetData } = useSalesTeamMembersStore();
  const { data, error } = useSalesTeamMembersQuery(100);
  const { data: projectData } = useDealsQuery();
  const { projects, selectedProjectId, setProjects, setSelectedProjectId } =
    useAccountsHeaderStore();

  useQueryToStoreSync({
    query: {
      data,
      error,
    },
    setData,
    setError,
    resetData,
  });
  useEffect(() => {
    if (projectData?.data?.projects) {
      setProjects(projectData.data.projects);
    }
  }, [projectData, setProjects]);

  return (
    <>
      <Space wrap style={{ marginBottom: 12 }}>
        <Select
          placeholder="Select Project"
          value={selectedProjectId}
          onChange={setSelectedProjectId}
          options={projects.map((project) => ({
            label: project.name,
            value: project.id,
          }))}
        />
      </Space>

      {selectedProjectId && <AccountsTable projectId={selectedProjectId} />}
    </>
  );
}

export default Accounts;
