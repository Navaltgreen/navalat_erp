import { ConfigProvider, theme as antdTheme } from "antd";
import type { PropsWithChildren } from "react";
import { useThemeStore } from "../store/theme";
import { darkThemeConfig } from "./dark/tokens";
import { lightThemeConfig } from "./light/tokens";

function AppThemeProvider({ children }: PropsWithChildren) {
  const mode = useThemeStore((state) => state.mode);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          mode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        ...(mode === "dark" ? darkThemeConfig : lightThemeConfig),
      }}
    >
      <div className={`app-theme app-theme--${mode}`}>{children}</div>
    </ConfigProvider>
  );
}

export default AppThemeProvider;
