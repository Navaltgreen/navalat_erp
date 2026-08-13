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
  Segmented,
} from "antd";  
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import type { TableRowSelection } from "antd/es/table/interface";
import { KanbanBoard } from "../WorkKanban";
import { useWorkAddStore } from "../../../../store/oceanix/works/work_add";
import { useDeveloperWorkListStore } from "../../../../store/oceanix/works/developer_work_list";
import type { WorkAssignment } from "../../../../types/oceanix/works/developer_work_list";
import type {
  KanbanWork,
  WorkStatus,
} from "../../../../types/oceanix/works/work_kanban";

const { Title } = Typography;

const DeveloperWorkList = () => {
  const [view, setView] = useState<"list" | "kanban">("list");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // const [selectedStatus, setSelectedStatus] = useState<
  //   WorkAssignment["status"] | null
  // >(null);

  const fetchAllProjects = useWorkAddStore((s) => s.fetchAllProjects);
  const projects = useWorkAddStore((s) => s.projects);
  const fetchTeamsWorkList = useDeveloperWorkListStore(
    (s) => s.fetchTeamsWorkList,
  );
  const updateWorkStatus = useDeveloperWorkListStore((s) => s.updateWorkStatus);
  const updateAssignmentStatus = useDeveloperWorkListStore(
    (s) => s.updateAssignmentStatus,
  );
  const workListData = useDeveloperWorkListStore((s) => s.workList);

  const selectedRows = workListData?.filter((row) =>
    selectedRowKeys.includes(row.id),
  );

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const [projectId, setProjectId] = useState<number | null>(null);
  const [selectedBulkStatus, setSelectedBulkStatus] = useState<
    WorkAssignment["status"] | null
  >(null);

  const rowSelection: TableRowSelection<WorkAssignment> = {
    selectedRowKeys,
    onChange: (keys: React.Key[], _rows: WorkAssignment[]) => {
      setSelectedRowKeys(keys);
    },
  };
  const projectOptions = projects?.map((p) => ({
    label: p.name,
    value: p.id,
  }));

  const workStatus = [
    {
      label: "not-started",
      value: "not-started",
    },
    {
      label: "In Progress",
      value: "inprogress",
    },
    {
      label: "Fixed",
      value: "fixed",
    },
  ];

  const kanbanWorks: KanbanWork[] = (workListData ?? []).map((item) => ({
    id: item.work_id ?? item.id,
    project_id: item.project_id,
    project_name: item.project_name,
    category: item.category,
    subcategory: item.subcategory,
    tab: item.tab,
    status: (item.status === "inprogress"
      ? "not-started"
      : item.status) as WorkStatus,
    priority: "medium",
    description: item.description,
    comments: item.comments,
    images: [],
    created_at: item.created_at,
    created_by: null,
    updated_at: item.updated_at,
    updated_by: null,
    assigned_to: { id: 0, name: item.team_member ?? "" },
  }));

  const handleProjectChange = (value: number) => {
    setProjectId(value);
    // fetch projects based on project selection
    fetchTeamsWorkList({
      project_id: value,
      role_id: 1,
    });
  };

  const refetchWorkList = () => {
    if (projectId) {
      fetchTeamsWorkList({
        project_id: projectId,
        role_id: 1,
      });
    }
  };
  const buildPayloadItem = (
    row: WorkAssignment,
    status: WorkAssignment["status"],
  ) => ({
    work_id: row.id,

    project_id: row.project_id,
    project_name: row.project_name,

    category: row.category,
    subcategory: row.subcategory,
    tab: row.tab,

    status,

    description: row.description,
    comments: row.comments,

    created_at: row.created_at,
    created_by: row.created_by,

    updated_at: row.updated_at,
    updated_by: row.updated_by,
  });

  const handleStatusChange = async (
    record: WorkAssignment,
    value: WorkAssignment["status"],
  ) => {
    updateWorkStatus(record.id, value);
    try {
      const payload = {
        data: [buildPayloadItem(record, value)],
      };
      // console.log("payload: ", payload);

      await updateAssignmentStatus(payload);

      message.success(`Status updated to ${value}`);
      // REFRESH TABLE FROM SERVER
      refetchWorkList();
    } catch (error) {
      message.error("Failed to update status");
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
      render: (team: { label: string; value: string }[]) =>
        team?.map((t) => t.label).join(", "),
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
      title: "Update Status",
      dataIndex: "status",
      key: "update_status",
      render: (status: WorkAssignment["status"], record: WorkAssignment) => (
        <Select
          style={{ width: 160 }}
          value={status}
          options={workStatus}
          onChange={(value: WorkAssignment["status"]) =>
            handleStatusChange(record, value)
          }
        />
      ),
    },
  ];

  // const handleAllStatusUpdate = async () => {
  //   try {
  //     if (!selectedStatus) {
  //       message.warning("Please select a status");
  //       return;
  //     }

  //     if (!selectedRowKeys.length) {
  //       message.warning("Please select at least one row");
  //       return;
  //     }

  //     const selectedRows = workListData.filter((row) =>
  //       selectedRowKeys.includes(row.id),
  //     );

  //     const payload = {
  //       data: selectedRows.map((row) => buildPayloadItem(row, selectedStatus)),
  //     };
  //     // console.log("payload: ", payload);

  //     await updateAssignmentStatus(payload);

  //     message.success("Status updated successfully");

  //     setSelectedRowKeys([]);
  //     setSelectedStatus(null);
  //     // REFRESH TABLE
  //     refetchWorkList();
  //   } catch (error) {
  //     message.error("Failed to update status");
  //     console.error("Bulk update error:", error);
  //   }
  // };

  return (
    <Row justify="center" align="middle">
      <Col span={24}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Developer Work List
          </Title>
          <Segmented
            value={view}
            onChange={(val) => setView(val as "list" | "kanban")}
            options={[
              { value: "list", icon: <BarsOutlined />, label: "Table" },
              { value: "kanban", icon: <AppstoreOutlined />, label: "Kanban" },
            ]}
          />
          {/* <Space>
            <Tooltip title="List View">
              <Button
                type={view === "list" ? "primary" : "default"}
                icon={<BarsOutlined />}
                onClick={() => setView("list")}
              />
            </Tooltip>
            <Tooltip title="Kanban View">
              <Button
                type={view === "kanban" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setView("kanban")}
              />
            </Tooltip>
          </Space> */}
        </div>
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
              placeholder="Select Status"
              style={{ width: 220 }}
              options={workStatus}
              value={selectedBulkStatus}
              onChange={setSelectedBulkStatus}
            />

            <Button
              type="primary"
              // onClick={handleBulkStatusUpdate}
              // loading={loading}
              // disabled={!selectedRows.length}
            >
              Apply Status
            </Button>
          </Space>
        </div>

        {view === "list" ? (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={workListData}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: 1000 }}
          />
        ) : (
          <KanbanBoard initialWorks={kanbanWorks} />
        )}
      </Col>
    </Row>
  );
};

export default DeveloperWorkList;
