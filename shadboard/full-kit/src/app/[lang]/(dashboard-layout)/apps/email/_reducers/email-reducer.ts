import type { EmailActionType, EmailStateType, EmailType } from "../types"

export const EmailReducer = (
  state: EmailStateType,
  action: EmailActionType
): EmailStateType => {
  switch (action.type) {
    case "setEmails": {
      return {
        ...state,
        emails: action.emails,
        selectedEmails: [],
        sidebarItems: action.sidebarItems,
        loading: false,
      }
    }

    case "setLoading": {
      return { ...state, loading: action.loading }
    }

    case "setListSearchTerm": {
      return { ...state, listSearchTerm: action.term }
    }

    case "toggleSelectEmail": {
      const idx = state.selectedEmails.findIndex((e) => e.id === action.email.id)
      return {
        ...state,
        selectedEmails:
          idx === -1
            ? [...state.selectedEmails, action.email]
            : state.selectedEmails.filter(({ id }) => id !== action.email.id),
      }
    }

    case "toggleSelectFiltered": {
      const { filtered } = action
      const allSelected =
        filtered.length > 0 &&
        filtered.every((e) => state.selectedEmails.some((s) => s.id === e.id))
      return {
        ...state,
        selectedEmails: allSelected ? [] : [...filtered],
      }
    }

    case "toggleStarEmail": {
      const update = (e: EmailType) =>
        e.id === action.email.id ? { ...e, starred: !e.starred, isStarred: !e.starred } : e
      return {
        ...state,
        emails: state.emails.map(update),
      }
    }

    case "setRead": {
      const update = (e: EmailType) =>
        e.id === action.email.id ? { ...e, read: true } : e
      return {
        ...state,
        emails: state.emails.map(update),
      }
    }

    case "removeEmail": {
      return {
        ...state,
        emails: state.emails.filter((e) => e.id !== action.emailId),
        selectedEmails: state.selectedEmails.filter((e) => e.id !== action.emailId),
      }
    }

    default:
      return state
  }
}
