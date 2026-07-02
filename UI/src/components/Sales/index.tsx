import { Outlet } from "react-router-dom";
import { useQueryToStoreSync } from "../../hooks/useQueryToStoreSync";
import { useSalesTeamMembersQuery } from "../../query/sales/team-members.query";

import { useSalesTeamMembersStore } from "../../store/sales/team-members.store";

function Sales() {
  // const selectedTeamId = useGlobalStore((state) => state.selectedTeamId);
  const { setData, setError, resetData } = useSalesTeamMembersStore();
  const { data, error } = useSalesTeamMembersQuery(100);

  useQueryToStoreSync({
    query: {
      data,
      error,
    },
    setData,
    setError,
    resetData,
  });

  return <Outlet />;
}

export default Sales;
