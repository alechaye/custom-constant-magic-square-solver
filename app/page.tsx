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
        magic square. The challenge is to fill the numbers 1 to 16 without
        repeating them in the white cells to make the sum of each row and column
        equal to the constants (green cells).
      </Typography.Paragraph>
      <MatrixForm />
    </main>
  );
}
