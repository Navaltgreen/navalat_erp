import type { ThemeConfig } from "antd";

export const darkThemeConfig: ThemeConfig = {
  token: {
    borderRadius: 10,
  },
  components: {
    Layout: {
      headerBg: "#262626",
      siderBg: "#262626",
      headerHeight: 52,
    },
    Menu: {
      darkItemBg: "#262626",
      darkSubMenuItemBg: "#262626",
      // dangerItemSelectedBg: "#ecbe13",
      // darkItemSelectedBg: "#ecbe13",
      // darkItemSelectedColor: "#3b3939",
      // darkSubMenuItemBg: "#262626",
    },
  },
};
