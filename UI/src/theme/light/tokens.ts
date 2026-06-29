import type { ThemeConfig } from "antd";

export const lightThemeConfig: ThemeConfig = {
  token: {
    borderRadius: 10,
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
    },
    Menu: {
      activeBarBorderWidth: 0,
      
    },
  },
};
