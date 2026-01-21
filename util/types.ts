export interface SubExpense {
  id: string;
  label: string;
  amount: number;
}

export interface JobExpense {
  id: string;
  type: "job";
  title: string;
  baseAmount: number;
  subExpenses: SubExpense[];
}

export interface SimpleExpense {
  id: string;
  type: "simple";
  label: string;
  amount: number;
  date?: string;
}

export type Expense = JobExpense | SimpleExpense;

export interface DocumentData {
  headerTitle: string;
  name: string;
  date: string;
  advanceAmount: number;
  advanceDate: string | null;
  expenses: Expense[];
  balanceLabel: string;
}
