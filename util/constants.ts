import { DocumentData } from "./types";

export const INITIAL_DATA: DocumentData = {
  headerTitle: "MIP",
  name: "HEIN HTET ZAW",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceAmount: 0,
  balanceLabel: "BALANCE",
  expenses: [
    {
      id: "1",
      type: "job",
      title: "IMP: EASTAR (601 RO) 1 * 40'",
      baseAmount: 107000,
      subExpenses: [
        { id: "1", label: "MAIL/COPY", amount: 2000 },
        { id: "2", label: "SURVEY", amount: 2000 },
      ],
    },
    {
      id: "2",
      type: "job",
      title: "IMP: RONG DA (207 PK) 1 * 20'",
      baseAmount: 57000,
      subExpenses: [
        { id: "1", label: "MAIL/COPY", amount: 2000 },
        { id: "2", label: "SURVEY", amount: 2000 },
      ],
    },
    {
      id: "3",
      type: "simple",
      label: "TAXI",
      amount: 12000,
    },
    {
      id: "4",
      type: "simple",
      label: "CLAIM",
      amount: 14000,
      date: "2026-01-16",
    },
  ],
};

export const EMPTY_DATA: DocumentData = {
  headerTitle: "Port",
  name: "Your Name",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceLabel: "Balance",
  expenses: [],
};
