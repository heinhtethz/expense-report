import { DocumentData } from "./types";

export const INITIAL_DATA: DocumentData = {
  headerTitle: "MIP",
  name: "Hein Htet Zaw",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceAmount: 0,
  balanceLabel: "Balance",
  expenses: [
    {
      id: "1",
      type: "job",
      title: "Imp: Eastar (601 RO) 1 × 40",
      baseAmount: 107000,
    },
    {
      id: "2",
      type: "job",
      title: "Imp: Rong Da (416 PK) 1 × 20",
      baseAmount: 57000,
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
      label: "Claim Amount",
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
  balanceLabel: "Balance",
  expenses: [],
};
