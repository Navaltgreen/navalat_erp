import type { ThemeConfig } from "antd";

export const lightThemeConfig: ThemeConfig = {
  token: {
    borderRadius: 10,
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
      bodyBg: "#f5f5f5",
      headerHeight: 52,
    },
    Menu: {
      activeBarBorderWidth: 0,
    },
  },
};
