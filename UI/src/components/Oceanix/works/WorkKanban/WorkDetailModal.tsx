import { Modal, Avatar } from "antd";
import {
  BugOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
  AppstoreOutlined,
  TagOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type {
  KanbanWork,
  Priority,
  WorkStatus,
} from "../../../../types/oceanix/works/work_kanban";


const PRIORITY_CONFIG: Record<
  Priority,
  { color: string; bg: string; label: string }
> = {
  critical: { color: "#e53e3e", bg: "#fff5f5", label: "Critical" },
  high: { color: "#dd6b20", bg: "#fffaf0", label: "High" },
  medium: { color: "#b7791f", bg: "#fffff0", label: "Medium" },
  low: { color: "#2f855a", bg: "#f0fff4", label: "Low" },
};

const STATUS_CONFIG: Record<
  WorkStatus,
  { color: string; bg: string; label: string }
> = {
  "not-started": { color: "#e07272", bg: "#fff0f0", label: "Not Started" },
  inprogress: { color: "#c9913a", bg: "#fffbf0", label: "In Progress" },
  fixed: { color: "#4ea87a", bg: "#f0faf5", label: "Fixed" },
};

const AVATAR_COLORS = [
  "#7b9ee0",
  "#a07be0",
  "#e07272",
  "#c9913a",
  "#4ea87a",
  "#e07db0",
  "#50b8c9",
  "#e08c5a",
];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function MetaChip({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <div
      className="meta-chip"
      style={{ background: bg ?? "#f8f9fc", border: "1px solid #eaecf2" }}
    >
      <div className="meta-chip-header">
        {icon}
        <span>{label}</span>
      </div>
      <div className="meta-chip-value" style={{ color: color ?? "#374151" }}>
        {value}
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-section">
      <div className="section-title">
        <span className="section-icon">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

interface WorkDetailModalProps {
  work: KanbanWork | null;
  open: boolean;
  onClose: () => void;
}

export function WorkDetailModal({ work, open, onClose }: WorkDetailModalProps) {
  if (!work) return null;

  const p = PRIORITY_CONFIG[work.priority];
  const s = STATUS_CONFIG[work.status];
  const createdDate = dayjs(work.created_at).format("MMM DD, YYYY");

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      centered
      title={null}
      style={{ padding: 0, borderRadius: 16, overflow: "hidden" }}
      styles={{
        body: { padding: 0 },
        mask: { backdropFilter: "blur(4px)", background: "rgba(0,0,0,0.3)" },
      }}
    >
      {/* Modal Header */}
      <div
        className="modal-header"
        style={{
          background: "linear-gradient(135deg, #667eea18 0%, #764ba218 100%)",
          borderBottom: "1px solid #eaecf2",
        }}
      >
        <div
          className="modal-header-icon"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <BugOutlined className="white-icon" />
        </div>
        <div className="modal-header-content">
          <div className="badge-row">
            <span
              className="work-id-badge"
              style={{ background: "#f0f2f7", color: "#8892aa" }}
            >
              #{work.id}
            </span>
            <span
              className="status-badge"
              style={{ color: p.color, background: p.bg }}
            >
              {p.label}
            </span>
            <span
              className="status-badge"
              style={{ color: s.color, background: s.bg }}
            >
              {s.label}
            </span>
          </div>
          <div className="modal-title">{work.project_name}</div>
          <div className="modal-subtitle">
            {work.category}
            {work.subcategory ? ` · ${work.subcategory}` : ""}
            {work.tab ? ` · ${work.tab}` : ""}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="modal-body" style={{ background: "#fff" }}>
        {/* Meta grid */}
        <div className="meta-grid">
          <MetaChip
            icon={<CalendarOutlined />}
            label="Created Date"
            value={createdDate}
          />
          <MetaChip
            icon={<UserOutlined />}
            label="Assigned To"
            value={
              <div className="assigned-user">
                <Avatar
                  size={16}
                  style={{
                    background: getAvatarColor(work.assigned_to.id),
                    fontSize: 9,
                    fontWeight: 700,
                  }}
                >
                  {work.assigned_to.name[0]}
                </Avatar>
                {work.assigned_to.name}
              </div>
            }
          />
          <MetaChip
            icon={<AppstoreOutlined />}
            label="Category"
            value={`${work.category}${work.subcategory ? ` / ${work.subcategory}` : ""}`}
          />
          <MetaChip
            icon={<TagOutlined />}
            label="Project ID"
            value={`#${work.project_id}`}
          />
        </div>

        {/* Description */}
        {work.description && (
          <Section icon={<FileTextOutlined />} title="Description">
            <p
              className="section-content"
              style={{ background: "#f8f9fc", border: "1px solid #eaecf2" }}
            >
              {work.description}
            </p>
          </Section>
        )}

        {/* Comments */}
        {work.comments && (
          <Section icon={<CommentOutlined />} title="Comments">
            <p
              className="section-coment"
              style={{ background: "#f8f9fc", border: "1px solid #eaecf2" }}
            >
              {work.comments}
            </p>
          </Section>
        )}
      </div>
    </Modal>
  );
}
