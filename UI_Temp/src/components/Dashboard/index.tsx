import {
  Alert,
  Avatar,
  Card,
  Col,
  Empty,
  List,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { useDashboardTeamMembersQuery } from "../../query/dashboard/team-members.query";

const { Title, Text } = Typography;

function Dashboard() {
  const { data: teams, loading, error } = useDashboardTeamMembersQuery();

  if (error) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unable to load department employee details"
        description="Please try again in a moment."
      />
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Department Employees
        </Title>
        <Text type="secondary">
          Team-wise employee directory with member count and details.
        </Text>
      </div>

      {loading ? (
        <Row gutter={[8, 8]}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 20,
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
                  height: 380,
                }}
              >
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : teams.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 20 }}>
          <Empty description="No department data found" />
        </Card>
      ) : (
        <Row gutter={[12, 12]}>
          {teams.map((team) => (
            <Col key={team.teamId} xs={24} sm={12} lg={8}>
              <Card
                hoverable
                // bordered={false}
                style={{
                  borderRadius: 20,
                  // background: cardBackgrounds[index % cardBackgrounds.length],
                  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
                  height: 380,
                }}
                title={
                  <Space size={8} align="center">
                    <Avatar
                      size={34}
                      icon={<TeamOutlined />}
                      style={{ backgroundColor: "#0f172a" }}
                    />
                    <div>
                      <Text strong style={{ fontSize: 16, display: "block" }}>
                        {team.teamName}
                      </Text>
                      {/* <Text type="secondary">ID: {team.teamId}</Text> */}
                    </div>
                  </Space>
                }
                extra={<Tag color="blue">{team.members.length} Members</Tag>}
              >
                <div
                  style={{
                    maxHeight: 220,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  <List
                    dataSource={team.members}
                    locale={{ emptyText: "No members" }}
                    renderItem={(member) => (
                      <List.Item style={{ paddingInline: 0 }}>
                        <Space>
                          <Avatar icon={<UserOutlined />} />
                          <Text>{member.name}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Space>
  );
}

export default Dashboard;
