"use client";

import { Input } from "antd";
import React from "react";

interface ICellProps {
  type?: "default" | "success";
  value?: number | undefined | null;
  onChange: (value: number | undefined | null) => void;
  onBlur: () => void;
  disabled?: boolean;
}

const ICell: React.FC<ICellProps> = ({
  value,
  type = "default",
  onChange,
  onBlur,
  disabled = false,
}) => {
  const cellStyle = {
    width: "48px",
    height: "48px",
    padding: "0",
    "text-align": "center",
    "font-size": "16px",
    "background-color":
      type === "success" ? "#f6ffed" : disabled ? "#f5f5f5" : "white",
    "border-color": type === "success" ? "#b7eb8f" : "#d9d9d9",
    "border-width": "1px",
    "border-style": "solid",
    color: disabled ? "#595959" : "black",
  };
  return (
    <Input
      style={cellStyle}
      value={value ? value : undefined}
      disabled={disabled}
      type='string'
      onChange={(e) =>
        onChange(Number(e.target.value) ? Number(e.target.value) : undefined)
      }
      onBlur={onBlur}
    />
  );
};

export default ICell;
