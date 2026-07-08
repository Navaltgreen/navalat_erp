import { Select } from "antd";
import useSalesManagementHeaderStore from "../../../../store/sales/management/header.store";

function SalePhasesSelect() {
  const salesPhaseActive = useSalesManagementHeaderStore(
    (state) => state.salesPhaseActive,
  );
  const setSalesPhase = useSalesManagementHeaderStore(
    (state) => state.setSalesPhase,
  );
  const salesPhases = useSalesManagementHeaderStore(
    (state) => state.salesPhases,
  );
  return (
    <Select
      options={salesPhases}
      defaultValue={salesPhaseActive}
      style={{ width: 240 }}
      onChange={(data) => setSalesPhase(data)}
    />
  );
}

export default SalePhasesSelect;

// import { Segmented } from "antd";
// import useSalesManagementHeaderStore from "../../../../store/sales/management/header.store";

// function SalePhasesSelect() {
//   const salesPhaseActive = useSalesManagementHeaderStore(
//     (state) => state.salesPhaseActive,
//   );

//   const setSalesPhase = useSalesManagementHeaderStore(
//     (state) => state.setSalesPhase,
//   );

//   const salesPhases = useSalesManagementHeaderStore(
//     (state) => state.salesPhases,
//   );

//   return (
//     <Segmented
//       options={salesPhases}
//       value={salesPhaseActive}
//       onChange={(value) => setSalesPhase(value)}
//       size="middle"
//     />
//   );
// }

// export default SalePhasesSelect;