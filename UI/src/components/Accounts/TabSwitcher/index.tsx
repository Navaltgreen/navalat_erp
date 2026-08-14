type TabKey = "milestones" | "payment-history";
const TabSwitcher = ({
  activeTab,
  onChange,
}: {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: "milestones", label: "Milestones" },
    { key: "payment-history", label: "Payment history" },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        background: "#F1F0EC",
        padding: 4,
        borderRadius: 10,
        gap: 4,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          style={{
            padding: "8px 18px",
            fontSize: 14,
            fontWeight: 500,
            border: "none",
            borderRadius: 7,
            cursor: "pointer",
            background: activeTab === tab.key ? "#FFFFFF" : "transparent",
            color: activeTab === tab.key ? "#1A1A1A" : "#6B6B68",
            boxShadow:
              activeTab === tab.key ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.15s ease",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
