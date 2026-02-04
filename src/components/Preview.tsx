import React, { useEffect, useState } from "react";
import { usePDF } from "@react-pdf/renderer";
import { DocumentData } from "../../util/types";
import { MyDocument } from "./mydocument";

// 2. Main Preview Component
export const Preview = ({ data }: { data: DocumentData }) => {
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {!isMobile && (
        <iframe
          src={instance.url || ""}
          style={{ width: "100%", flex: 1, border: "none" }}
          title="PDF Preview"
        />
      )}

      {/* Mobile View / Fallback Actions */}
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "white",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isMobile && (
          <div style={{ marginBottom: 10, color: "#666" }}>
            Preview is hidden on mobile devices.
          </div>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          {/* View Button - Critical for Mobile */}
          <a
            href={instance.url || "#"}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 24px",
              background: "#007bff",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            {isMobile ? "Open PDF Preview" : "Open in New Tab"}
          </a>

          {/* Download Button */}
          <a
            href={instance.url || "#"}
            download={`${formatDate(data.date)}_expense.pdf`}
            style={{
              padding: "12px 24px",
              background: "navy",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              display: "inline-block",
            }}
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};
