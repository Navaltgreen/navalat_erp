import { Select } from "antd";

import useSalesDealsHeaderStore from "../../../../store/sales/deals/header.store";

function DealsPhasesSelect() {
  const dealsPhaseActive = useSalesDealsHeaderStore(
    (state) => state.dealsPhaseActive,
  );
  const setDealsPhase = useSalesDealsHeaderStore(
    (state) => state.setDealsPhase,
  );
  const dealsPhases = useSalesDealsHeaderStore(
    (state) => state.dealsPhases,
  );
  return (
    <Select
      options={dealsPhases}
      defaultValue={dealsPhaseActive}
      style={{ width: 240 }}
      onChange={(data) => setDealsPhase(data)}
    />
  );
}

export default DealsPhasesSelect;

