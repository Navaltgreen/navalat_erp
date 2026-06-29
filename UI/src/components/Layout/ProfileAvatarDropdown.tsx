import {
  Avatar,
  Dropdown,
  Space,
  Switch,
  Typography,
  type MenuProps,
} from "antd";
import { LogOut, Moon, Sun, UserRound } from "lucide-react";
import { logoutFromKeycloak } from "../../config/keycloak";
import { useAuthStore } from "../../store/auth/store";
import { useThemeStore } from "../../store/theme";

const { Text } = Typography;

function ProfileAvatarDropdown() {
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLastAttemptedPath = useAuthStore(
    (state) => state.setLastAttemptedPath,
  );
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  const displayName = user?.displayName || user?.username || "User";
  const roleText = roles.length > 0 ? roles.join(", ") : "No role";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U";

  const handleLogout = async () => {
    setLastAttemptedPath(null);
    clearAuth();
    await logoutFromKeycloak("/login");
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "user-info",
      disabled: true,
      label: (
        <div className="profile-dropdown__user">
          <Avatar size={42} icon={<UserRound size={18} />}>
            {initials}
          </Avatar>
          <div className="profile-dropdown__meta">
            <Text strong className="profile-dropdown__name">
              {displayName}
            </Text>

            <Text type="secondary" className="profile-dropdown__role">
              Role: {roleText}
            </Text>
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "theme",
      label: (
        <div
          className="profile-dropdown__theme-row"
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            <Text className="profile-dropdown__theme-title">Appearance</Text>
            <div className="profile-dropdown__theme-value">
              <Space size={8}>
                {mode === "dark" ? <Moon size={14} /> : <Sun size={14} />}
                <span>{mode === "dark" ? "Dark" : "Light"} mode</span>
              </Space>
            </div>
          </div>
          <Switch
            size="small"
            checked={mode === "dark"}
            onChange={(checked) => setMode(checked ? "dark" : "light")}
            aria-label="Theme mode"
          />
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={14} />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
    >
      <Space size={10}>
        <Avatar size={34} icon={<UserRound size={16} />}>
          {initials}
        </Avatar>
      </Space>
    </Dropdown>
  );
}

export default ProfileAvatarDropdown;
