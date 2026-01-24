import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { DocumentData } from "../../util/types";

/**
 * mm → pt
 */
const mm = (v: number) => v * 2.835;

const styles = StyleSheet.create({
  page: {
    paddingVertical: mm(15),
    paddingHorizontal: mm(20),
  },

  header: {
    marginBottom: mm(10),
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 18,
    fontWeight: "bold",
  },

  advBox: {
    paddingVertical: mm(6),
    flexDirection: "column",
    alignItems: "center",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },

  list: {
    fontSize: 14,
    fontWeight: "semibold",
  },

  item: {
    marginBottom: mm(6),
    fontSize: 14,
    letterSpacing: 1.5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    letterSpacing: 1.5,
  },

  titleCol: {
    flex: 1,
    paddingRight: mm(4),
  },

  amountCol: {
    width: mm(30),
    textAlign: "right",
    fontSize: 14,
    letterSpacing: 1.5,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },

  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: mm(7),
    fontSize: 13,
    paddingVertical: 3,
    letterSpacing: 1.5,
    color: "gray",
  },

  footerWrap: {
    position: "absolute",
    bottom: mm(5),
    right: mm(20),
    width: mm(80),
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: mm(4),
  },

  footerLabel: {
    color: "gray",
    letterSpacing: 1.5,
    fontSize: 14,
    fontWeight: "semibold",
  },

  footerValue: {
    color: "gray",
    letterSpacing: 1.5,
    fontSize: 14,
    fontWeight: "semibold",
  },

  balanceBox: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: mm(2),
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1.5,
  },

  balanceLabel: {},

  balanceValue: {},

  pageNumber: {
    position: "absolute",
    right: mm(10),
    top: mm(5),
    fontSize: 9,
    color: "#666",
  },
});

export const Preview = ({ data }: { data: DocumentData }) => {
  const total = data.expenses.reduce((acc, curr) => {
    if (curr.type === "job" && curr.subExpenses) {
      const sub = curr.subExpenses?.reduce((s, c) => s + c.amount, 0);
      return acc + curr.baseAmount + sub;
    }
    if (curr.type === "job") {
      return acc + curr.baseAmount;
    }
    return curr.type === "simple" ? acc + curr.amount : acc;
  }, 0);

  const balanceAdvance = data.balanceAmount + data.advanceAmount;
  const balance = balanceAdvance || total ? balanceAdvance - total : 0;

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.getDate()}.${date.getMonth() + 1}.${date
      .getFullYear()
      .toString()
      .slice(-2)}`;
  };

  return (
    <PDFViewer width="100%" height="100%">
      <Document>
        <Page size="A4" style={styles.page} wrap>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <Text>{data.headerTitle}</Text>
              <Text>{data.name}</Text>
              <Text>{formatDate(data.date)}</Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <View style={styles.advBox}>
                <Text>
                  {data.balanceAmount ? `Bal - ${data.balanceAmount}/-` : ""}
                </Text>
                <Text>
                  {data.balanceDate && data.balanceDate
                    ? `(${formatDate(data.balanceDate)})`
                    : ""}
                </Text>
              </View>

              {data.balanceAmount && data.advanceAmount ? (
                <Text
                  style={{ marginTop: 15, fontSize: 20, marginHorizontal: 15 }}
                >
                  +
                </Text>
              ) : (
                ""
              )}

              <View style={styles.advBox}>
                <Text>
                  {data.advanceAmount ? `Adv - ${data.advanceAmount}/-` : ""}
                </Text>

                <Text>
                  {data.advanceDate && data.advanceAmount
                    ? `(${formatDate(data.advanceDate)})`
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          {/* Expense List */}
          <View style={styles.list} wrap={true}>
            {data.expenses.map((expense, idx) => {
              const no = idx + 1;

              if (expense.type === "job") {
                return (
                  <View key={expense.id} style={styles.item}>
                    <View style={styles.row}>
                      <Text style={[styles.titleCol, styles.jobTitle]}>
                        {no}. {expense.title}
                      </Text>
                      <Text style={styles.amountCol}>
                        {expense.baseAmount.toLocaleString()}
                      </Text>
                    </View>

                    {expense.subExpenses?.map((sub) => (
                      <View key={sub.id} style={styles.subRow}>
                        <Text>{sub.label}</Text>
                        <Text>{sub.amount.toLocaleString()}</Text>
                      </View>
                    ))}
                  </View>
                );
              }

              return (
                <View key={expense.id} style={styles.item}>
                  <View style={styles.row}>
                    <Text style={styles.titleCol}>
                      {no}. {expense.label}{" "}
                      {expense.date && `(${formatDate(expense.date)})`}
                    </Text>
                    <Text style={styles.amountCol}>
                      {expense.amount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Footer — only on LAST PAGE */}
          <View style={styles.footerWrap} wrap={false}>
            {/* TOTAL */}
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>TOTAL</Text>
              <Text style={styles.footerValue}>{total.toLocaleString()}/-</Text>
            </View>

            {/* ADV */}
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>ADVANCE</Text>
              <Text style={styles.footerValue}>
                {(balanceAdvance || 0).toLocaleString()}/-
              </Text>
            </View>

            {/* BALANCE */}
            <View style={styles.balanceBox}>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceLabel]}>{data.balanceLabel}</Text>
                <Text style={styles.balanceValue}>
                  {balance < 0
                    ? `${Math.abs(balance).toLocaleString()}`
                    : balance.toLocaleString()}
                  /-
                </Text>
              </View>
            </View>
          </View>

          {/* Page number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      </Document>
    </PDFViewer>
  );
};
