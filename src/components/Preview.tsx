import React, { useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  usePDF, // Use the hook instead of PDFViewer
} from "@react-pdf/renderer";
import { DocumentData } from "../../util/types";

const mm = (v: number) => v * 2.835;

// Keep your existing styles as they are
const styles = StyleSheet.create({
  page: { paddingVertical: mm(15), paddingHorizontal: mm(20) },
  header: { marginBottom: mm(10) },
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
  list: { fontSize: 14 },
  item: { marginBottom: mm(6), fontSize: 14, letterSpacing: 1.5 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    letterSpacing: 1.5,
    fontWeight: "semibold",
  },
  titleCol: { flex: 1, paddingRight: mm(4) },
  amountCol: {
    width: mm(30),
    textAlign: "right",
    fontSize: 14,
    letterSpacing: 1.5,
    fontWeight: "semibold",
  },
  jobTitle: { fontSize: 14, fontWeight: "bold" },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: mm(7),
    fontSize: 13,
    paddingVertical: 3,
    letterSpacing: 1.5,
    color: "gray",
    fontWeight: "semibold",
  },
  footerWrap: {
    position: "absolute",
    bottom: mm(5),
    right: mm(17),
    width: mm(80),
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: mm(4),
    color: "gray",
    letterSpacing: 1.5,
    fontSize: 14,
    fontWeight: "semibold",
  },
  balanceBox: { borderTopWidth: 1, borderTopColor: "#000", paddingTop: mm(2) },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: "bold",
    fontSize: 14,
    letterSpacing: 1.5,
  },
  pageNumber: {
    position: "absolute",
    right: mm(10),
    top: mm(5),
    fontSize: 9,
    color: "#666",
  },
});

// 1. Separate the Document into its own component
const MyDocument = ({
  data,
  total,
  balanceAdvance,
  balance,
  formatDate,
}: any) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text>{data.headerTitle}</Text>
          <Text>{data.name}</Text>
          <Text>{formatDate(data.date)}</Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View style={styles.advBox}>
            <Text>
              {data.balanceAmount ? `Bal - ${data.balanceAmount}/-` : ""}
            </Text>
            <Text>
              {data.balanceDate ? `(${formatDate(data.balanceDate)})` : ""}
            </Text>
          </View>
          {data.balanceAmount && data.advanceAmount && (
            <Text style={{ marginTop: 15, fontSize: 20, marginHorizontal: 15 }}>
              +
            </Text>
          )}
          <View style={styles.advBox}>
            <Text>
              {data.advanceAmount ? `Adv - ${data.advanceAmount}/-` : ""}
            </Text>
            <Text>
              {data.advanceDate ? `(${formatDate(data.advanceDate)})` : ""}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.list}>
        {data.expenses.map((expense: any, idx: number) => (
          <View key={expense.id} style={styles.item}>
            <View style={styles.row}>
              <Text
                style={[
                  styles.titleCol,
                  expense.type === "job" ? styles.jobTitle : {},
                ]}
              >
                {idx + 1}.{" "}
                {expense.type === "job" ? expense.title : expense.label}{" "}
                {expense.date && `(${formatDate(expense.date)})`}
              </Text>
              <Text style={styles.amountCol}>
                {(expense.type === "job"
                  ? expense.baseAmount
                  : expense.amount
                ).toLocaleString()}
              </Text>
            </View>
            {expense.subExpenses?.map((sub: any) => (
              <View key={sub.id} style={styles.subRow}>
                <Text>{sub.label}</Text>
                <Text>{sub.amount.toLocaleString()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.footerWrap} wrap={false}>
        <View style={styles.footerRow}>
          <Text>TOTAL</Text>
          <Text>{total.toLocaleString()}/-</Text>
        </View>
        <View style={styles.footerRow}>
          <Text>ADVANCE</Text>
          <Text>{(balanceAdvance || 0).toLocaleString()}/-</Text>
        </View>
        <View style={styles.balanceBox}>
          <View style={styles.balanceRow}>
            <Text>{data.balanceLabel}</Text>
            <Text>
              {balance < 0
                ? Math.abs(balance).toLocaleString()
                : balance.toLocaleString()}
              /-
            </Text>
          </View>
        </View>
      </View>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} / ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

// 2. Main Preview Component
export const Preview = ({ data }: { data: DocumentData }) => {
  // 1. Calculations
  const total = data.expenses.reduce((acc, curr) => {
    if (curr.type === "job")
      return (
        acc +
        curr.baseAmount +
        (curr.subExpenses?.reduce((s, c) => s + c.amount, 0) || 0)
      );
    return curr.type === "simple" ? acc + curr.amount : acc;
  }, 0);

  const balanceAdvance = (data.balanceAmount || 0) + (data.advanceAmount || 0);
  const balance = balanceAdvance - total;

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear().toString().slice(-2)}`;
  };

  // 2. Define the document as a variable
  const myDoc = (
    <MyDocument
      data={data}
      total={total}
      balanceAdvance={balanceAdvance}
      balance={balance}
      formatDate={formatDate}
    />
  );

  // 3. The Hook (Must be inside the component)
  const [instance, updateInstance] = usePDF({ document: myDoc });

  // 4. Update whenever data changes
  React.useEffect(() => {
    updateInstance(myDoc);
  }, [data]);

  // 5. Check for instance availability
  if (instance.loading) return <div>Generating PDF...</div>;
  if (instance.error) return <div>Error generating PDF: {instance.error}</div>;

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* The URL is found at instance.url */}
      <iframe
        src={instance.url || ""}
        style={{ width: "100%", flex: 1, border: "none" }}
      />

      <div style={{ padding: "10px", textAlign: "center" }}>
        <a
          href={instance.url || "#"}
          download="document.pdf"
          style={{
            padding: "10px 20px",
            background: "blue",
            color: "white",
            borderRadius: "5px",
          }}
        >
          Download PDF
        </a>
      </div>
    </div>
  );
};
