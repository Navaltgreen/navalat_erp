import {
  Button,
  Col,
  message,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import type { TableRowSelection } from "antd/es/table/interface";
import type {
  AssignWorkPayload,
  Team,
  WorkListData,
} from "../../../../types/oceanix/works/work_list";
import { useWorkAddStore } from "../../../../store/oceanix/works/work_add";
import { useWorkListStore } from "../../../../store/oceanix/works/work_list";

const { Title } = Typography;

const WorkList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedMember, setSelectedMember] = useState<{
    id: number;
    name: string;
  } | null>(null);
  console.log("selectedMember: ", selectedMember);
  const fetchAllWorkList = useWorkListStore((s) => s.fetchAllWorkList);
  const fetchTeamMembers = useWorkListStore((s) => s.fetchTeamMembers);
  const assignWorkToMember = useWorkListStore((s) => s.assignWorkToMember);
  const teamMembersList = useWorkListStore((s) => s.teamMembers);
  const loading = useWorkListStore((s) => s.loading);
  const data = useWorkListStore((s) => s.workList);
  const selectedRows = data.filter((row) => selectedRowKeys.includes(row.id));
  const fetchAllProjects = useWorkAddStore((s) => s.fetchAllProjects);
  const projects = useWorkAddStore((s) => s.projects);
  const [projectId, setProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllProjects();
    fetchTeamMembers(100);
  }, []);

  const projectOptions = projects?.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const handleProjectChange = (value: number) => {
    setProjectId(value);
    fetchAllWorkList(value);
  };

  const buildPayloadItem = (
    row: WorkListData,
    member: { id: number; name: string },
  ) => ({
    work_id: row.id,
    project_id: row.project_id,
    project_name: row.project_name,
    category: row.category,
    subcategory: row.subcategory,
    tab: row.tab,
    status: row.status,
    description: row.description,
    comments: row.comments,
    created_at: row.created_at,
    created_by: row.created_by,
    updated_at: row.updated_at,
    updated_by: row.updated_by,
    assigned_to: {
      id: member.id,
      name: member.name,
    },
  });
  const handleAssignChange = async (
    row: WorkListData,
    member?: { id: number; name: string },
  ) => {
    if (!member) return;
    try {
      const payload: AssignWorkPayload = {
        data: [buildPayloadItem(row, member)],
      };
      message.success("Member assigned successfully");

      // API call
      await assignWorkToMember(payload);
      // refresh list
      fetchAllWorkList(projectId!);
    } catch (error) {
      message.error("Failed to assign member");
    }
  };

  const rowSelection: TableRowSelection<WorkListData> = {
    selectedRowKeys,
    onChange: (keys: React.Key[], _rows: WorkListData[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const handleBulkAssign = async () => {
    if (!selectedMember || selectedRows.length === 0) return;
    try {
      const payload: AssignWorkPayload = {
        data: selectedRows.map((row) => buildPayloadItem(row, selectedMember)),
      };

      await assignWorkToMember(payload);
      message.success("Work assigned successfully");

      // reset selection
      setSelectedRowKeys([]);

      // refresh list
      fetchAllWorkList(projectId!);
    } catch (error) {
      message.error("Failed to assign work");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Project Name",
      dataIndex: "project_name",
      key: "project_name",
    },
    {
      title: "Project ID",
      dataIndex: "project_id",
      key: "project_id",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
    },
    {
      title: "Tab",
      dataIndex: "tab",
      key: "tab",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "inprogress" ? "orange" : "green"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
    },
    {
      title: "Team",
      dataIndex: "team_id",
      key: "team_id",
      render: (team: Team[] | undefined) =>
        team?.length ? team.map((item) => item.label).join(", ") : "-",
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) =>
        images?.length ? `${images.length} image(s)` : "No images",
    },
    {
      title: "Created Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      key: "created_by",
    },
    {
      title: "Updated Date",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
    },
    {
      title: "Assigned To",
      dataIndex: "assigned_to",
      key: "assigned_to",
      render: (_: unknown, record: WorkListData) => {
        return (
          <Select
            placeholder="Assign Member"
            style={{ width: 180 }}
            value={record.assigned_to?.id}
            onChange={(memberId) => {
              const selectedMember = teamMembersList?.find(
                (m) => m.id === memberId,
              );
              handleAssignChange(record, selectedMember);
            }}
            options={teamMembersList?.map((member) => ({
              label: member.name,
              value: member.id,
            }))}
          />
        );
      },
    },
  ];

  return (
    <Row justify="center" align="middle">
      <Col span={24}>
        <Title level={4} style={{ marginBottom: 20 }}>
          Work List
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          <Select
            placeholder="Select Project"
            style={{ width: 250 }}
            value={projectId}
            onChange={handleProjectChange}
            options={projectOptions}
          />
          <Space>
            {selectedRows.length > 0 && (
              <Tag color="blue">{selectedRows.length} selected</Tag>
            )}
            <Select
              placeholder="Select Team Member"
              style={{ width: 220 }}
              options={teamMembersList?.map((m) => ({
                label: m.name,
                value: m.id,
              }))}
              onChange={(id) => {
                const member = teamMembersList.find((m) => m.id === id);
                setSelectedMember(member || null);
              }}
            />

            <Button
              type="primary"
              onClick={handleBulkAssign}
              loading={loading}
              disabled={!selectedRows.length || !selectedMember}
            >
              Apply
            </Button>
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      </Col>
    </Row>
  );
};

export default WorkList;
