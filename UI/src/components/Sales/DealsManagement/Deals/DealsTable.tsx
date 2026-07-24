import { Button, Flex, Input, Space, Table } from "antd";
import { useMemo, useState } from "react";
import type { TableProps } from "antd";
import { Edit } from "lucide-react";

import MileStoneModal from "./MileStoneModal";
import { useDealsQuery } from "../../../../query/sales/deals/deals.get.query";
import MilestoneExpandedRow from "./MilestoneExpandedRow";
import EditProjectModal from "./EditProjectModal";


function DealsTable() {

  interface DataType {
    id: number;
    name: string;
    client: {
      id: number;
      name: string;
    };
    created_at: string;
  }
  interface MileStoneModalProps {
    id: number;
    name: string;
    client: {
      id: number;
      name: string;
    };
    created_at: string;
  }

  const { data: data1, loading } = useDealsQuery();

  const projectsdata = data1?.data?.projects ?? [];

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] =
    useState<MileStoneModalProps | null>(null);

  const [isMileStoneModalOpen, setIsMileStoneModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  console.log("Deals query table", data1);
  const records = useMemo(
    () => (projectsdata ?? []) as DataType[],
    [projectsdata],
  );
  console.log("projectdetails", projectsdata);

  const filteredData = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return records.filter((record) => {
      if (normalizedSearch) {
        const searchableValues = [record.name, record.id];
        const matchesSearch = searchableValues.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch),
        );

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [records, searchTerm]);

  const toggleExpandRow = (id: number) => {
    setExpandedRowKeys((prev) =>
      prev.includes(id) ? prev.filter((key) => key !== id) : [...prev, id],
    );
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Project ID",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Button
          type="link"
          style={{ padding: 0, height: "auto" }}
          onClick={() => toggleExpandRow(record.id)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      render: (client: DataType["client"]) => client?.name ?? "-",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (value: string) =>
        value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      // render: (value: string) =>
      //   value ? new Date(value).toLocaleDateString() : "-",
    },
    {
      title: "Purchase Order ID",
      // dataIndex: "created_at",
      // key: "created_at",
      // render: (value: string) =>
      //   value ? new Date(value).toLocaleDateString() : "-",
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      ellipsis: false,
      align: "center",
      // fixed: "right",
      width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          <Flex gap={4}>
            <Button
              color="green"
              variant="solid"
              size="medium"
              onClick={() => {
                setSelectedProject(record);
                setIsMileStoneModalOpen(true);
              }}
            >
              Create MileStone
            </Button>
          </Flex>
        </Flex>
      ),
    },

    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      ellipsis: false,
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Flex gap={4}>
          <Button
            type="link"
            icon={<Edit />}
            onClick={() => {
              setSelectedProject(record);
              setIsEditModalOpen(true);
              // setSelectedLead(record);
              // setIsEditModalOpen(true);
            }}
          ></Button>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {selectedProject && (
        <EditProjectModal
          open={isEditModalOpen}
          project={selectedProject}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}
      {selectedProject && (
        <MileStoneModal
          open={isMileStoneModalOpen}
          projectId={selectedProject.id}
          onClose={() => {
            setIsMileStoneModalOpen(false);
             setSelectedProject(null);
            // setSelectedProposal(null);
          }}
        />
      )}
      <Space wrap style={{ marginBottom: 12 }}>
        <Input
          allowClear
          placeholder="Search name, ID"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 220 }}
        />
      </Space>
      <Table<DataType>
        rowKey="id"
        columns={columns}
        size="small"
        dataSource={filteredData}
        scroll={{ x: "auto" }}
        title={() => "Deals"}
        loading={loading}
        expandable={{
          expandedRowKeys,
          expandedRowRender: (record) => (
            <MilestoneExpandedRow projectId={record.id} />
          ),
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys((prev) =>
                prev.includes(record.id) ? prev : [...prev, record.id],
              );
              return;
            }

            setExpandedRowKeys((prev) => prev.filter((id) => id !== record.id));
          },
        }}
      />
    </>
  );
}

export default DealsTable;
