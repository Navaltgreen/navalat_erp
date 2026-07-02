import { Table, type TableProps } from "antd";

export type BaseTableProps<T extends object = object> = TableProps<T>;

function BaseTable<T extends object = object>({
  bordered = true,
  size = "middle",
  pagination = { pageSize: 10, showSizeChanger: true },
  ...props
}: BaseTableProps<T>) {
  return (
    <Table<T>
      bordered={bordered}
      size={size}
      pagination={pagination}
      {...props}
    />
  );
}

export default BaseTable;
