import { DatePicker } from "antd";
import dayjs from "dayjs";
import useSalesManagementHeaderStore from "../../../../store/sales/management/header.store";

const { RangePicker } = DatePicker;
const dateFormat = "YYYY-MM-DD";

function DateRangePicker() {
  const dateRange = useSalesManagementHeaderStore((state) => state.dateRange);
  return (
    <RangePicker
      allowClear={false}
      defaultValue={[
        dayjs(dateRange[0], dateFormat),
        dayjs(dateRange[1], dateFormat),
      ]}
    />
  );
}

export default DateRangePicker;
