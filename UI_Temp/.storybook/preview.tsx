import { useEffect, type PropsWithChildren } from "react";
import type { Preview } from "@storybook/react-vite";
import AppThemeProvider from "../src/theme/AppThemeProvider";
import { useThemeStore } from "../src/store/theme";
import type { ThemeMode } from "../src/store/theme";

type ThemeBridgeProps = PropsWithChildren<{
  mode: ThemeMode;
}>;

function ThemeBridge({ mode, children }: ThemeBridgeProps) {
  const setMode = useThemeStore((state) => state.setMode);

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  return <AppThemeProvider>{children}</AppThemeProvider>;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for all stories",
      defaultValue: "light",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => (
      <ThemeBridge mode={context.globals.theme as ThemeMode}>
        <Story />
      </ThemeBridge>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
