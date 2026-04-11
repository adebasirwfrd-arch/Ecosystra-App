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
