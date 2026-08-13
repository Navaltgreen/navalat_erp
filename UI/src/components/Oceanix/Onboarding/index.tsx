import { Tabs } from "antd";
import type { TabsProps } from "antd";
import OnboardClient from "./OnboardClient";
import OnboardProject from "./OnboardProject";
import {
  useOnboardingTabStore,
  type OnboardingTab,
} from "../../../store/oceanix/onboarding";

const items: TabsProps["items"] = [
  { key: "client", label: "Client", children: <OnboardClient /> },
  { key: "project", label: "Project", children: <OnboardProject /> },
];

function Onboarding() {
  const activeTab = useOnboardingTabStore((s) => s.activeTab);
  const setActiveTab = useOnboardingTabStore((s) => s.setActiveTab);

  return (
    <Tabs
      activeKey={activeTab}
      items={items}
      onChange={(key) => setActiveTab(key as OnboardingTab)}
    />
  );
}

export default Onboarding;
