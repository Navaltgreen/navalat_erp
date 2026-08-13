import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Select,
  Upload,
  Button,
  Card,
  Input,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useWorkAddStore } from "../../../../store/oceanix/works/work_add";
import type {
  ErrorsType,
  FieldConfig,
  FormDataType,
  OptionType,
  TabType,
} from "../../../../types/oceanix/works/work_add";
import { createWork } from "../../../../services/oceanix/works/work_add";

const { Title, Text } = Typography;

const WorkAdd: React.FC = () => {
  const fetchAllProjects = useWorkAddStore((s) => s.fetchAllProjects);
  const projects = useWorkAddStore((s) => s.projects);
  const [formData, setFormData] = useState<FormDataType>({
    status: "inprogress",
    images: [],
  });
  const [errors, setErrors] = useState<ErrorsType>({});
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {
    fetchAllProjects();
    /* fetchAllTeams() */
  }, []);

  const selectedProjectData = projects?.find(
    (p) => String(p.id) === selectedProject,
  );

  const filteredTeamList: OptionType[] = Array.isArray(
    selectedProjectData?.team_id,
  )
    ? selectedProjectData.team_id.map((item) => {
        return {
          label: item.label,
          value: item.value,
        };
      })
    : [];

  const tabOptions =
    selectedProjectData?.tab?.map((t: TabType) => {
      return {
        label: t.main_tab,
        value: t.main_tab,
      };
    }) || [];

  const subtabOptions =
    selectedProjectData?.tab
      ?.find((t: TabType) => t.main_tab === formData.tab)
      ?.sub_tab?.map((s: string) => ({
        label: s,
        value: s,
      })) || [];

  const handleProjectChange = (value: string) => {
    setSelectedProject(value);

    setFormData((prev) => ({
      ...prev,
      project: value,
      tab: "",
      subtab: "",
    }));
    setErrors((prev) => ({
      ...prev,
      project: undefined,
    }));
  };
  const projectOptions = projects.map((p) => ({
    label: p.name,
    value: String(p.id),
  }));

  const fields: FieldConfig[] = [
    {
      name: "project",
      label: "Project",
      type: "select",
      span: 24,
      placeholder: "Select Project",
      required: true,
      options: projectOptions,
      validationMessage: "Project is required",
    },
    {
      name: "tab",
      label: "Tab",
      type: "select",
      span: 12,
      placeholder: "Select Tab",
      required: true,
      options: tabOptions,
      validationMessage: "Tab is required",
    },
    {
      name: "subtab",
      label: "Subtab",
      type: "select",
      span: 12,
      placeholder: "Select Subtab",
      required: true,
      options: subtabOptions,
      validationMessage: "Subtab is required",
    },
    {
      label: "Team",
      name: "team_id",
      type: "select",
      span: 24,
      placeholder: "Select team",
      required: true,
      options: filteredTeamList,
      validationMessage: "Subtab is required",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      span: 24,
      required: true,
      validationMessage: "Status is required",
      options: [
        { label: "In Progress", value: "inprogress" },
        // { label: "Completed", value: "completed" },
      ],
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      span: 24,
      placeholder: "Enter description",
      required: true,
      validationMessage: "Description is required",
    },
    {
      name: "comment",
      label: "Comment",
      type: "textarea",
      span: 24,
      placeholder: "Enter comment",
      required: false,
    },
    {
      name: "images",
      label: "Upload Images",
      type: "upload",
      span: 24,
      required: false,
      validationMessage: "Please upload at least one image",
    },
  ];

  const handleChange = (
    field: keyof FormDataType,
    value: string | UploadFile[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = () => {
    const newErrors: ErrorsType = {};

    fields.forEach((field) => {
      if (!field.required) return;

      const value = formData[field.name];

      const isEmpty = Array.isArray(value) ? value.length === 0 : !value;

      if (isEmpty) {
        newErrors[field.name] = field.validationMessage || "Required";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        project_id: formData.project ?? "",
        category: formData.tab ?? "",
        subcategory: formData.subtab ?? "",
        status: formData.status ?? "",
        description: formData.description ?? "",
        comments: formData.comment ?? "",
        team_id: formData.team_id || [],
        images: formData.images.map((file) => file.originFileObj as File),
        tab: "",
      };
      await createWork(payload);

      Modal.success({
        title: "Success",
        content: "Work has been created successfully.",
        okText: "OK",
      });
      //  Clear form after success
      setFormData({
        project: undefined,
        tab: undefined,
        subtab: undefined,
        status: "inprogress",
        description: "",
        comment: "",
        team_id: [],
        images: [],
      });

      //  Reset project selection
      setSelectedProject("");

      // Clear  errors
      setErrors({});
    } catch (error) {
      Modal.error({
        title: "Error",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating work.",
        okText: "Close",
      });
    }
  };

  const renderField = (field: FieldConfig) => {
    switch (field.type) {
      case "select":
        return (
          <>
            <Select
              style={{
                width: "100%",
                marginTop: 6,
              }}
              placeholder={field.placeholder}
              value={
                field.type === "select"
                  ? (formData[field.name] as string | undefined)
                  : undefined
              }
              onChange={(value: string) => {
                if (field.name === "project") {
                  handleProjectChange(value);
                } else if (field.name === "tab") {
                  setFormData((prev) => ({
                    ...prev,
                    tab: value,
                    subtab: "",
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    [field.name]: undefined,
                  }));
                } else {
                  handleChange(field.name, value);
                }
              }}
              mode={field.name === "team_id" ? "multiple" : undefined}
              labelInValue={field.name === "team_id"}
              status={errors[field.name] ? "error" : undefined}
              options={field.options}
            />

            {errors[field.name] && (
              <Text
                type="danger"
                style={{
                  fontSize: 12,
                }}
              >
                {errors[field.name]}
              </Text>
            )}
          </>
        );

      case "upload":
        return (
          <>
            <Upload
              multiple
              accept="image/*"
              beforeUpload={() => false}
              fileList={formData.images}
              onChange={({ fileList }) => handleChange("images", fileList)}
            >
              <Button
                icon={<UploadOutlined />}
                style={{
                  marginTop: 8,
                }}
              >
                Upload Images
              </Button>
            </Upload>

            {errors.images && (
              <Text
                type="danger"
                style={{
                  fontSize: 12,
                }}
              >
                {errors.images}
              </Text>
            )}
          </>
        );
      case "textarea":
        return (
          <>
            <Input.TextArea
              rows={4}
              placeholder={field.placeholder}
              value={formData[field.name] as string}
              onChange={(e) => handleChange(field.name, e.target.value)}
              status={errors[field.name] ? "error" : undefined}
              style={{
                marginTop: 6,
              }}
            />

            {errors[field.name] && (
              <Text
                type="danger"
                style={{
                  fontSize: 12,
                }}
              >
                {errors[field.name]}
              </Text>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Row justify="center" align="middle">
      <Col xs={24} md={18} lg={10}>
        <Card
          style={{
            padding: 32,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            <Title level={3}>Add New Works</Title>
          </div>

          {/*  Form */}
          <Row gutter={[16, 20]}>
            {fields.map((field) => (
              <Col key={field.name} span={field.span}>
                <Text strong>{field.label}</Text>
                {renderField(field)}
              </Col>
            ))}

            {/* Submit */}
            <Col span={24}>
              <Button
                type="primary"
                block
                size="large"
                onClick={handleSubmit}
                style={{
                  height: 45,
                  borderRadius: 10,
                  marginTop: 10,
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default WorkAdd;
