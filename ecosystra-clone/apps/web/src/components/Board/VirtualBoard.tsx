import React, { useState, useRef, useEffect } from "react";
import * as Lucide from "lucide-react";

const {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  FileText,
  Star,
  Copy,
  MoreHorizontal,
  User,
  Calendar,
  Type,
  Hash,
  CheckSquare,
  ListFilter,
  ArrowUpDown,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Search,
  X,
  Clock,
  Tag,
  MinusCircle,
  ChevronsUp,
  Droplet,
  FileSpreadsheet,
  Archive,
  Layers,
  ArrowRight,
  Rows,
  Boxes,
  Settings,
  Sparkles,
  UserPlus,
  Filter,
  ChevronsRight,
  Layout,
  ArrowLeftRight,
  Puzzle,
  BellOff,
  Asterisk,
  ListChecks,
  LockOpen,
  Eye,
  AlignLeft,
  Mail,
  Lock,
  EyeOff,
  Diamond,
  Wand2,
  CheckCircle,
} = Lucide as any;

/* ============ Types ============ */
export interface ColumnDef {
  id: string;
  title: string;
  type:
    | "status"
    | "person"
    | "date"
    | "text"
    | "priority"
    | "timestamp"
    | "file"
    | "numbers"
    | "tags"
    | "timeline"
    | "due_date_priority"
    | "notes_category"
    | "checkbox"
    | "dropdown"
    | "doc"
    | "formula"
    | "connect"
    | "extract"
    | "mirror"
    | "link"
    | "world_clock";
  width?: number;
  wrapText?: boolean;
}

export interface BoardItem {
  id: string;
  name: string;
  groupId: string;
  dynamicData: Record<string, any>;
  subitems?: BoardItem[];
  subitemColumns?: ColumnDef[];
  subitemPrimaryColumnTitle?: string;
}

export interface BoardGroup {
  id: string;
  name: string;
  color: string;
  items: BoardItem[];
  columns?: ColumnDef[];
  primaryColumnTitle?: string;
}

const INITIAL_COLUMNS: ColumnDef[] = [
  { id: "owner", title: "Owner", type: "person" },
  { id: "status", title: "Status", type: "status" },
  { id: "due_date", title: "Due date", type: "date" },
  { id: "last_updated", title: "Last updated", type: "timestamp" },
  { id: "notes", title: "Notes", type: "text" },
  { id: "files", title: "Files", type: "file" },
  { id: "timeline", title: "Timeline", type: "timeline" },
  { id: "priority", title: "Priority", type: "priority" },
  { id: "budget", title: "Budget", type: "numbers" },
];

const INITIAL_SUBITEM_COLUMNS: ColumnDef[] = [
  { id: "owner", title: "Owner", type: "person" },
  { id: "status", title: "Status", type: "status" },
  { id: "date", title: "Date", type: "date" },
];

/* ============ Constants ============ */
const STATUS_OPTIONS = ["Working on it", "Done", "Stuck", "Not Started", ""];
const STATUS_COLORS: Record<string, string> = {
  Done: "status-done",
  "Working on it": "status-working",
  Stuck: "status-stuck",
  "Not Started": "status-blank",
  "": "status-blank",
};

const PRIORITY_OPTIONS = [
  { label: "Critical", color: "#333333", bg: "#333333" },
  { label: "High", color: "#401694", bg: "#401694" },
  { label: "Medium", color: "#5559DF", bg: "#5559DF" },
  { label: "Low", color: "#579BFC", bg: "#579BFC" },
  { label: "", color: "#C4C4C4", bg: "#C4C4C4" },
];

const DUE_DATE_PRIORITY_OPTIONS = [
  { label: "Critical Priority", color: "#E2445C" },
  { label: "High Priority", color: "#FDAB3D" },
  { label: "Normal Priority", color: "#579BFC" },
  { label: "Low Priority", color: "#00C875" },
  { label: "", color: "#C4C4C4" },
];

const NOTES_CATEGORY_OPTIONS = [
  { label: "Action Item", color: "#00C875" },
  { label: "Meeting Summary", color: "#579BFC" },
  { label: "Design Feedback", color: "#A25DDC" },
  { label: "Bug Report", color: "#E2445C" },
  { label: "General", color: "#FDAB3D" },
  { label: "", color: "#C4C4C4" },
];

const AVATAR_COLORS = [
  "linear-gradient(135deg, #879CFF, #6C6CFF)",
  "linear-gradient(135deg, #FF7EB3, #FF758C)",
  "linear-gradient(135deg, #00C875, #00B461)",
  "linear-gradient(135deg, #FDAB3D, #FF8C00)",
];

const MONDAY_COLORS = [
  "#00c875",
  "#ffcb00",
  "#0086c0",
  "#df2f4a",
  "#a25ddc",
  "#00d1d1",
  "#ffadad",
  "#ff7575",
  "#9d9d9d",
  "#68217a",
  "#2a3b4c",
  "#579bfc",
  "#ff7b00",
  "#f65f7c",
  "#00754a",
];

/* Column picker categories */
const COLUMN_PICKER_ESSENTIALS = [
  { type: "status", label: "Status", color: "#00c875", icon: "≡" },
  { type: "dropdown", label: "Dropdown", color: "#00c875", icon: "☰" },
  { type: "text", label: "Text", color: "#ff7575", icon: "T" },
  { type: "date", label: "Date", color: "#ffcb00", icon: "📅" },
  { type: "person", label: "People", color: "#0086c0", icon: "👤" },
  { type: "numbers", label: "Numbers", color: "#a25ddc", icon: "1₂₃" },
];

const COLUMN_PICKER_USEFUL = [
  { type: "file", label: "Files", color: "#ff7575", icon: "□" },
  { type: "checkbox", label: "Checkbox", color: "#00c875", icon: "☑" },
  { type: "doc", label: "Ecosystra Doc", color: "#a25ddc", icon: "□" },
  { type: "formula", label: "Formula", color: "#a25ddc", icon: "ƒx" },
  { type: "connect", label: "Connect boards", color: "#ff7575", icon: "⊞" },
  { type: "extract", label: "Extract info", color: "#00c875", icon: "✦" },
  { type: "timeline", label: "Timeline", color: "#579bfc", icon: "≡" },
  { type: "priority", label: "Priority", color: "#ffcb00", icon: "▲" },
];

function getInitials(name: string): string {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function formatBudget(val: any): string {
  if (val === undefined || val === null || val === "") return "";
  const num = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(num)) return "";
  return `$${num.toLocaleString()}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday-based
}

/* ============ Sub-Components ============ */

const StatusSummaryBar: React.FC<{ items: BoardItem[] }> = ({ items }) => {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const s = item.dynamicData.status || "";
    counts[s] = (counts[s] || 0) + 1;
  });
  const total = items.length || 1;
  const order = ["Done", "Working on it", "Stuck", "", "Not Started"];
  const bgMap: Record<string, string> = {
    Done: "var(--status-done)",
    "Working on it": "var(--status-working)",
    Stuck: "var(--status-stuck)",
    "": "var(--status-blank)",
    "Not Started": "var(--status-blank)",
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {order.map((s) => {
        const c = counts[s] || 0;
        if (c === 0) return null;
        return (
          <div
            key={s}
            style={{
              width: `${(c / total) * 100}%`,
              background: bgMap[s],
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        );
      })}
    </div>
  );
};

const DateRangePill: React.FC<{ items: BoardItem[] }> = ({ items }) => {
  const dates = items
    .map((i) => i.dynamicData.due_date)
    .filter(Boolean)
    .map((d) => new Date(d).getTime())
    .sort((a, b) => a - b);

  if (dates.length === 0)
    return (
      <span style={{ color: "var(--text-disabled)", fontSize: 12 }}>-</span>
    );
  const start = formatDate(new Date(dates[0]).toISOString());
  const end = formatDate(new Date(dates[dates.length - 1]).toISOString());
  return (
    <div
      style={{
        background: "var(--primary)",
        color: "white",
        borderRadius: 12,
        padding: "2px 10px",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {start} - {end}
    </div>
  );
};

/* ============ Cell Editors ============ */

const StatusDropdown: React.FC<{
  value: string;
  onSelect: (val: string) => void;
}> = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        className={`status-badge ${STATUS_COLORS[value] || "status-blank"}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={{ cursor: "pointer", width: "100%" }}
      >
        {value || ""}
      </div>
      {open && (
        <div className="status-dropdown" onClick={(e) => e.stopPropagation()}>
          {STATUS_OPTIONS.map((opt) => (
            <div
              key={opt || "__empty"}
              className={`status-dropdown-item ${STATUS_COLORS[opt] || "status-blank"}`}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              {opt || "—"}
              {opt === value && (
                <Check size={12} style={{ marginLeft: "auto" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---- Priority Dropdown ---- */
const PriorityDropdown: React.FC<{
  value: string;
  onSelect: (val: string) => void;
}> = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  const current =
    PRIORITY_OPTIONS.find((p) => p.label === value) ||
    PRIORITY_OPTIONS[PRIORITY_OPTIONS.length - 1];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        className="colored-dropdown-badge"
        style={{ background: current.bg, color: "white", cursor: "pointer" }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {value || "—"}
      </div>
      {open && (
        <div className="status-dropdown" onClick={(e) => e.stopPropagation()}>
          {PRIORITY_OPTIONS.map((opt) => (
            <div
              key={opt.label || "__empty"}
              className="status-dropdown-item"
              style={{ background: opt.bg, color: "white" }}
              onClick={() => {
                onSelect(opt.label);
                setOpen(false);
              }}
            >
              {opt.label || "—"}
              {opt.label === value && (
                <Check size={12} style={{ marginLeft: "auto" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---- Colored Category Dropdown (reusable) ---- */
const ColoredCategoryDropdown: React.FC<{
  value: string;
  options: { label: string; color: string }[];
  onSelect: (val: string) => void;
}> = ({ value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const current =
    options.find((o) => o.label === value) || options[options.length - 1];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        className="colored-dropdown-badge"
        style={{
          background: current.color,
          color: "white",
          cursor: "pointer",
          fontSize: 12,
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {value || "—"}
      </div>
      {open && (
        <div
          className="status-dropdown"
          style={{ minWidth: 180 }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((opt) => (
            <div
              key={opt.label || "__empty"}
              className="status-dropdown-item"
              style={{ background: opt.color, color: "white" }}
              onClick={() => {
                onSelect(opt.label);
                setOpen(false);
              }}
            >
              {opt.label || "—"}
              {opt.label === value && (
                <Check size={12} style={{ marginLeft: "auto" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---- Timeline Editor (Date Range Picker) ---- */
const TimelineEditor: React.FC<{
  value: { start: string; end: string } | null;
  onChange: (val: { start: string; end: string } | null) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.start || "");
  const [endDate, setEndDate] = useState(value?.end || "");
  const [viewYear, setViewYear] = useState(
    startDate ? new Date(startDate).getFullYear() : new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    startDate ? new Date(startDate).getMonth() : new Date().getMonth(),
  );
  const [selectingEnd, setSelectingEnd] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setStartDate(value.start || "");
      setEndDate(value.end || "");
    }
  }, [value]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handleDateClick = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (!selectingEnd) {
      setStartDate(dateStr);
      setEndDate("");
      setSelectingEnd(true);
    } else {
      if (dateStr < startDate) {
        setStartDate(dateStr);
        setEndDate(startDate);
      } else {
        setEndDate(dateStr);
      }
      setSelectingEnd(false);
      onChange({
        start: dateStr < startDate ? dateStr : startDate,
        end: dateStr < startDate ? startDate : dateStr,
      });
      setOpen(false);
    }
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr >= startDate && dateStr <= endDate;
  };

  const isStart = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr === startDate;
  };

  const isEnd = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr === endDate;
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else setViewMonth(viewMonth + 1);
  };

  const selectedDays =
    startDate && endDate
      ? Math.abs(
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              86400000,
          ),
        ) + 1
      : 0;

  if (!value && !open) {
    return (
      <div
        style={{
          color: "var(--text-disabled)",
          fontSize: 13,
          cursor: "pointer",
          width: "100%",
          textAlign: "center",
        }}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
          setSelectingEnd(false);
        }}
      >
        —
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div
        className="timeline-pill"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
          setSelectingEnd(false);
        }}
      >
        {value && (
          <X
            size={12}
            style={{ marginLeft: 4, cursor: "pointer" }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onChange(null);
              setOpen(false);
            }}
          />
        )}
      </div>
      {open && (
        <div
          className="timeline-calendar-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="timeline-cal-header">
            <span className="timeline-cal-title">Set dates</span>
            <span className="timeline-cal-count">
              {selectedDays > 0
                ? `${selectedDays} days selected`
                : "Select start date"}
            </span>
          </div>
          <div className="timeline-cal-inputs">
            <input
              type="text"
              className="timeline-cal-input"
              value={
                startDate
                  ? new Date(startDate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : ""
              }
              readOnly
              placeholder="Start date"
            />
            <input
              type="text"
              className="timeline-cal-input"
              value={
                endDate
                  ? new Date(endDate).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : ""
              }
              readOnly
              placeholder="End date"
            />
          </div>
          <div className="timeline-cal-nav">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(+e.target.value)}
                className="timeline-cal-select"
              >
                {months.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => setViewYear(+e.target.value)}
                className="timeline-cal-select"
              >
                {[2024, 2025, 2026, 2027, 2028].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="timeline-cal-nav-btn" onClick={prevMonth}>
                <ChevronLeft size={16} />
              </button>
              <button className="timeline-cal-nav-btn" onClick={nextMonth}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div className="timeline-cal-grid">
            {days.map((d) => (
              <div key={d} className="timeline-cal-day-header">
                {d}
              </div>
            ))}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const inRange = isInRange(day);
              const start = isStart(day);
              const end = isEnd(day);
              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === viewMonth &&
                new Date().getFullYear() === viewYear;
              return (
                <div
                  key={day}
                  className={`timeline-cal-day ${inRange ? "in-range" : ""} ${start ? "range-start" : ""} ${end ? "range-end" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Budget Editor ---- */
const BudgetEditor: React.FC<{
  value: any;
  onChange: (val: any) => void;
}> = ({ value, onChange }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(
    value !== undefined && value !== null ? String(value) : "",
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value !== undefined && value !== null ? String(value) : "");
  }, [value]);
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const finish = () => {
    setEditing(false);
    const num = parseFloat(text);
    if (!isNaN(num)) onChange(num);
    else if (text === "") onChange("");
  };

  if (editing) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
      >
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>$</span>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={finish}
          onKeyDown={(e) => e.key === "Enter" && finish()}
          className="cell-text-input"
          onClick={(e) => e.stopPropagation()}
          style={{ textAlign: "right" }}
        />
      </div>
    );
  }
  return (
    <span
      style={{
        fontSize: 13,
        color: value ? "var(--text-primary)" : "var(--text-disabled)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        fontWeight: 500,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      {formatBudget(value) || "—"}
    </span>
  );
};

const DateEditor: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 4,
        width: "100%",
      }}
    >
      <span
        className="date-cell-text"
        style={{ cursor: "pointer" }}
        onClick={() => inputRef.current?.showPicker()}
      >
        {value ? formatDate(value) : "—"}
      </span>
      {value && <Check size={12} color="var(--status-done)" />}
      <input
        ref={inputRef}
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
      />
    </div>
  );
};

const TextEditor: React.FC<{
  value: string;
  onChange: (val: string) => void;
  wrapText?: boolean;
}> = ({ value, onChange, wrapText }) => {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<any>(null);

  useEffect(() => {
    setText(value);
  }, [value]);
  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const finish = () => {
    setEditing(false);
    if (text !== value) onChange(text);
  };

  if (editing) {
    return wrapText ? (
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={finish}
        className="cell-text-input wrap-text-area"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          minHeight: 60,
          padding: 8,
          fontSize: 13,
        }}
      />
    ) : (
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={finish}
        onKeyDown={(e) => e.key === "Enter" && finish()}
        className="cell-text-input"
        onClick={(e) => e.stopPropagation()}
      />
    );
  }
  return (
    <span
      className={wrapText ? "cell-text-wrap" : ""}
      style={{
        fontSize: 13,
        color: "var(--text-primary)",
        cursor: "pointer",
        whiteSpace: wrapText ? "pre-wrap" : "nowrap",
        overflow: wrapText ? "visible" : "hidden",
        textOverflow: "ellipsis",
        display: "block",
        width: "100%",
      }}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      {value || "—"}
    </span>
  );
};

const PersonCell: React.FC<{
  value: string;
  onChange: (val: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const people = ["Ade Basir", "John Doe", "Jane Smith"];

  if (!value && !open) {
    return (
      <div
        className="person-avatar-empty"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        style={{ cursor: "pointer" }}
      />
    );
  }

  const initials = getInitials(value);
  const idx = initials ? initials.charCodeAt(0) % AVATAR_COLORS.length : 0;

  return (
    <div style={{ position: "relative" }}>
      <div
        className="person-avatar"
        style={{
          background: value ? AVATAR_COLORS[idx] : undefined,
          cursor: "pointer",
        }}
        title={value}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        {value ? initials : ""}
      </div>
      {open && (
        <div className="person-dropdown" onClick={(e) => e.stopPropagation()}>
          {people.map((p) => (
            <div
              key={p}
              className="person-dropdown-item"
              onClick={() => {
                onChange(p);
                setOpen(false);
              }}
            >
              <div
                className="person-avatar"
                style={{
                  background:
                    AVATAR_COLORS[
                      getInitials(p).charCodeAt(0) % AVATAR_COLORS.length
                    ],
                  width: 24,
                  height: 24,
                  fontSize: 10,
                }}
              >
                {getInitials(p)}
              </div>
              <span>{p}</span>
              {p === value && (
                <Check size={12} style={{ marginLeft: "auto" }} />
              )}
            </div>
          ))}
          <div
            className="person-dropdown-item"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            style={{ color: "var(--text-secondary)" }}
          >
            Clear
          </div>
        </div>
      )}
    </div>
  );
};

/* ============ Column Picker Popup ============ */
const ColumnPickerPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  onAddColumn: (type: string) => void;
}> = ({ open, onClose, onAddColumn }) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (!open) return null;

  const filteredEssentials = COLUMN_PICKER_ESSENTIALS.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredUseful = COLUMN_PICKER_USEFUL.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="column-picker-overlay" onClick={onClose}>
      <div className="column-picker-popup" onClick={(e) => e.stopPropagation()}>
        <div className="column-picker-search">
          <Search size={16} color="var(--text-secondary)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or describe your column"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="column-picker-search-input"
          />
        </div>

        {filteredEssentials.length > 0 && (
          <>
            <div className="column-picker-category">Essentials</div>
            <div className="column-picker-grid">
              {filteredEssentials.map((col) => (
                <div
                  key={col.type}
                  className="column-picker-item"
                  onClick={() => {
                    onAddColumn(col.type);
                    onClose();
                  }}
                >
                  <div
                    className="column-picker-icon"
                    style={{ background: col.color }}
                  >
                    {col.icon}
                  </div>
                  <span>{col.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {filteredUseful.length > 0 && (
          <>
            <div className="column-picker-category">Super useful</div>
            <div className="column-picker-grid">
              {filteredUseful.map((col) => (
                <div
                  key={col.type}
                  className="column-picker-item"
                  onClick={() => {
                    onAddColumn(col.type);
                    onClose();
                  }}
                >
                  <div
                    className="column-picker-icon"
                    style={{ background: col.color }}
                  >
                    {col.icon}
                  </div>
                  <span>{col.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="column-picker-footer">
          <span>More columns</span>
        </div>
      </div>
    </div>
  );
};
/* ============ Main Component ============ */
interface VirtualBoardProps {
  groups: BoardGroup[];
  selectedItem?: BoardItem | null;
  onItemClick?: (item: BoardItem) => void;
  onUpdateGroup?: (groupId: string, data: Partial<BoardGroup>) => void;
  onUpdateItem?: (itemId: string, data: Partial<BoardItem>) => void;
  onAddColumn?: (groupId: string, type: string) => void;
  onAddItem?: (groupId: string, name: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onDuplicateItem?: (item: BoardItem) => void;
  // Subitems 2.0
  onAddSubitem?: (parentId: string, name: string) => void;
  onUpdateSubitem?: (id: string, data: Partial<BoardItem>) => void;
  onAddSubitemColumn?: (parentItemId: string, type: string) => void;
  onRenameColumn?: (
    columnId: string,
    newTitle: string,
    level: number,
    contextId?: string,
  ) => void;
  // Phase 3 Filter/Settings
  searchTerm?: string;
  onSearchChange?: (val: string) => void;
  hiddenColumns?: string[];
  onToggleColumn?: (id: string) => void;
  filters?: any;
  onUpdateFilters?: (filters: any) => void;
  sortConfig?: any[]; // Multi-sort rules
  onSortChange?: (config: any[]) => void;
  viewSettings?: {
    itemHeight: "single" | "double" | "triple";
    pinnedColumns: boolean;
    pinnedColumnsCount: number;
    conditionalColoring: any[];
    defaultValues: Record<string, any>;
  };
  onUpdateViewSettings?: (settings: any) => void;
  onAddGroup?: () => void;
  onDeleteGroup?: (id: string) => void;
  onDuplicateGroup?: (id: string, updates: boolean) => void;
  onArchiveGroup?: (id: string) => void;
  onExportGroup?: (id: string) => void;
  onAddColumnRight?: (groupId: string, afterId: string, type: string) => void;
  onToggleWrapText?: (groupId: string, columnId: string) => void;
  onAddSubsort?: (columnId: string) => void;
  onSaveOrder?: () => void;
  onDuplicateColumn?: (
    groupId: string,
    columnId: string,
    includeValues: boolean,
  ) => void;
  onChangeColumnType?: (
    groupId: string,
    columnId: string,
    newType: string,
  ) => void;
  onRemoveColumn?: (groupId: string, columnId: string) => void;
  onSetColumnDescription?: (columnId: string, description: string) => void;
  onSetColumnRequired?: (columnId: string, required: boolean) => void;
  onToggleColumnNotifications?: (columnId: string) => void;
  onSetStatusLabels?: (
    columnId: string,
    labels: { label: string; color: string }[],
  ) => void;
  onCreateAutomation?: (type: string, columnId: string) => void;
  columnSettings?: Record<string, any>;
}

export const VirtualBoard: React.FC<VirtualBoardProps> = ({
  groups,
  selectedItem,
  onItemClick,
  onUpdateGroup,
  onUpdateItem,
  onAddColumn,
  onAddItem,
  onDeleteItem,
  onDuplicateItem,
  onAddSubitem,
  onAddSubitemColumn,
  onRenameColumn,
  onAddGroup,
  onDeleteGroup,
  onDuplicateGroup,
  onAddColumnRight,
  onArchiveGroup,
  onExportGroup,
  onToggleWrapText,
  onAddSubsort,
  onSaveOrder,
  onDuplicateColumn,
  onChangeColumnType,
  onRemoveColumn,
  onSetColumnDescription,
  onSetColumnRequired,
  onToggleColumnNotifications,
  onSetStatusLabels,
  onCreateAutomation,
  columnSettings = {},
  searchTerm,
  onSearchChange,
  hiddenColumns = [],
  onToggleColumn,
  filters,
  onUpdateFilters,
  sortConfig = [],
  onSortChange,
  viewSettings = {
    itemHeight: "single",
    pinnedColumns: false,
    pinnedColumnsCount: 1,
    conditionalColoring: [],
    defaultValues: {},
  },
  onUpdateViewSettings,
}) => {
  const rowHeight =
    viewSettings.itemHeight === "single"
      ? 36
      : viewSettings.itemHeight === "triple"
        ? 80
        : 54;
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );
  const [expandedSubitems, setExpandedSubitems] = useState<Set<string>>(
    new Set(),
  );

  // Editing states
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<{
    id: string;
    level: number;
    contextId?: string;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [addingTaskGroup, setAddingTaskGroup] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  // Dropdown states
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string;
    item: BoardItem;
  } | null>(null);
  const [colorPicker, setColorPicker] = useState<string | null>(null);
  const [columnPickerOpen, setColumnPickerOpen] = useState(false);
  const [addingToGroupId, setAddingToGroupId] = useState<string | null>(null);
  const [addingSubitemColumnToId, setAddingSubitemColumnToId] = useState<
    string | null
  >(null);
  const [activeGroupMenu, setActiveGroupMenu] = useState<string | null>(null);
  const [activeColumnMenu, setActiveColumnMenu] = useState<{
    id: string;
    contextId: string;
  } | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editRef = useRef<HTMLInputElement>(null);
  const groupEditRef = useRef<HTMLInputElement>(null);
  const columnEditRef = useRef<HTMLInputElement>(null);
  const addTaskRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem && editRef.current) editRef.current.focus();
  }, [editingItem]);

  useEffect(() => {
    if (editingGroup && groupEditRef.current) groupEditRef.current.focus();
  }, [editingGroup]);

  useEffect(() => {
    if (editingColumn && columnEditRef.current) {
      columnEditRef.current.focus();
      columnEditRef.current.select();
    }
  }, [editingColumn]);

  useEffect(() => {
    if (addingTaskGroup && addTaskRef.current) addTaskRef.current.focus();
  }, [addingTaskGroup]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".context-menu") &&
        !target.closest(".color-picker-dropdown") &&
        !target.closest(".column-menu") &&
        !target.closest(".group-menu-container") &&
        !target.closest(".column-options-btn") &&
        !target.closest(".group-menu-trigger")
      ) {
        setContextMenu(null);
        setColorPicker(null);
        setActiveGroupMenu(null);
        setActiveColumnMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const collapseAllGroups = () => {
    setCollapsedGroups(new Set(groups.map((g) => g.id)));
  };

  const expandAllSubitems = () => {
    const allIds = new Set<string>();
    groups.forEach((g) =>
      g.items.forEach((i) => {
        allIds.add(i.id);
        if (i.subitems) i.subitems.forEach((si) => allIds.add(si.id));
      }),
    );
    setExpandedSubitems(allIds);
  };

  const collapseAllSubitems = () => {
    setExpandedSubitems(new Set());
  };

  const defaultStatusLabels = [
    { label: "Done", color: "#00c875" },
    { label: "Working on it", color: "#fdab3d" },
    { label: "Stuck", color: "#df2f4a" },
    { label: "Not Started", color: "#c4c4c4" },
  ];

  const renderColumnMenu = (colId: string, contextId: string) => {
    const group = groups.find((g) => g.id === contextId);
    const columns = [...INITIAL_COLUMNS, ...(group?.columns || [])];
    const col =
      colId === "primary" ? null : columns.find((c) => c.id === colId);
    const isWrapped = col?.wrapText;

    const addColumnSubmenu = (
      <div className="column-submenu">
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "status");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-status">
            <ListFilter size={10} />
          </div>{" "}
          Status
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "text");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-text">
            <Type size={10} />
          </div>{" "}
          Text
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "person");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-people">
            <User size={10} />
          </div>{" "}
          People
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "timeline");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-timeline">
            <Clock size={10} />
          </div>{" "}
          Timeline
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "date");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-date">
            <Calendar size={10} />
          </div>{" "}
          Date
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "tags");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-tags">
            <Tag size={10} />
          </div>{" "}
          Tags
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "numbers");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-numbers">
            <Hash size={10} />
          </div>{" "}
          Numbers
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "dropdown");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon type-dropdown">
            <ChevronDown size={10} />
          </div>{" "}
          Dropdown
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "checkbox");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon" style={{ background: "#00d1d1" }}>
            <CheckSquare size={10} />
          </div>{" "}
          Checkbox
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "link");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon" style={{ background: "#175a8e" }}>
            <ExternalLink size={10} />
          </div>{" "}
          Link
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onAddColumnRight?.(contextId, colId, "mirror");
            setActiveColumnMenu(null);
          }}
        >
          <div className="column-type-icon" style={{ background: "#784bd1" }}>
            <Copy size={10} />
          </div>{" "}
          Mirror
        </div>
        <div className="column-menu-divider" />
        <div
          className="column-menu-item"
          onClick={() => {
            setAddingToGroupId(contextId);
            setColumnPickerOpen(true);
            setActiveColumnMenu(null);
          }}
        >
          More columns
        </div>
      </div>
    );

    if (col?.type === "status") {
      return (
        <div className="column-menu" onClick={(e) => e.stopPropagation()}>
          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Settings size={14} /> Settings
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Customize Status column",
                        message:
                          "Enter comma-separated labels (example: Backlog, In Progress, Done)",
                        type: "prompt",
                        defaultValue: (
                          columnSettings[colId]?.labels || defaultStatusLabels
                        )
                          .map((s: any) => s.label)
                          .join(", "),
                        onClose: (val: any) => {
                          if (!val) return;
                          const labels = String(val)
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                            .map((label, idx) => ({
                              label,
                              color:
                                defaultStatusLabels[
                                  idx % defaultStatusLabels.length
                                ].color,
                            }));
                          if (labels.length > 0)
                            onSetStatusLabels?.(colId, labels);
                        },
                      },
                    }),
                  );
                }}
              >
                <Layers size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Customize Status column
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Edit description",
                        message: "Enter a tooltip description for this column:",
                        type: "prompt",
                        defaultValue:
                          columnSettings[colId]?.description ||
                          "Add description here",
                        onClose: (val: any) => {
                          if (val) onSetColumnDescription?.(colId, String(val));
                        },
                      },
                    }),
                  );
                }}
              >
                <Type size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Add column description
              </div>
              <div className="column-menu-item has-submenu">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <BellOff
                    size={14}
                    style={{ color: "var(--text-secondary)" }}
                  />{" "}
                  Set status notifications
                </div>
                <ChevronRight
                  size={14}
                  style={{ opacity: 0.5, marginLeft: "auto" }}
                />
                <div className="column-submenu">
                  <div
                    style={{
                      padding: "6px 16px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    When a status changes:
                  </div>
                  <div
                    className="column-menu-item"
                    onClick={() => setActiveColumnMenu(null)}
                  >
                    <Mail size={14} color="#ea4335" /> Send an email to... via
                    Gmail
                  </div>
                  <div
                    className="column-menu-item"
                    onClick={() => setActiveColumnMenu(null)}
                  >
                    <Mail size={14} color="#0078d4" /> Send an email to... via
                    Outlook
                  </div>
                  <div
                    className="column-menu-item"
                    onClick={() => setActiveColumnMenu(null)}
                  >
                    <Hash size={14} color="#e51670" /> Notify a specific Slack
                    channel
                  </div>
                  <div
                    className="column-menu-item"
                    onClick={() => setActiveColumnMenu(null)}
                  >
                    <User size={14} color="#464eb8" /> Notify a specific Teams
                    channel
                  </div>
                  <div className="column-menu-divider" />
                  <div
                    className="column-menu-item"
                    style={{ justifyContent: "center" }}
                    onClick={() => setActiveColumnMenu(null)}
                  >
                    Explore all integrations
                  </div>
                </div>
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  onSetColumnRequired?.(colId, true);
                }}
              >
                <Star size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Set column as required
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Column validation rules",
                        type: "custom",
                        name: "columnValidation",
                        data: {
                          columnId: colId,
                          statuses:
                            columnSettings[colId]?.labels ||
                            defaultStatusLabels,
                          columns: groups[0]?.columns || INITIAL_COLUMNS,
                        },
                      },
                    }),
                  );
                }}
              >
                <CheckSquare
                  size={14}
                  style={{ color: "var(--text-secondary)" }}
                />{" "}
                Set column validation
                <span
                  style={{
                    marginLeft: "auto",
                    border: "1px solid #0073ea",
                    color: "#0073ea",
                    fontSize: 10,
                    padding: "0 4px",
                    borderRadius: 2,
                  }}
                >
                  New
                </span>
              </div>
              <div className="column-menu-divider" />
              <div className="column-menu-item disabled">
                <Lock size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Restrict column editing
              </div>
              <div className="column-menu-item disabled">
                <EyeOff size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Restrict column view
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "View Updated",
                        message: "Summary hidden in footer.",
                        type: "info",
                      },
                    }),
                  );
                }}
              >
                <EyeOff size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Hide column summary
              </div>
              <div className="column-menu-item disabled">
                <Star size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Save column as a template
              </div>
            </div>
          </div>

          <div className="column-menu-divider" />
          <div className="column-menu-section-header">
            AI-powered actions{" "}
            <Sparkles size={12} style={{ color: "#a25ddc" }} />
          </div>
          <div
            className="column-menu-item"
            onClick={() => {
              onCreateAutomation?.("auto-assign-labels", colId);
              setActiveColumnMenu(null);
            }}
          >
            <Wand2 size={14} style={{ color: "var(--text-secondary)" }} />{" "}
            Auto-assign labels
          </div>
          <div
            className="column-menu-item"
            onClick={() => setActiveColumnMenu(null)}
          >
            <Sparkles size={14} style={{ color: "var(--text-secondary)" }} />{" "}
            Set a custom prompt
          </div>

          <div className="column-menu-divider" />
          <div
            className="column-menu-item"
            onClick={() => {
              setActiveColumnMenu(null);
              window.dispatchEvent(
                new CustomEvent("open-board-header-dropdown", {
                  detail: "filter",
                }),
              );
            }}
          >
            <Filter size={14} /> Filter
          </div>
          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ArrowUpDown size={14} /> Sort
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  onSortChange?.([{ columnId: colId, direction: "asc" }]);
                  setActiveColumnMenu(null);
                }}
              >
                Sort column
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-board-header-dropdown", {
                      detail: "sort",
                    }),
                  );
                  setActiveColumnMenu(null);
                }}
              >
                Add subsort
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onSaveOrder?.();
                  setActiveColumnMenu(null);
                }}
              >
                Save order of items
              </div>
            </div>
          </div>
          <div
            className="column-menu-item"
            onClick={() => setActiveColumnMenu(null)}
          >
            <ChevronsRight size={14} /> Collapse
          </div>
          <div
            className="column-menu-item"
            onClick={() => {
              setActiveColumnMenu(null);
              window.dispatchEvent(
                new CustomEvent("open-board-header-dropdown", {
                  detail: "groupby",
                }),
              );
            }}
          >
            <Layout size={14} /> Group by
          </div>

          <div className="column-menu-divider" />
          {/* Column Management Actions */}
          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Copy size={14} /> Duplicate column
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  onDuplicateColumn?.(contextId, colId, false);
                  setActiveColumnMenu(null);
                }}
              >
                Column only
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onDuplicateColumn?.(contextId, colId, true);
                  setActiveColumnMenu(null);
                }}
              >
                Column and cell values
              </div>
            </div>
          </div>

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Plus size={14} /> Add column to the right
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              {/* Standard columns submenu content reuse */}
              <div
                className="column-menu-item"
                onClick={() => {
                  onAddColumnRight?.(contextId, colId, "status");
                  setActiveColumnMenu(null);
                }}
              >
                <div className="column-type-icon type-status">
                  <CheckCircle size={10} />
                </div>{" "}
                Status
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onAddColumnRight?.(contextId, colId, "text");
                  setActiveColumnMenu(null);
                }}
              >
                <div className="column-type-icon type-text">
                  <Type size={10} />
                </div>{" "}
                Text
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onAddColumnRight?.(contextId, colId, "person");
                  setActiveColumnMenu(null);
                }}
              >
                <div className="column-type-icon type-person">
                  <User size={10} />
                </div>{" "}
                People
              </div>
              {/* ... more could be added, but focusing on core mimicry */}
            </div>
          </div>

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ArrowLeftRight size={14} /> Change column type
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu" style={{ minWidth: 200 }}>
              <div
                className="column-menu-item"
                onClick={() => {
                  onChangeColumnType?.(contextId, colId, "text");
                  setActiveColumnMenu(null);
                }}
              >
                Text
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onChangeColumnType?.(contextId, colId, "numbers");
                  setActiveColumnMenu(null);
                }}
              >
                Numbers
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onChangeColumnType?.(contextId, colId, "date");
                  setActiveColumnMenu(null);
                }}
              >
                Date
              </div>
            </div>
          </div>

          <div className="column-menu-divider" />
          <div
            className="column-menu-item"
            onClick={() => setActiveColumnMenu(null)}
            style={{ justifyContent: "space-between" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Puzzle size={14} /> Save as managed column
            </div>
            <div style={{ color: "#00ca72" }}>
              <Diamond size={14} />
            </div>
          </div>

          <div className="column-menu-item disabled">
            <Puzzle size={14} /> Column extensions
          </div>

          <div className="column-menu-divider" />
          <div
            className="column-menu-item"
            onClick={() => {
              setEditingColumn({ id: colId, level: 0, contextId: contextId });
              setActiveColumnMenu(null);
            }}
          >
            <Pencil size={14} /> Rename
          </div>
          <div
            className="column-menu-item delete-action"
            onClick={() => {
              onRemoveColumn?.(contextId, colId);
              setActiveColumnMenu(null);
            }}
          >
            <Trash2 size={14} /> Delete
          </div>
        </div>
      );
    }

    if (col?.type === "person") {
      return (
        <div className="column-menu" onClick={(e) => e.stopPropagation()}>
          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Settings size={14} /> Settings
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Customize People column",
                        message:
                          "Settings panel features are premium-only and would open here.",
                        type: "info",
                      },
                    }),
                  );
                }}
              >
                <User size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Customize People column
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Edit description",
                        message: "Enter a tooltip description for this column:",
                        type: "prompt",
                        defaultValue:
                          columnSettings[colId]?.description ||
                          "Assign tasks to team members",
                        onClose: (val: any) => {
                          if (val) onSetColumnDescription?.(colId, String(val));
                        },
                      },
                    }),
                  );
                }}
              >
                <Type size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Edit column description
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onToggleColumnNotifications?.(colId);
                  setActiveColumnMenu(null);
                }}
              >
                <BellOff size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                {columnSettings[colId]?.notificationsMuted
                  ? "Unmute assign notifications"
                  : "Mute assign notifications"}
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  onSetColumnRequired?.(colId, true);
                }}
              >
                <Star size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Set column as required
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  const allStatusLabels = [
                    { label: "Done", color: "#00c875" },
                    { label: "Working on it", color: "#fdab3d" },
                    { label: "Stuck", color: "#df2f4a" },
                    { label: "Not Started", color: "#c4c4c4" },
                    { label: "Spent Catalyst", color: "#579bfc" },
                    { label: "Used Oil", color: "#a25ddc" },
                    { label: "Contaminated Oil", color: "#0086c0" },
                  ];
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Column validation rules",
                        type: "custom",
                        name: "columnValidation",
                        data: {
                          columnId: colId,
                          columns: (groups[0]?.columns || INITIAL_COLUMNS).map(
                            (c) => ({ id: c.id, title: c.title, type: c.type }),
                          ),
                          statuses:
                            columnSettings[colId]?.labels || allStatusLabels,
                        },
                      },
                    }),
                  );
                }}
              >
                <CheckSquare
                  size={14}
                  style={{ color: "var(--text-secondary)" }}
                />{" "}
                Set column validation
                <span
                  style={{
                    marginLeft: "auto",
                    border: "1px solid #0073ea",
                    color: "#0073ea",
                    fontSize: 10,
                    padding: "0 4px",
                    borderRadius: 2,
                  }}
                >
                  New
                </span>
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "Permissions",
                        message:
                          "Premium permission settings panel would open here.",
                        type: "info",
                      },
                    }),
                  );
                }}
              >
                <Settings
                  size={14}
                  style={{ color: "var(--text-secondary)" }}
                />{" "}
                Permissions settings
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  setActiveColumnMenu(null);
                  window.dispatchEvent(
                    new CustomEvent("show-god-modal", {
                      detail: {
                        title: "View Updated",
                        message: "Summary enabled in footer.",
                        type: "info",
                      },
                    }),
                  );
                }}
              >
                <Eye size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Show column summary
              </div>
              <div className="column-menu-item disabled">
                <Star size={14} style={{ color: "var(--text-secondary)" }} />{" "}
                Save column as a template
              </div>
            </div>
          </div>

          <div className="column-menu-divider" />

          <div
            style={{
              padding: "6px 16px",
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            AI-powered actions{" "}
            <Sparkles size={14} style={{ float: "right", color: "#ff3d71" }} />
          </div>
          <div
            className="column-menu-item"
            onClick={() => {
              onCreateAutomation?.("auto-assign-people", colId);
              setActiveColumnMenu(null);
            }}
          >
            <UserPlus size={14} /> Auto-assign people
          </div>

          <div className="column-menu-divider" />

          <div
            className="column-menu-item"
            onClick={() => {
              setActiveColumnMenu(null);
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("open-board-header-dropdown", {
                    detail: "filter",
                  }),
                );
              }, 100);
            }}
          >
            <Filter size={14} /> Filter
          </div>

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ArrowUpDown size={14} /> Sort
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  onSortChange?.([{ columnId: colId, direction: "asc" }]);
                  setActiveColumnMenu(null);
                }}
              >
                Sort column
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onAddSubsort?.(colId);
                  setActiveColumnMenu(null);
                }}
              >
                Add subsort
              </div>
              <div className="column-menu-divider" />
              <div
                className="column-menu-item"
                onClick={() => {
                  onSaveOrder?.();
                  setActiveColumnMenu(null);
                }}
              >
                Save order of items
              </div>
            </div>
          </div>

          <div
            className="column-menu-item"
            onClick={() => {
              onToggleColumn?.(colId);
              setActiveColumnMenu(null);
            }}
          >
            <ChevronsRight size={14} /> Collapse
          </div>
          <div
            className="column-menu-item"
            onClick={() => {
              setActiveColumnMenu(null);
              setTimeout(() => {
                window.dispatchEvent(
                  new CustomEvent("open-board-header-dropdown", {
                    detail: "groupby",
                  }),
                );
              }, 100);
            }}
          >
            <Layout size={14} /> Group by
          </div>

          <div className="column-menu-divider" />

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Copy size={14} /> Duplicate column
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                className="column-menu-item"
                onClick={() => {
                  onDuplicateColumn?.(contextId, colId, false);
                  setActiveColumnMenu(null);
                }}
              >
                Column only
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onDuplicateColumn?.(contextId, colId, true);
                  setActiveColumnMenu(null);
                }}
              >
                Column and cell values
              </div>
            </div>
          </div>

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Plus size={14} /> Add column to the right
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            {addColumnSubmenu}
          </div>

          <div className="column-menu-item has-submenu">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ArrowLeftRight size={14} /> Change column type
            </div>
            <ChevronRight
              size={14}
              style={{ opacity: 0.5, marginLeft: "auto" }}
            />
            <div className="column-submenu">
              <div
                style={{
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "var(--text-secondary)",
                }}
              >
                Change <strong>{col?.title || "Owner"}</strong> column to:
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onChangeColumnType?.(contextId, colId, "text");
                  setActiveColumnMenu(null);
                }}
              >
                <div className="column-type-icon type-text">
                  <Type size={10} />
                </div>{" "}
                Text
              </div>
              <div
                className="column-menu-item"
                onClick={() => {
                  onChangeColumnType?.(contextId, colId, "long_text");
                  setActiveColumnMenu(null);
                }}
              >
                <div
                  className="column-type-icon type-text"
                  style={{ background: "#ffcb00" }}
                >
                  <Type size={10} />
                </div>{" "}
                Long text
              </div>
            </div>
          </div>

          <div className="column-menu-divider" />

          <div className="column-menu-item disabled">
            <Puzzle size={14} style={{ color: "var(--text-disabled)" }} />{" "}
            <span style={{ color: "var(--text-disabled)" }}>
              Column extensions
            </span>
            <ChevronRight
              size={14}
              style={{
                opacity: 0.5,
                marginLeft: "auto",
                color: "var(--text-disabled)",
              }}
            />
          </div>

          <div className="column-menu-divider" />

          <div
            className="column-menu-item"
            onClick={() => {
              setActiveColumnMenu(null);
              handleHeaderDoubleClick(
                colId,
                col?.title || "Owner",
                0,
                contextId,
              );
            }}
          >
            <Pencil size={14} /> Rename
          </div>
          <div
            className="column-menu-item"
            style={{ color: "#d83a52" }}
            onClick={() => {
              setActiveColumnMenu(null);
              onRemoveColumn?.(contextId, colId);
            }}
          >
            <Trash2 size={14} /> Delete
          </div>
        </div>
      );
    }

    return (
      <div className="column-menu" onClick={(e) => e.stopPropagation()}>
        <div
          className="column-menu-item"
          onClick={() => {
            setActiveColumnMenu(null);
            handleHeaderDoubleClick(colId, "", 0, contextId);
          }}
        >
          <Pencil size={14} /> Rename
        </div>
        <div
          className="column-menu-item"
          onClick={() => {
            onToggleWrapText?.(contextId, colId);
            setActiveColumnMenu(null);
          }}
        >
          <CheckSquare
            size={14}
            style={{ color: isWrapped ? "var(--primary)" : "inherit" }}
          />{" "}
          Wrap text
          {isWrapped && (
            <Check
              size={12}
              style={{ marginLeft: "auto", color: "var(--primary)" }}
            />
          )}
        </div>

        <div className="column-menu-divider" />

        <div className="column-menu-item has-submenu">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ArrowUpDown size={14} /> Sort
          </div>
          <ChevronRight
            size={14}
            style={{ opacity: 0.5, marginLeft: "auto" }}
          />
          <div className="column-submenu">
            <div
              className="column-menu-item"
              onClick={() => {
                onSortChange?.([{ columnId: colId, direction: "asc" }]);
                setActiveColumnMenu(null);
              }}
            >
              Sort column
            </div>
            <div
              className="column-menu-item"
              onClick={() => {
                onAddSubsort?.(colId);
                setActiveColumnMenu(null);
              }}
            >
              Add subsort
            </div>
            <div className="column-menu-divider" />
            <div
              className="column-menu-item"
              onClick={() => {
                onSaveOrder?.();
                setActiveColumnMenu(null);
              }}
            >
              Save order of items
            </div>
          </div>
        </div>

        <div className="column-menu-item has-submenu">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Plus size={14} /> Add column to the right
          </div>
          <ChevronRight
            size={14}
            style={{ opacity: 0.5, marginLeft: "auto" }}
          />
          {addColumnSubmenu}
        </div>

        <div className="column-menu-divider" />

        <div
          className="column-menu-item"
          style={{ color: "#d83a52" }}
          onClick={() => {
            onRemoveColumn?.(contextId, colId);
            setActiveColumnMenu(null);
          }}
        >
          <Trash2 size={14} /> Delete
        </div>
      </div>
    );
  };

  const getPinnedLeft = (id: string, cols: ColumnDef[], level: number = 0) => {
    const basePrefix = 82; // 6 (indicator) + 38 (checkbox) + 38 (toggle)
    const levelIndent = level * 44;
    const nameLeft = basePrefix + levelIndent;

    if (id === "name") return nameLeft;

    let currentLeft = nameLeft + 300; // Name column width is 300

    const visibleCols = cols.filter((c) => !hiddenColumns.includes(c.id));
    for (const col of visibleCols) {
      if (col.id === id) return currentLeft;
      currentLeft += col.width || 140;
    }
    return currentLeft;
  };

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const toggleSubitems = (itemId: string) => {
    setExpandedSubitems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const startEditItem = (itemId: string, name: string) => {
    setEditingItem(itemId);
    setEditValue(name);
  };

  const finishEditItem = (itemId: string) => {
    if (editValue.trim() && onUpdateItem) {
      onUpdateItem(itemId, { name: editValue });
    }
    setEditingItem(null);
  };

  const startEditGroup = (groupId: string, name: string) => {
    setEditingGroup(groupId);
    setEditValue(name);
  };

  const finishEditGroup = (groupId: string) => {
    if (editValue.trim() && onUpdateGroup) {
      onUpdateGroup(groupId, { name: editValue });
    }
    setEditingGroup(null);
  };

  const handleCellUpdate = (itemId: string, columnId: string, value: any) => {
    onUpdateItem?.(itemId, {
      dynamicData: {
        [columnId]: value,
        last_updated: new Date().toISOString(),
      },
    });
  };

  const handleContextMenu = (e: React.MouseEvent, item: BoardItem) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, itemId: item.id, item });
  };

  const handleAddTask = (groupId: string) => {
    if (newTaskName.trim() && onAddItem) {
      onAddItem(groupId, newTaskName.trim());
    }
    setAddingTaskGroup(null);
    setNewTaskName("");
  };

  const handleHeaderDoubleClick = (
    columnId: string,
    currentTitle: string,
    level: number,
    contextId?: string,
  ) => {
    setEditingColumn({ id: columnId, level, contextId });
    setEditValue(currentTitle);
    setTimeout(() => columnEditRef.current?.focus(), 0);
  };

  const finishRenameColumn = () => {
    if (editingColumn) {
      onRenameColumn?.(
        editingColumn.id,
        editValue,
        editingColumn.level,
        editingColumn.contextId,
      );
      setEditingColumn(null);
    }
  };

  const renderItem = (
    item: BoardItem,
    level: number = 0,
    groupColor: string,
    parentColumns?: ColumnDef[],
  ): React.ReactElement => {
    const isExpanded = expandedSubitems.has(item.id);
    const hasSubitems = item.subitems && item.subitems.length > 0;

    const currentColumns =
      level === 0
        ? groups.find((g) => g.id === item.groupId)?.columns || INITIAL_COLUMNS
        : parentColumns || INITIAL_SUBITEM_COLUMNS;

    // --- Conditional Coloring Logic ---
    const matchingRule = viewSettings?.conditionalColoring?.find((rule) => {
      if (!rule || !rule.columnId) return false;
      const val = item.dynamicData[rule.columnId];
      if (rule.columnId === "name")
        return item.name?.toLowerCase().includes(rule.value?.toLowerCase());
      return String(val).toLowerCase() === String(rule.value).toLowerCase();
    });

    const rowStyle: React.CSSProperties = { height: rowHeight };
    if (matchingRule && matchingRule.scope === "row") {
      rowStyle.backgroundColor = `${matchingRule.color}15`;
      rowStyle.borderLeft = `4px solid ${matchingRule.color}`;
    }

    return (
      <React.Fragment key={item.id}>
        <div
          className={`item-row ${selectedItem?.id === item.id ? "selected" : ""}`}
          style={rowStyle}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {/* Level-based spacer with connectors */}
          {level > 0 && <div className="level-spacer" data-level={level} />}

          {/* Group indicator */}
          <div
            className="group-indicator"
            style={{ background: level === 0 ? groupColor : "transparent" }}
          />

          <div className="item-checkbox">
            <input type="checkbox" />
          </div>

          <div
            className="subitem-toggle"
            onClick={(e) => {
              e.stopPropagation();
              toggleSubitems(item.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <ChevronDown
              size={14}
              style={{
                transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 150ms ease",
                color: "var(--text-secondary)",
                opacity: hasSubitems ? 1 : 0.3,
              }}
            />
          </div>

          <div
            className={`item-name ${viewSettings?.pinnedColumnsCount > 0 ? "sticky-column" : ""}`}
            style={
              viewSettings?.pinnedColumnsCount > 0
                ? {
                    left: getPinnedLeft("name", currentColumns, level),
                    width: 300,
                  }
                : { width: 300 }
            }
            onClick={(e) => {
              e.stopPropagation();
              if (editingItem === item.id) return;

              if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current);
                clickTimeoutRef.current = null;
                // Double click logic
                startEditItem(item.id, item.name);
              } else {
                clickTimeoutRef.current = setTimeout(() => {
                  onItemClick?.(item);
                  clickTimeoutRef.current = null;
                }, 250);
              }
            }}
          >
            {editingItem === item.id ? (
              <input
                ref={editRef}
                className="item-name-input"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => finishEditItem(item.id)}
                onKeyDown={(e) => e.key === "Enter" && finishEditItem(item.id)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={!item.name ? "item-name-placeholder" : ""}>
                {item.name || "Type a name..."}
              </span>
            )}
            <div className="item-hover-actions">
              <Star size={13} />
              <Copy size={13} />
              {hasSubitems && (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {item.subitems?.length}
                </span>
              )}
            </div>
          </div>

          {currentColumns
            .filter((c) => !hiddenColumns.includes(c.id))
            .map((col, idx) => {
              const isPinned =
                viewSettings?.pinnedColumnsCount &&
                viewSettings.pinnedColumnsCount > idx + 1;
              const cellStyle: React.CSSProperties = {
                width: col.width || 140,
              };

              if (isPinned) {
                cellStyle.position = "sticky";
                cellStyle.left = getPinnedLeft(col.id, currentColumns, level);
                cellStyle.zIndex = 10;
                cellStyle.backgroundColor = "white";
                cellStyle.boxShadow = "inset -1px 0 0 var(--border-default)";
              }

              // Cell-level conditional coloring
              if (
                matchingRule &&
                matchingRule.scope === "cell" &&
                matchingRule.columnId === col.id
              ) {
                cellStyle.backgroundColor = `${matchingRule.color}30`;
                cellStyle.borderBottom = `2px solid ${matchingRule.color}`;
              }

              return (
                <div
                  key={col.id}
                  className={`item-cell ${isPinned ? "sticky-column" : ""}`}
                  style={cellStyle}
                >
                  {renderCell(col, item, item.id)}
                </div>
              );
            })}
          <div style={{ width: 40 }} />
        </div>

        {isExpanded && (
          <div className="subitems-container">
            <div className="subitem-headers" data-level={level + 1}>
              <div className="level-spacer" data-level={level + 1} />
              <div
                className="group-indicator"
                style={{ background: "transparent" }}
              />
              <div className="item-checkbox" />
              <div className="subitem-toggle" />
              <div
                className={`column-header col-name ${viewSettings?.pinnedColumnsCount && viewSettings.pinnedColumnsCount > 0 ? "sticky-column" : ""}`}
                style={
                  viewSettings?.pinnedColumnsCount &&
                  viewSettings.pinnedColumnsCount > 0
                    ? {
                        position: "sticky",
                        left: getPinnedLeft(
                          "name",
                          item.subitemColumns || INITIAL_SUBITEM_COLUMNS,
                          level + 1,
                        ),
                        width: 300,
                        zIndex: 20,
                        backgroundColor: "var(--bg-surface)",
                      }
                    : { width: 300 }
                }
              >
                {editingColumn?.id === "subitem-primary" &&
                editingColumn?.level === level + 1 &&
                editingColumn?.contextId === item.id ? (
                  <input
                    ref={columnEditRef}
                    className="column-title-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={finishRenameColumn}
                    onKeyDown={(e) => e.key === "Enter" && finishRenameColumn()}
                  />
                ) : (
                  <span
                    onDoubleClick={() =>
                      handleHeaderDoubleClick(
                        "subitem-primary",
                        item.subitemPrimaryColumnTitle || "Subitem",
                        level + 1,
                        item.id,
                      )
                    }
                  >
                    {item.subitemPrimaryColumnTitle || "Subitem"}
                  </span>
                )}
              </div>
              {(item.subitemColumns || INITIAL_SUBITEM_COLUMNS)
                .filter((c: any) => !hiddenColumns.includes(c.id))
                .map((col: any, idx: number) => {
                  const isPinned =
                    viewSettings?.pinnedColumnsCount &&
                    viewSettings.pinnedColumnsCount > idx + 1;
                  const headerStyle: React.CSSProperties = {
                    width: col.width || 140,
                  };

                  if (isPinned) {
                    headerStyle.position = "sticky";
                    headerStyle.left = getPinnedLeft(
                      col.id,
                      item.subitemColumns || INITIAL_SUBITEM_COLUMNS,
                      level + 1,
                    );
                    headerStyle.zIndex = 20;
                    headerStyle.backgroundColor = "var(--bg-surface)";
                    headerStyle.boxShadow =
                      "inset -1px 0 0 var(--border-default)";
                  }

                  return (
                    <div
                      key={col.id}
                      className={`column-header col-standard ${isPinned ? "sticky-column" : ""}`}
                      style={headerStyle}
                      onDoubleClick={() =>
                        handleHeaderDoubleClick(
                          col.id,
                          col.title,
                          level + 1,
                          item.id,
                        )
                      }
                    >
                      {editingColumn?.id === col.id &&
                      editingColumn?.level === level + 1 &&
                      editingColumn?.contextId === item.id ? (
                        <input
                          ref={columnEditRef}
                          className="column-title-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={finishRenameColumn}
                          onKeyDown={(e) =>
                            e.key === "Enter" && finishRenameColumn()
                          }
                        />
                      ) : (
                        col.title
                      )}
                    </div>
                  );
                })}
              <div
                style={{
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus
                  size={14}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setAddingSubitemColumnToId(item.id);
                    setColumnPickerOpen(true);
                  }}
                />
              </div>
            </div>

            {item.subitems?.map((sub) =>
              renderItem(sub, level + 1, groupColor, item.subitemColumns),
            )}

            <div
              className="add-subitem-row"
              onClick={() => onAddSubitem?.(item.id, "")}
              style={{ height: rowHeight }}
            >
              <div className="level-spacer" data-level={level + 1} />
              <div style={{ width: 66 }} />
              <Plus size={12} />
              <span>Add subitem</span>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };

  const renderCell = (column: ColumnDef, item: BoardItem, itemId: string) => {
    if (hiddenColumns.includes(column.id)) return null;
    const value = item.dynamicData[column.id];
    // ... rest of switch logic

    switch (column.type) {
      case "status":
        return (
          <StatusDropdown
            value={value || ""}
            onSelect={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "priority":
        return (
          <PriorityDropdown
            value={value || ""}
            onSelect={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "due_date_priority":
        return (
          <ColoredCategoryDropdown
            value={value || ""}
            options={DUE_DATE_PRIORITY_OPTIONS}
            onSelect={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "notes_category":
        return (
          <ColoredCategoryDropdown
            value={value || ""}
            options={NOTES_CATEGORY_OPTIONS}
            onSelect={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "timeline":
        return (
          <TimelineEditor
            value={value || null}
            onChange={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "person":
        return (
          <PersonCell
            value={value || ""}
            onChange={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "date":
        return (
          <DateEditor
            value={value || ""}
            onChange={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "timestamp":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "var(--text-secondary)",
            }}
          >
            {value && (
              <div
                className="person-avatar"
                style={{
                  background: AVATAR_COLORS[0],
                  width: 22,
                  height: 22,
                  fontSize: 9,
                }}
              >
                {getInitials("AB")}
              </div>
            )}
            <span>{formatTimeAgo(value)}</span>
          </div>
        );
      case "file":
        if (!value) return null;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FileText size={14} color="var(--primary)" />
          </div>
        );
      case "numbers":
        return (
          <BudgetEditor
            value={value}
            onChange={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "text":
        return (
          <TextEditor
            value={value || ""}
            onChange={(val) => handleCellUpdate(itemId, column.id, val)}
            wrapText={column.wrapText}
          />
        );
      case "mirror":
        return (
          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              padding: "0 8px",
            }}
          >
            {value || "—"}
          </div>
        );
      case "checkbox":
        return (
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) =>
                handleCellUpdate(itemId, column.id, e.target.checked)
              }
              style={{ width: 14, height: 14, cursor: "pointer" }}
            />
          </div>
        );
      case "dropdown":
        return (
          <StatusDropdown
            value={value || ""}
            onSelect={(val) => handleCellUpdate(itemId, column.id, val)}
          />
        );
      case "doc":
      case "formula":
      case "connect":
      case "extract":
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-disabled)",
              fontSize: 11,
              gap: 4,
            }}
          >
            <FileText size={12} /> {column.type.toUpperCase()}
          </div>
        );
      default:
        return <span style={{ fontSize: 13 }}>{value}</span>;
    }
  };

  /* Subitem columns are provided via props or default to empty array */

  return (
    <div className="board-table-container">
      {/* Groups */}
      {groups.map((group) => {
        const isCollapsed = collapsedGroups.has(group.id);
        return (
          <div key={group.id} className="group-container">
            {/* Group Header */}
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <div
                className="group-menu-container"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`group-menu-trigger ${activeGroupMenu === group.id ? "active" : ""}`}
                  onClick={() =>
                    setActiveGroupMenu(
                      activeGroupMenu === group.id ? null : group.id,
                    )
                  }
                >
                  <MoreHorizontal size={14} />
                </div>

                {activeGroupMenu === group.id && (
                  <div className="dropdown-menu group-dropdown-menu">
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        toggleGroup(group.id);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <MinusCircle size={14} />{" "}
                      {isCollapsed
                        ? "Expand this group"
                        : "Collapse this group"}
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        collapseAllGroups();
                        setActiveGroupMenu(null);
                      }}
                    >
                      <ChevronsUp size={14} /> Collapse all groups
                    </div>
                    <div className="dropdown-item disabled">
                      <CheckSquare size={14} /> Select all Tasks in group
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        expandAllSubitems();
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Rows size={14} /> Expand all subitems
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        collapseAllSubitems();
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Rows size={14} /> Collapse all subitems
                    </div>

                    <div className="dropdown-divider" />

                    <div
                      className="dropdown-item"
                      onClick={() => {
                        onAddGroup?.();
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Plus size={14} /> Add group
                    </div>
                    <div className="dropdown-item has-submenu">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                        }}
                      >
                        <Layers size={14} /> Duplicate this group
                        <ChevronRight
                          size={14}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <div
                        className="dropdown-menu"
                        style={{ left: "100%", top: 0 }}
                      >
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            onDuplicateGroup?.(group.id, false);
                            setActiveGroupMenu(null);
                          }}
                        >
                          Duplicate tasks
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            onDuplicateGroup?.(group.id, true);
                            setActiveGroupMenu(null);
                          }}
                        >
                          Duplicate tasks & updates
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-item has-submenu">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                        }}
                      >
                        <ArrowRight size={14} /> Move group
                        <ChevronRight
                          size={14}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <div
                        className="dropdown-menu"
                        style={{ left: "100%", top: 0 }}
                      >
                        <div className="dropdown-item">
                          Move to another board
                        </div>
                        <div className="dropdown-item disabled">
                          Move to top
                        </div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <div
                      className="dropdown-item"
                      onClick={() => {
                        startEditGroup(group.id, group.name);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Pencil size={14} /> Rename group
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        setColorPicker(group.id);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Droplet size={14} /> Change group color
                    </div>

                    <div className="dropdown-divider" />

                    <div
                      className="dropdown-item"
                      onClick={() => {
                        onExportGroup?.(group.id);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <FileSpreadsheet size={14} /> Export to Excel
                    </div>

                    <div className="dropdown-divider" />

                    <div className="dropdown-item has-submenu">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          width: "100%",
                        }}
                      >
                        <Boxes size={14} /> Apps
                        <ChevronRight
                          size={14}
                          style={{ marginLeft: "auto" }}
                        />
                      </div>
                      <div
                        className="dropdown-menu"
                        style={{ left: "100%", top: 0 }}
                      >
                        <div className="dropdown-item">Coming soon...</div>
                      </div>
                    </div>

                    <div className="dropdown-divider" />

                    <div
                      className="dropdown-item"
                      style={{ color: "#d83a52" }}
                      onClick={() => {
                        onDeleteGroup?.(group.id);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Trash2 size={14} /> Delete group
                    </div>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        onArchiveGroup?.(group.id);
                        setActiveGroupMenu(null);
                      }}
                    >
                      <Archive size={14} /> Archive group
                    </div>
                  </div>
                )}
              </div>

              <div
                className="group-color-bar"
                style={{ background: group.color, cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  setColorPicker(colorPicker === group.id ? null : group.id);
                }}
              />
              <ChevronDown
                size={16}
                className={`group-chevron ${isCollapsed ? "collapsed" : ""}`}
                style={{ color: group.color }}
              />

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {editingGroup === group.id ? (
                  <input
                    ref={groupEditRef}
                    className="group-name-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onBlur={() => finishEditGroup(group.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && finishEditGroup(group.id)
                    }
                  />
                ) : (
                  <span
                    className="group-name"
                    style={{ color: group.color }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      startEditGroup(group.id, group.name);
                    }}
                  >
                    {group.name}
                  </span>
                )}

                {colorPicker === group.id && (
                  <div
                    className="color-picker-dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {MONDAY_COLORS.map((c) => (
                      <div
                        key={c}
                        className="color-option"
                        style={{ background: c }}
                        onClick={() => {
                          onUpdateGroup?.(group.id, { color: c });
                          setColorPicker(null);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {group.items.length > 0 && (
                <span className="group-count">{group.items.length} Tasks</span>
              )}
            </div>

            {!isCollapsed && (
              <>
                {/* Column Headers per Group */}
                <div className="column-headers">
                  <div
                    className="group-indicator"
                    style={{ background: group.color }}
                  />
                  <div className="col-checkbox">
                    <input
                      type="checkbox"
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                  </div>
                  <div className="col-spacer" />{" "}
                  {/* Spacer to match subitem-toggle in rows */}
                  <div
                    className={`column-header col-name ${viewSettings?.pinnedColumnsCount && viewSettings.pinnedColumnsCount > 0 ? "sticky-column" : ""}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "var(--bg-surface)",
                      zIndex:
                        viewSettings?.pinnedColumnsCount &&
                        viewSettings.pinnedColumnsCount > 0
                          ? 20
                          : 1,
                      ...(viewSettings?.pinnedColumnsCount &&
                      viewSettings.pinnedColumnsCount > 0
                        ? {
                            position: "sticky",
                            left: getPinnedLeft(
                              "name",
                              group.columns || INITIAL_COLUMNS,
                              0,
                            ),
                            width: 300,
                          }
                        : { width: 300 }),
                    }}
                  >
                    {editingColumn?.id === "primary" &&
                    editingColumn?.level === 0 &&
                    editingColumn?.contextId === group.id ? (
                      <input
                        ref={columnEditRef}
                        className="column-title-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={finishRenameColumn}
                        onKeyDown={(e) =>
                          e.key === "Enter" && finishRenameColumn()
                        }
                      />
                    ) : (
                      <span
                        onDoubleClick={() =>
                          handleHeaderDoubleClick(
                            "primary",
                            group.primaryColumnTitle || "Task",
                            0,
                            group.id,
                          )
                        }
                        style={{ flex: 1, cursor: "pointer" }}
                      >
                        {group.primaryColumnTitle || "Task"}
                      </span>
                    )}
                    <div
                      className="column-options-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveColumnMenu(
                          activeColumnMenu?.id === "primary"
                            ? null
                            : { id: "primary", contextId: group.id },
                        );
                      }}
                    >
                      <MoreHorizontal size={14} />
                      {activeColumnMenu?.id === "primary" &&
                        activeColumnMenu?.contextId === group.id &&
                        renderColumnMenu("primary", group.id)}
                    </div>
                  </div>
                  {(group.columns || INITIAL_COLUMNS)
                    .filter((c: any) => !hiddenColumns.includes(c.id))
                    .map((col: any, idx) => {
                      const isPinned =
                        viewSettings?.pinnedColumnsCount &&
                        viewSettings.pinnedColumnsCount > idx + 1;
                      const headerStyle: React.CSSProperties = {
                        width: col.width || 140,
                      };

                      if (isPinned) {
                        headerStyle.position = "sticky";
                        headerStyle.left = getPinnedLeft(
                          col.id,
                          group.columns || INITIAL_COLUMNS,
                          0,
                        );
                        headerStyle.zIndex = 20;
                        headerStyle.backgroundColor = "var(--bg-surface)";
                        headerStyle.boxShadow =
                          "inset -1px 0 0 var(--border-default)";
                      }

                      return (
                        <div
                          key={col.id}
                          className={`column-header col-standard ${isPinned ? "sticky-column" : ""}`}
                          style={headerStyle}
                          onDoubleClick={() =>
                            handleHeaderDoubleClick(
                              col.id,
                              col.title,
                              0,
                              group.id,
                            )
                          }
                        >
                          {editingColumn?.id === col.id &&
                          editingColumn?.level === 0 &&
                          editingColumn?.contextId === group.id ? (
                            <input
                              ref={columnEditRef}
                              className="column-title-input"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={finishRenameColumn}
                              onKeyDown={(e) =>
                                e.key === "Enter" && finishRenameColumn()
                              }
                            />
                          ) : (
                            <>
                              <span
                                style={{
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {col.title}
                              </span>
                              <div
                                className="column-options-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveColumnMenu(
                                    activeColumnMenu?.id === col.id
                                      ? null
                                      : { id: col.id, contextId: group.id },
                                  );
                                }}
                              >
                                <MoreHorizontal size={14} />
                                {activeColumnMenu?.id === col.id &&
                                  activeColumnMenu?.contextId === group.id &&
                                  renderColumnMenu(col.id, group.id)}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  <div
                    className="column-add-plus-header"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddingToGroupId(group.id);
                      setColumnPickerOpen(true);
                    }}
                  >
                    <Plus size={16} color="var(--text-disabled)" />
                  </div>
                </div>

                {/* Item Rows */}
                {group.items.map((item) => renderItem(item, 0, group.color))}

                {/* Add task row */}
                <div className="add-item-row" style={{ height: rowHeight }}>
                  <div
                    className="group-indicator"
                    style={{ background: group.color }}
                  />
                  <div style={{ width: 38 }} />
                  <div style={{ width: 18 }} />
                  {addingTaskGroup === group.id ? (
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <input
                        ref={addTaskRef}
                        className="item-name-input"
                        placeholder="Enter task name..."
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onBlur={() => handleAddTask(group.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAddTask(group.id);
                          if (e.key === "Escape") {
                            setAddingTaskGroup(null);
                            setNewTaskName("");
                          }
                        }}
                        style={{ width: "100%", outline: "none" }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`add-item-row-trigger ${viewSettings.pinnedColumns ? "sticky-column" : ""}`}
                      onClick={() => setAddingTaskGroup(group.id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        cursor: "text",
                        color: "var(--text-disabled)",
                      }}
                    >
                      <Plus size={14} /> Add task
                    </div>
                  )}
                </div>

                {/* Summary Row */}
                <div
                  className="group-summary-row"
                  style={{ height: rowHeight }}
                >
                  <div
                    className="group-indicator"
                    style={{ background: group.color, opacity: 0.1 }}
                  />
                  <div
                    className="item-checkbox"
                    style={{ visibility: "hidden" }}
                  />
                  <div className="subitem-toggle" />
                  <div
                    className={`item-name ${viewSettings.pinnedColumns ? "sticky-column" : ""}`}
                  />
                  {(group.columns || INITIAL_COLUMNS)
                    .filter((c) => !hiddenColumns.includes(c.id))
                    .map((col) => (
                      <div
                        key={col.id}
                        className="item-cell summary-cell"
                        style={
                          col.width ? { width: col.width } : { width: 140 }
                        }
                      >
                        {col.id === "status" && (
                          <StatusSummaryBar items={group.items} />
                        )}
                        {col.id === "due_date" && (
                          <DateRangePill items={group.items} />
                        )}
                      </div>
                    ))}
                  <div style={{ width: 40 }} />
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Item Context Menu */}
      {contextMenu && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-menu-item"
            onClick={() => {
              navigator.clipboard.writeText(contextMenu.item.name);
              setContextMenu(null);
            }}
          >
            <span>📋</span> Copy name
          </div>
          <div className="context-menu-divider" />
          <div
            className="context-menu-item"
            onClick={() => {
              onItemClick?.(contextMenu.item);
              setContextMenu(null);
            }}
          >
            <ExternalLink size={14} /> Open task
          </div>
          <div
            className="context-menu-item"
            onClick={() => {
              onDuplicateItem?.(contextMenu.item);
              setContextMenu(null);
            }}
          >
            <Copy size={14} /> Duplicate
          </div>
          <div className="context-menu-divider" />
          <div
            className="context-menu-item danger"
            onClick={() => {
              onDeleteItem?.(contextMenu.itemId);
              setContextMenu(null);
            }}
          >
            <Trash2 size={14} /> Delete
          </div>
        </div>
      )}

      {/* Column Picker Popup */}
      <ColumnPickerPopup
        open={columnPickerOpen}
        onAddColumn={(type) => {
          if (addingToGroupId) onAddColumn?.(addingToGroupId, type);
          if (addingSubitemColumnToId)
            onAddSubitemColumn?.(addingSubitemColumnToId, type);
          setAddingToGroupId(null);
          setAddingSubitemColumnToId(null);
          setColumnPickerOpen(false);
        }}
        onClose={() => {
          setColumnPickerOpen(false);
          setAddingToGroupId(null);
          setAddingSubitemColumnToId(null);
        }}
      />
    </div>
  );
};
