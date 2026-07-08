import {
  Button,
  Col,
  Input,
  Row,
  Typography,
  Select,
  Modal,
  Tag,
  Divider,
  Space,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import {
  UserOutlined,
  ProjectOutlined,
  TeamOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { useProjectStore } from "../../../../store/oceanix/onboarding/onboarding_project";
import type {
  Field,
  ProjectPayload,
  FormErrors,
  ModuleItem,
  TeamOption,
  CreatedProject,
} from "../../../../types/oceanix/onboarding/onboarding_project";

const { Text, Title } = Typography;

const fields: Field[] = [
  {
    label: "Client",
    name: "client_id",
    type: "select",
    placeholder: "Select client",
    icon: <UserOutlined />,
    rules: [{ required: true, message: "Client is required" }],
  },
  {
    label: "Project Name",
    name: "project_name",
    type: "text",
    placeholder: "Enter project name",
    icon: <ProjectOutlined />,
    rules: [{ required: true, message: "Project name is required" }],
  },
  {
    label: "Team",
    name: "team_id",
    type: "select",
    placeholder: "Select team",
    icon: <TeamOutlined />,
    rules: [{ required: true, message: "Team is required" }],
  },
];

function OnboardProject() {
  const {
    clients,
    teams: teamOptions,
    fetchAllClient,
    fetchAllTeams,
    submitProject,
    loading,
  } = useProjectStore();

  const [successData, setSuccessData] = useState<CreatedProject | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchAllClient();
    fetchAllTeams();
  }, []);

  const clientOptions = clients.map((client) => ({
    label: client.name,
    value: String(client.id),
  }));

  const [formData, setFormData] = useState<ProjectPayload>({
    client_id: "",
    project_name: "",
    team_id: [],
    modules: [],
  });

  const [errors, setErrors] = useState<FormErrors & Record<string, string>>({});

  // ---------------- MODULE HANDLERS ----------------
  const addModule = () => {
    setFormData((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          main_tab: "",
          sub_tab: [],
        },
      ],
    }));
  };

  const removeModule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (
    index: number,
    key: keyof ModuleItem,
    value: string | string[],
  ) => {
    setFormData((prev) => {
      const updated = [...prev.modules];
      updated[index] = {
        ...updated[index],
        [key]: value,
      };

      return {
        ...prev,
        modules: updated,
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSingleSelect = (name: "client_id", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleMultiSelect = (name: "team_id", value: string[]) => {
    const selectedObjects = teamOptions
      .filter((t) => value.includes(t.value))
      .map((t) => ({
        label: t.label,
        value: t.value,
      }));
    setFormData((prev) => ({
      ...prev,
      [name]: selectedObjects,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // FIELD VALIDATION
    fields.forEach((field) => {
      const key = field.name;
      const value = formData[key];

      field.rules?.forEach((rule) => {
        if (newErrors[key]) return;

        if (
          rule.required &&
          (value === "" ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0))
        ) {
          newErrors[key] = rule.message || "Required";
        }
      });
    });

    // MODULE VALIDATION
    formData.modules.forEach((mod, index) => {
      if (!mod.main_tab || mod.main_tab.trim() === "") {
        newErrors[`module_${index}_main_tab`] = "Main tab is required";
      }

      if (
        !mod.sub_tab ||
        mod.sub_tab.length === 0 ||
        mod.sub_tab.every((s) => !s.trim())
      ) {
        newErrors[`module_${index}_sub_tab`] = "At least one sub tab required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        tabs: [],
        subcategory: [],
        category: [],
      };
      const res = await submitProject(payload);
      setSuccessData(res?.data);
      setIsSuccessModalOpen(true);
      setFormData({
        client_id: "",
        project_name: "",
        team_id: [],
        modules: [],
      });
      setErrors({});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(message);
      setIsErrorModalOpen(true);
    }
  };

  // ---------------- RENDER FIELD ----------------
  const renderField = (field: Field) => {
    if (field.name === "client_id") {
      return (
        <Select
          size="large"
          placeholder={field.placeholder}
          value={formData.client_id || undefined}
          options={clientOptions}
          loading={loading}
          style={{ width: "100%" }}
          onChange={(val) => handleSingleSelect("client_id", val)}
        />
      );
    }

    if (field.name === "team_id") {
      return (
        <Select
          mode="multiple"
          size="large"
          placeholder={field.placeholder}
          value={formData.team_id.map((t) => t.value)}
          options={teamOptions}
          loading={loading}
          style={{ width: "100%" }}
          onChange={(val) => handleMultiSelect("team_id", val)}
        />
      );
    }

    return (
      <Input
        name={field.name}
        size="large"
        prefix={field.icon}
        placeholder={field.placeholder}
        value={formData.project_name}
        onChange={handleChange}
        style={{ borderRadius: 8, height: 42 }}
      />
    );
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{ background: "#f4f7fb", padding: 20 }}
    >
      <Col xs={24} sm={22} md={18} lg={10}>
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Title level={3}>Project Onboarding</Title>
            <Text type="secondary">Fill the project details below</Text>
          </div>

          {/* FIELDS */}
          <Row gutter={[18, 18]}>
            {fields.map((field) => (
              <Col key={field.name} xs={24}>
                <Text strong>{field.label}</Text>

                {renderField(field)}

                {errors[field.name] && (
                  <Text type="danger">{errors[field.name]}</Text>
                )}
              </Col>
            ))}

            {/* MODULES */}
            <Col xs={24}>
              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  border: "1px solid #eee",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text strong>Modules</Text>

                  <Button type="dashed" onClick={addModule}>
                    + Add Module
                  </Button>
                </div>

                <div
                  style={{
                    maxHeight: 260,
                    overflowY: "auto",
                    marginTop: 12,
                  }}
                >
                  {formData.modules.map((module, index) => (
                    <div
                      key={index}
                      style={{
                        padding: 12,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    >
                      {/* HEADER */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text>Module {index + 1}</Text>

                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => removeModule(index)}
                        />
                      </div>

                      {/* MAIN TAB */}
                      <Input
                        placeholder="Main Tab"
                        value={module.main_tab}
                        onChange={(e) =>
                          updateModule(index, "main_tab", e.target.value)
                        }
                        style={{ marginTop: 8 }}
                      />

                      {errors[`module_${index}_main_tab`] && (
                        <Text type="danger">
                          {errors[`module_${index}_main_tab`]}
                        </Text>
                      )}

                      {/* SUB TAB */}
                      <Input
                        placeholder="Sub Tabs (comma separated)"
                        value={module.sub_tab.join(",")}
                        onChange={(e) =>
                          updateModule(
                            index,
                            "sub_tab",
                            e.target.value.split(",").map((s) => s.trim()),
                          )
                        }
                        style={{ marginTop: 8 }}
                      />

                      {errors[`module_${index}_sub_tab`] && (
                        <Text type="danger">
                          {errors[`module_${index}_sub_tab`]}
                        </Text>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* SUBMIT */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 28,
            }}
          >
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                padding: "0 28px",
              }}
            >
              Submit Project
            </Button>
          </div>
        </div>
      </Col>
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => setIsSuccessModalOpen(false)}
          >
            Done
          </Button>,
        ]}
        centered
        width={520}
      >
        {successData && (
          <div style={{ textAlign: "center" }}>
            {/* ICON */}
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              style={{ fontSize: 56 }}
            />

            {/* TITLE */}
            <Title level={4} style={{ marginTop: 12 }}>
              Project Created Successfully
            </Title>

            <Text type="secondary">
              Your project has been saved and is now available.
            </Text>

            <Divider />

            {/* DETAILS */}
            <div style={{ textAlign: "left" }}>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                <Text>
                  <b>Project Name:</b> {successData.name}
                </Text>

                <Text>
                  <b>Client:</b> {successData.client?.name || "N/A"}
                </Text>

                <Text>
                  <b>Teams:</b>{" "}
                  {successData.team_id?.length ? (
                    successData.team_id.map((t: TeamOption) => (
                      <Tag color="blue" key={t.value}>
                        {t.label}
                      </Tag>
                    ))
                  ) : (
                    <Tag>No Teams</Tag>
                  )}
                </Text>

                <Text>
                  <b>Created At:</b>{" "}
                  {new Date(successData.created_at).toLocaleString()}
                </Text>
              </Space>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={isErrorModalOpen}
        onCancel={() => setIsErrorModalOpen(false)}
        footer={[
          <Button key="close" danger onClick={() => setIsErrorModalOpen(false)}>
            Try Again
          </Button>,
        ]}
        centered
        width={500}
      >
        <div style={{ textAlign: "center" }}>
          {/* ICON */}
          <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 56 }} />

          {/* TITLE */}
          <Typography.Title level={4} style={{ marginTop: 12 }}>
            Project Creation Failed
          </Typography.Title>

          <Typography.Text type="secondary">
            Something went wrong while creating the project
          </Typography.Text>

          <div style={{ marginTop: 16, textAlign: "left" }}>
            <Alert
              type="error"
              showIcon
              message="Error Details"
              description={errorMessage || "Unexpected error occurred"}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <Space direction="vertical" size={4}>
              <Typography.Text type="secondary">
                • Check required fields
              </Typography.Text>
              <Typography.Text type="secondary">
                • Ensure API is working
              </Typography.Text>
              <Typography.Text type="secondary">
                • Try again after a few seconds
              </Typography.Text>
            </Space>
          </div>
        </div>
      </Modal>
    </Row>
  );
}

export default OnboardProject;
