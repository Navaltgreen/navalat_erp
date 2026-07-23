import { useEffect, useState } from "react";
import { Button, Card, Form, Input, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  buildDemoAuthSnapshot,
  DEMO_AUTH_EMAIL,
  DEMO_AUTH_PASSWORD,
  isDemoCredentials,
} from "../../config/demoAuth";
import { useAuthStore } from "../../store/auth/store";

const { Title, Text } = Typography;

function Login() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isReady = useAuthStore((state) => state.isReady);
  const user = useAuthStore((state) => state.user);
  const setAuthSnapshot = useAuthStore((state) => state.setAuthSnapshot);
  const setLastAttemptedPath = useAuthStore(
    (state) => state.setLastAttemptedPath,
  );
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) return;

    navigate("/dashboard", { replace: true });
  }, [isReady, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;

    setLastAttemptedPath(null);
  }, [isReady, isAuthenticated, setLastAttemptedPath]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const email = String(values.email ?? "").trim();
    const password = String(values.password ?? "");

    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (!isDemoCredentials(email, password)) {
        throw new Error("Invalid credentials");
      }

      setAuthSnapshot(buildDemoAuthSnapshot(email));
      setLastAttemptedPath(null);
      navigate("/dashboard", { replace: true });
    } catch {
      setLocalError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top, rgba(59, 130, 246, 0.18), transparent 34%), linear-gradient(180deg, #f6f8fb 0%, #edf2ff 100%)",
      }}
      aria-live="polite"
    >
      <Card
        bordered={false}
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 24,
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.16)",
        }}
      >
        <Space direction="vertical" size={20} style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ marginBottom: 8 }}>
              Welcome back
            </Title>
            <Text type="secondary">
              Sign in with the hardcoded demo credentials to open the dashboard.
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              email: DEMO_AUTH_EMAIL,
              password: DEMO_AUTH_PASSWORD,
            }}
            onFinish={() => void handleSubmit()}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Enter the demo email" }]}
            >
              <Input placeholder="admin@navalat.local" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Enter the demo password" }]}
            >
              <Input.Password placeholder="Admin@12345" size="large" />
            </Form.Item>

            {localError ? (
              <Text
                type="danger"
                style={{ display: "block", marginBottom: 12 }}
              >
                {localError}
              </Text>
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={isSubmitting}
            >
              Sign in
            </Button>
          </Form>
        </Space>
      </Card>
    </main>
  );
}

export default Login;
