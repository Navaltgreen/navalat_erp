import { Select, type SelectProps } from "antd";

export type BaseSelectProps = SelectProps;

function BaseSelect(props: BaseSelectProps) {
  return <Select {...props} />;
}

export default BaseSelect;
