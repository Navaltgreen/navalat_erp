import { Button, Col, Input, Modal, Result, Row, Typography } from "antd";
import { useState } from "react";
import type {
  Field,
  FormData,
  FormDataPayload,
  FormErrors,
} from "../../../../types/oceanix/onboarding/onboarding_client";
import {
  GlobalOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useClientStore } from "../../../../store/oceanix/onboarding/onboarding_client";
import { useProjectStore } from "../../../../store/oceanix/onboarding/onboarding_project";

const { Text, Title } = Typography;

const fields: Field[] = [
  {
    label: "Full Name",
    name: "name",
    type: "text",
    placeholder: "Enter full name",
    icon: <UserOutlined />,
    rules: [{ required: true, message: "Name is required" }],
  },
  {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "Enter email address",
    icon: <MailOutlined />,
    rules: [
      { required: true, message: "Email is required" },
      { pattern: /^\S+@\S+\.\S+$/, message: "Invalid email" },
    ],
  },
  {
    label: "Phone Number",
    name: "phone_number",
    type: "text",
    placeholder: "Enter phone number",
    icon: <PhoneOutlined />,
    rules: [
      { required: true, message: "Phone number is required" },
      { pattern: /^\d+$/, message: "Only numbers allowed" },
    ],
  },
  {
    label: "Country",
    name: "country",
    type: "text",
    icon: <GlobalOutlined />,
    placeholder: "Enter country",
    rules: [{ required: true, message: "Country is required" }],
  },
  {
    label: "Address",
    name: "address",
    type: "textarea",
    placeholder: "Enter address",
    icon: <HomeOutlined />,
    fullWidth: true,
    rules: [{ required: true, message: "Address is required" }],
  },
];

function OnboardClient() {
  const createClient = useClientStore((s) => s.createClient);
  const fetchAllClient = useProjectStore((s) => s.fetchAllClient);
  const loading = useClientStore((s) => s.loading);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone_number: "",
    country: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof FormDataPayload]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      const key = field.name as keyof FormDataPayload;
      const value = formData[key];
      const rules = field.rules || [];

      rules.forEach((rule) => {
        if (newErrors[key]) return;

        if (rule.required && !value) {
          newErrors[key] = rule.message!;
        } else if (rule.pattern && value && !rule.pattern.test(value)) {
          newErrors[key] = rule.message!;
        }
      });
    });

    setErrors(newErrors);

    const firstError = Object.keys(newErrors)[0];
    if (firstError) {
      const el = document.querySelector(
        `[name="${firstError}"]`,
      ) as HTMLElement;
      el?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload: FormDataPayload = {
        ...formData,
        phone_number: Number(formData.phone_number),
      };
      await createClient(payload);
      await fetchAllClient();
      Modal.success({
        title: "🎉 Client Created Successfully",
        content: (
          <div>
            <p>
              <b>Name:</b> {formData.name}
            </p>
            <p>
              <b>Email:</b> {formData.email}
            </p>
            <p>
              <b>Phone:</b> {formData.phone_number}
            </p>
            <p>
              <b>Country:</b> {formData.country}
            </p>
          </div>
        ),
      });

      setFormData({
        name: "",
        email: "",
        phone_number: "",
        country: "",
        address: "",
      });
    } catch (err) {
      Modal.error({
        title: "Failed to Create Client",
        content: (
          <Result
            status="error"
            title="Client creation failed"
            subTitle="Please check your input or try again later"
          />
        ),
      });
    }
  };

  const renderField = (field: Field) => {
    const value = formData[field.name as keyof FormDataPayload];

    if (field.type === "textarea") {
      return (
        <Input.TextArea
          name={field.name}
          rows={4}
          placeholder={field.placeholder}
          value={value}
          onChange={handleChange}
        />
      );
    }

    return (
      <Input
        name={field.name}
        size="large"
        prefix={field.icon}
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={handleChange}
      />
    );
  };

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        background: "#f4f7fb",
        padding: 20,
      }}
    >
      <Col xs={24} md={16} lg={10}>
        <div
          style={{
            background: "#fff",
            padding: 32,
            borderRadius: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            style={{
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            <Title
              level={3}
              style={{
                marginBottom: 4,
                color: "#1f2937",
              }}
            >
              Client Onboarding
            </Title>

            <Text
              type="secondary"
              style={{
                fontSize: 14,
              }}
            >
              Fill in the client information below
            </Text>
          </div>
          <Row gutter={[16, 16]}>
            {fields.map((field) => (
              <Col key={field.name} span={field.fullWidth ? 24 : 12}>
                <Text strong>{field.label}</Text>
                {renderField(field)}
                {errors[field.name as keyof FormDataPayload] && (
                  <Text type="danger" style={{ fontSize: 12 }}>
                    {errors[field.name as keyof FormDataPayload]}
                  </Text>
                )}
              </Col>
            ))}
          </Row>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              size="large"
              style={{
                marginTop: 20,
                borderRadius: 8,
                padding: "0 24px",
                fontWeight: 600,
                height: 42,
              }}
            >
              Create Client
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default OnboardClient;
