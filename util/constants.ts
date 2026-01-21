import { DocumentData } from "./types";

export const INITIAL_DATA: DocumentData = {
  headerTitle: "MIP",
  name: "Hein Htet Zaw",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 300000,
  balanceLabel: "ကျန်ငွေ",
  expenses: [
    {
      id: "1",
      type: "job",
      title: "Imp: Eastar (601 RO) 1 × 40",
      baseAmount: 107000,
      subExpenses: [
        { id: "1-1", label: "Mail / Copy", amount: 3000 },
        { id: "1-2", label: "Survey", amount: 2000 },
        { id: "1-3", label: "ကားသွင်း", amount: 1000 },
      ],
    },
    {
      id: "2",
      type: "job",
      title: "Imp: Rong Da (416 PK) 1 × 20",
      baseAmount: 57000,
      subExpenses: [
        { id: "2-1", label: "Mail / Copy", amount: 3000 },
        { id: "2-2", label: "Survey", amount: 2000 },
        { id: "2-3", label: "ကားသွင်း", amount: 1000 },
      ],
    },
    {
      id: "3",
      type: "simple",
      label: "Taxi",
      amount: 12000,
    },
    {
      id: "4",
      type: "simple",
      label: "လိုငွေ",
      amount: 14000,
      date: "2026-01-16",
    },
  ],
};

export const EMPTY_DATA: DocumentData = {
  headerTitle: "",
  name: "",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceLabel: "ကျန်ငွေ",
  expenses: [],
};
