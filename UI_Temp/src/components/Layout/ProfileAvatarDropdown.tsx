import {
  Avatar,
  Dropdown,
  Space,
  Switch,
  Typography,
  type MenuProps,
} from "antd";
import { useNavigate } from "react-router-dom";
import { LogOut, UserRound, KeyRound, Palette } from "lucide-react";
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
  const navigate = useNavigate();

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
    navigate("/login", { replace: true });
  };

  const menuItemsUpdated: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Text strong className="profile-dropdown__name">
          {displayName}
        </Text>
      ),
      disabled: false,
      icon: <UserRound size={14} />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <Text>Role</Text>,
      disabled: false,
      icon: <KeyRound size={14} />,

      extra: <>{roleText}</>,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: <Text>Theme</Text>,
      icon: <Palette size={14} />,
      disabled: false,
      extra: (
        <Switch
          size="small"
          checked={mode === "dark"}
          onChange={(checked) => setMode(checked ? "dark" : "light")}
          aria-label="Theme mode"
        />
      ),
    },
    {
      type: "divider",
    },
    {
      key: "4",
      icon: <LogOut size={14} />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItemsUpdated }}
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
