import { useEffect, useMemo } from "react";
import BaseSelect from "../../../design-system/ui/Select";
import { useQueryToStoreSync } from "../../../hooks/useQueryToStoreSync";
import { useFleetsQuery } from "../../../query/fleet/query";
import { useFleetStore } from "../../../store/fleet/store";

function FleetSelect() {
  const { data, selectedId, setData, setError, resetData, setSelectedFleet } =
    useFleetStore();
  const { loading, data: fleets, error } = useFleetsQuery();

  useQueryToStoreSync({
    query: {
      data: fleets,
      error,
    },
    setData,
    setError,
    resetData,
  });

  useEffect(() => {
    if (data.length === 0) {
      if (selectedId !== null) {
        setSelectedFleet(null);
      }
      return;
    }

    const selectedFleet = data.find((fleet) => fleet.id === selectedId);

    if (!selectedFleet) {
      setSelectedFleet(data[0]);
    }
  }, [data, selectedId, setSelectedFleet]);

  const options = useMemo(
    () =>
      data.map((fleet) => ({
        label: fleet.name,
        value: fleet.id,
      })),
    [data],
  );

  return (
    <BaseSelect
      showSearch
      placeholder="Select fleet"
      loading={loading}
      value={selectedId ?? undefined}
      options={options}
      onChange={(value) => {
        const fleet = data.find((item) => item.id === value) ?? null;
        setSelectedFleet(fleet);
      }}
      optionFilterProp="label"
      style={{ minWidth: 260 }}
    />
  );
}

export default FleetSelect;
