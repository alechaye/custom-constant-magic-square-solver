"use client";

import { Typography } from "antd";
import MatrixForm from "./MatrixForm";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
        padding: "8px",
      }}
    >
      <Typography.Title level={1} style={{ textAlign: "center" }}>
        Custom Constant Magic Square Solver
      </Typography.Title>
      <Typography.Paragraph style={{ textAlign: "center" }}>
        This is a custom constant magic square solver. It is a variation of a
        magic square. The challenge is to make that the sum of each row and
        column is equal to the constant, which is green.
      </Typography.Paragraph>
      <MatrixForm />
    </main>
  );
}
