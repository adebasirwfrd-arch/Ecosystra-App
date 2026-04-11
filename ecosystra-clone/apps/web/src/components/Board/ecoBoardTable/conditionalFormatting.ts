import type { BoardItem } from "../boardTypes";

type ViewSettings = {
  conditionalColoring?: Array<{
    columnId?: string;
    value?: string;
    scope?: "row" | "cell";
    color?: string;
  }>;
};

export function findConditionalRule(
  item: BoardItem,
  viewSettings?: ViewSettings,
) {
  return viewSettings?.conditionalColoring?.find((rule) => {
    if (!rule || !rule.columnId) return false;
    const val = item.dynamicData[rule.columnId];
    if (rule.columnId === "name")
      return item.name?.toLowerCase().includes(rule.value?.toLowerCase() ?? "");
    return String(val).toLowerCase() === String(rule.value).toLowerCase();
  });
}
