import { useState, useCallback } from "react";
import {
  BugOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WorkCard, DRAG_TYPE } from "./WorkCard";
import { WorkDetailModal } from "./WorkDetailModal";
import type {
  WorkStatus,
  KanbanWork,
} from "../../../../types/oceanix/works/work_kanban";
import "./KanbanBoard.css"

interface Column {
  key: WorkStatus;
  label: string;
  icon: React.ReactNode;
  accent: string;
  accentLight: string;
  accentBorder: string;
}

const COLUMNS: Column[] = [
  {
    key: "not-started",
    label: "Not Started",
    icon: <ClockCircleOutlined />,
    accent: "#e07272",
    accentLight: "#fff0f0",
    accentBorder: "#f5c6c6",
  },
  {
    key: "inprogress",
    label: "In Progress",
    icon: <SyncOutlined spin />,
    accent: "#c9913a",
    accentLight: "#fffbf0",
    accentBorder: "#f5e0a8",
  },
  {
    key: "fixed",
    label: "Fixed",
    icon: <CheckCircleOutlined />,
    accent: "#4ea87a",
    accentLight: "#f0faf5",
    accentBorder: "#b2e4c8",
  },
];

interface DroppableColumnProps {
  col: Column;
  works: KanbanWork[];
  onDrop: (workId: number, newStatus: WorkStatus) => void;
  onViewDetails: (work: KanbanWork) => void;
}

function DroppableColumn({
  col,
  works,
  onDrop,
  onViewDetails,
}: DroppableColumnProps) {
  const [{ isOver, canDrop }, dropRef] = useDrop<
    { workId: number; currentStatus: WorkStatus },
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: DRAG_TYPE,
    canDrop: (item) => item.currentStatus !== col.key,
    drop: (item) => onDrop(item.workId, col.key),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      className="kanban-column"
      style={{
        background: isActive ? col.accentLight : "#f8f9fc",
        border: `1.5px solid ${isActive ? col.accent : "#e8eaef"}`,
        boxShadow: isActive
          ? `0 0 0 4px ${col.accent}18`
          : "0 1px 3px 0 rgba(0,0,0,0.04)",
        minHeight: 520,
      }}
    >
      {/* Column Header */}
      <div className="column-header">
        <div
          className="column-icon"
          style={{
            background: col.accentLight,
            border: `1.5px solid ${col.accentBorder}`,
            color: col.accent,
          }}
        >
          {col.icon}
        </div>
        <span className="column-title">{col.label}</span>
        <div className="column-count-wrapper">
          <span
            className="column-count"
            style={{
              background: col.accentLight,
              color: col.accent,
              border: `1.5px solid ${col.accentBorder}`,
            }}
          >
            {works.length}
          </span>
        </div>
      </div>

      <div
        className="column-divider"
        style={{ background: col.accentBorder, opacity: 0.6 }}
      />

      {/* Cards */}
      <div className="column-content">
        {works.length === 0 && !isActive && (
          <div className="empty-column">
            <BugOutlined style={{ fontSize: 32 }} />
            <span >No items here</span>
          </div>
        )}
        {works.map((work) => (
          <WorkCard key={work.id} work={work} onViewDetails={onViewDetails} />
        ))}
        {isActive && (
          <div
            className="rounded-xl border-2 border-dashed py-5 flex items-center justify-center text-xs font-semibold"
            style={{ borderColor: col.accent, color: col.accent, opacity: 0.7 }}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

interface KanbanBoardProps {
  initialWorks?: KanbanWork[];
}

export function KanbanBoard({ initialWorks = [] }: KanbanBoardProps) {
  const [works, setWorks] = useState<KanbanWork[]>(initialWorks);
  const [selectedWork, setSelectedWork] = useState<KanbanWork | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDrop = useCallback((workId: number, newStatus: WorkStatus) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, status: newStatus } : w)),
    );
  }, []);

  function handleViewDetails(work: KanbanWork) {
    setSelectedWork(work);
    setModalOpen(true);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSelectedWork(null);
  }

  const grouped: Record<WorkStatus, KanbanWork[]> = {
    "not-started": works.filter((w) => w.status === "not-started"),
    inprogress: works.filter((w) => w.status === "inprogress"),
    fixed: works.filter((w) => w.status === "fixed"),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="kanban-page">
        {/* Board */}
        <div className="kanban-board-container">
          <div className="kanban-board">
            {COLUMNS.map((col) => (
              <DroppableColumn
                key={col.key}
                col={col}
                works={grouped[col.key]}
                onDrop={handleDrop}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>

        <WorkDetailModal
          work={selectedWork}
          open={modalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </DndProvider>
  );
}

export default KanbanBoard;
