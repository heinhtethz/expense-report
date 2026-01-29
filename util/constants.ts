import { DocumentData, JobExpense } from "./types";

export const INITIAL_DATA: DocumentData = {
  port: "MIP",
  name: "HEIN HTET ZAW",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceAmount: 0,
  balanceLabel: "BALANCE",
  expenses: [
    {
      id: crypto.randomUUID(),
      type: "job",
      title: "IMP: NEW IMPORT JOB",
      baseAmount: 0,
      subExpenses: [
        { id: "1", label: "MAIL/COPY", amount: 3000 },
        { id: "2", label: "SURVEY", amount: 2000 },
        { id: "3", label: "TRUCK IN", amount: 1000 },
      ],
    },
    {
      id: crypto.randomUUID(),
      type: "simple",
      label: "TAXI",
      amount: 12000,
    },
    {
      id: crypto.randomUUID(),
      type: "simple",
      label: "CLAIM",
      amount: 14000,
      date: "2026-01-16",
    },
  ],
};

export const EMPTY_DATA: DocumentData = {
  port: "Port",
  name: "Your Name",
  date: new Date().toISOString().split("T")[0],
  advanceAmount: 0,
  balanceLabel: "Balance",
  expenses: [],
};

export const newImportJob: JobExpense = {
  id: crypto.randomUUID(),
  type: "job",
  title: "IMP: NEW IMPORT JOB",
  baseAmount: 0,
  subExpenses: [
    { id: "1", label: "STORAGE", amount: 0 },
    { id: "2", label: "MAIL/COPY", amount: 3000 },
    { id: "3", label: "SURVEY", amount: 2000 },
    { id: "4", label: "TRUCK IN", amount: 1000 },
  ],
};

export const newImportExamJob: JobExpense = {
  id: crypto.randomUUID(),
  type: "job",
  title: "IMP: NEW IMPORT EXAM JOB",
  baseAmount: 0,
  subExpenses: [
    { id: "1", label: "STORAGE", amount: 0 },
    { id: "2", label: "MAIL/COPY", amount: 0 },
    { id: "3", label: "SURVEY", amount: 2000 },
    { id: "4", label: "EO", amount: 10000 },
    { id: "5", label: "CLERK/AD/APPR/CEO", amount: 8000 },
    { id: "6", label: "SEAL", amount: 3000 },
    { id: "7", label: "LABOUR", amount: 0 },
    { id: "8", label: "BAUNG", amount: 1000 },
    { id: "9", label: "TRUCK IN", amount: 1000 },
  ],
};

export const newExportJob: JobExpense = {
  id: crypto.randomUUID(),
  type: "job",
  title: "EXP: NEW EXPORT JOB",
  baseAmount: 0,
  subExpenses: [
    { id: "1", label: "STORAGE", amount: 0 },
    { id: "2", label: "MAIL/COPY", amount: 3000 },
    { id: "3", label: "TRUCK IN", amount: 1000 },
  ],
};

export const newExportExamJob: JobExpense = {
  id: crypto.randomUUID(),
  type: "job",
  title: "EXP: NEW EXPORT EXAM JOB",
  baseAmount: 0,
  subExpenses: [
    { id: "1", label: "STORAGE", amount: 0 },
    { id: "2", label: "MAIL/COPY", amount: 0 },
    { id: "3", label: "TRUCK IN", amount: 1000 },
    { id: "4", label: "EO", amount: 10000 },
    { id: "5", label: "CLERK/AD/APPR/CEO", amount: 8000 },
    { id: "7", label: "LABOUR", amount: 0 },
    { id: "8", label: "BAUNG", amount: 1000 },
  ],
};
