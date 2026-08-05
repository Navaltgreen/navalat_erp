import { useEffect, useMemo } from "react";
import BaseSelect from "../../../design-system/ui/Select";
import { useQueryToStoreSync } from "../../../hooks/useQueryToStoreSync";
import { useVesselsQuery } from "../../../query/vessel/query";
import { useVesselStore } from "../../../store/vessel/store";

function VesselSelect() {
  const { data, selectedId, setData, setError, resetData, setSelectedVessel } =
    useVesselStore();
  const { loading, data: vessels, error } = useVesselsQuery();

  useQueryToStoreSync({
    query: {
      data: vessels,
      error,
    },
    setData,
    setError,
    resetData,
  });

  useEffect(() => {
    if (data.length === 0) {
      if (selectedId !== null) {
        setSelectedVessel(null);
      }
      return;
    }

    const selectedVessel = data.find((vessel) => vessel.id === selectedId);

    if (!selectedVessel) {
      setSelectedVessel(data[0]);
    }
  }, [data, selectedId, setSelectedVessel]);

  const options = useMemo(
    () =>
      data.map((vessel) => ({
        label: `${vessel.name} (${vessel.imo})`,
        value: vessel.id,
      })),
    [data],
  );

  return (
    <BaseSelect
      showSearch
      placeholder="Select vessel"
      loading={loading}
      value={selectedId ?? undefined}
      options={options}
      onChange={(value) => {
        const vessel = data.find((item) => item.id === value) ?? null;
        setSelectedVessel(vessel);
      }}
      optionFilterProp="label"
      style={{ minWidth: 260 }}
    />
  );
}

export default VesselSelect;
