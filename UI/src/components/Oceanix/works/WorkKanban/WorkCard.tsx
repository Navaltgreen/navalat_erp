import { useRef } from "react";
import { Avatar, Tooltip } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useDrag } from "react-dnd";
import dayjs from "dayjs";
import type {
  KanbanWork,
  Priority,
  WorkStatus,
} from "../../../../types/oceanix/works/work_kanban";

export const DRAG_TYPE = "WORK_CARD";

const PRIORITY_CONFIG: Record<
  Priority,
  { color: string; bg: string; label: string }
> = {
  critical: { color: "#e53e3e", bg: "#fff5f5", label: "Critical" },
  high: { color: "#dd6b20", bg: "#fffaf0", label: "High" },
  medium: { color: "#b7791f", bg: "#fffff0", label: "Medium" },
  low: { color: "#2f855a", bg: "#f0fff4", label: "Low" },
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

interface WorkCardProps {
  work: KanbanWork;
  onViewDetails: (work: KanbanWork) => void;
}

export function WorkCard({ work, onViewDetails }: WorkCardProps) {
  const p = PRIORITY_CONFIG[work.priority];
  const createdDate = dayjs(work.created_at).format("MMM DD, YYYY");

  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DRAG_TYPE,
    item: { workId: work.id, currentStatus: work.status as WorkStatus },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  dragPreview(dragRef);

  const assigneeName = work.assigned_to.name;
  const assigneeId = work.assigned_to.id;

  return (
    <div
      ref={dragRef}
      style={{
        opacity: isDragging ? 0.35 : 1,
        transform: isDragging ? "scale(0.98)" : "scale(1)",
        transition: "opacity 0.15s, transform 0.15s",
      }}
    >
      <div
        className="work-card"
        style={{
          background: "#ffffff",
          border: "1px solid #eaecf2",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.15s, border-color 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 16px rgba(0,0,0,0.10)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#d0d5e8";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 1px 3px rgba(0,0,0,0.05)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#eaecf2";
        }}
      >
        {/* Top row: drag handle + ID + priority */}
        <div className="card-row">
          <div className="card-row-left">
            <div
              ref={drag as unknown as React.Ref<HTMLDivElement>}
              className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors"
            >
              <HolderOutlined />
            </div>
            <span
              className="work-id"
              style={{ background: "#f0f2f7", color: "#8892aa" }}
            >
              #{work.id}
            </span>
          </div>

          <span
            className="priority-badge"
            style={{ color: p.color, background: p.bg }}
          >
            {p.label}
          </span>
        </div>

        {/* Project + category */}
        <div>
          <div className="project-name">{work.project_name}</div>
          <div className="project-category">
            {work.category}
            {work.subcategory ? ` · ${work.subcategory}` : ""}
            {work.tab ? ` · ${work.tab}` : ""}
          </div>
        </div>

        {/* Divider */}
        <div className="card-divider" />

        {/* Bottom row: date + assignee */}
        <div className="card-row">
          <div className="date-info">
            <CalendarOutlined />
            <span>{createdDate}</span>
          </div>

          <Tooltip title={`Assigned to ${assigneeName}`}>
            <div className="assignee-info">
              <Avatar
                size={22}
                style={{
                  background: getAvatarColor(assigneeId),
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {assigneeName[0]}
              </Avatar>
              <span className="assignee-name">{assigneeName}</span>
            </div>
          </Tooltip>
        </div>

        {/* View Details */}
        <button
          onClick={() => onViewDetails(work)}
          className="view-details-btn"
          style={{
            background: "#f0f2f7",
            color: "#5a6482",
            border: "1px solid #e2e6f0",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#e4e8f5";
            (e.currentTarget as HTMLButtonElement).style.color = "#3d4a72";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f0f2f7";
            (e.currentTarget as HTMLButtonElement).style.color = "#5a6482";
          }}
        >
          <EyeOutlined />
          View Details
        </button>
      </div>
    </div>
  );
}
