import React, { useState } from "react";
import * as mathjs from "mathjs";
import Datasheet from "react-datasheet";

const fetchCells = {
  "00": { key: "0", value: "name", readOnly: true, expr: "" },
  "01": { key: "1", value: "one", readOnly: true, expr: "" },
  "02": { key: "2", value: "two", readOnly: true, expr: "" },
  "03": { key: "3", value: "three", readOnly: true, expr: "" },
  "04": { key: "4", value: "four", readOnly: true, expr: "" },
  A0: { key: "A0", value: "January", readOnly: true, expr: "" },
  A1: { key: "A1", value: "200", expr: "" },
  A2: {
    key: "A2",
    value: "200",
    expr: "=A1",
    readOnly: true
  },
  A3: { key: "A3", value: "", expr: "" },
  A4: { key: "A4", value: "", expr: "" },
  B0: { key: "B0", value: "February", readOnly: true, expr: "" },
  B1: { key: "B1", value: "", expr: "" },
  B2: { key: "B2", value: "", expr: "" },
  B3: { key: "B3", value: "", expr: "" },
  B4: { key: "B4", value: "", expr: "" },
  C0: { key: "C0", value: "March", readOnly: true, expr: "" },
  C1: { key: "C1", value: "", expr: "" },
  C2: { key: "C2", value: "", expr: "" },
  C3: { key: "C3", value: "", expr: "" },
  C4: { key: "C4", value: "", expr: "" },
  D0: { key: "D0", value: "April", readOnly: true, expr: "" },
  D1: { key: "D1", value: "", expr: "" },
  D2: { key: "D2", value: "", expr: "" },
  D3: { key: "D3", value: "", expr: "" },
  D4: { key: "D4", value: "", expr: "" }
};

export default () => {
  const [cells, setCells] = useState(fetchCells);

  const getCols = cells => [
    ...new Set(Object.keys(cells).map(cell => cell.charAt(0)))
  ];

  const getRows = cells =>
    Object.entries(cells)
      .filter(([key], idx) => +key.match(/.(\d+)/)[1] === idx)
      .map(([_, filtredCell]) => filtredCell);

  const generateGrid = () =>
    getRows(cells).map((row, i) =>
      getCols(cells).map((col, j) => {
        if (i === 0 && j === 0) {
          return { readOnly: true, value: row.value };
        }
        if (j === 0) {
          return { readOnly: true, value: row.value };
        }

        return cells[col + row.key];
      })
    );

  const validateExp = (trailKeys, expr) => {
    let valid = true;
    const matches = expr.match(/[A-Z][1-9]+/g) || [];
    matches.map(match => {
      if (trailKeys.indexOf(match) > -1) {
        valid = false;
      } else {
        valid = validateExp([...trailKeys, match], cells[match].expr);
      }
      return undefined;
    });
    return valid;
  };

  const computeExpr = (key, expr, scope) => {
    let value = null;
    if (expr.charAt(0) !== "=") {
      return { className: "", value: expr, expr: expr };
    } else {
      try {
        value = mathjs.evaluate(expr.substring(1), scope);
      } catch (e) {
        value = null;
      }

      if (value !== null && validateExp([key], expr)) {
        return { className: "equation", value, expr };
      } else {
        return { className: "error", value: "error", expr: "" };
      }
    }
  };

  const cellUpdate = (copyCells, changeCell, expr) => {
    const scope = Object.fromEntries(
      Object.entries(copyCells).map(([key, { value }]) => [
        key,
        isNaN(value) ? 0 : parseFloat(value)
      ])
    );

    const updatedCell = Object.assign(
      {},
      changeCell,
      computeExpr(changeCell.key, expr, scope)
    );

    copyCells[changeCell.key] = updatedCell;

    Object.values(copyCells).forEach(cell => {
      if (
        cell.expr.charAt(0) === "=" &&
        cell.expr.indexOf(changeCell.key) > -1 &&
        cell.key !== changeCell.key
      ) {
        copyCells = cellUpdate(copyCells, cell, cell.expr);
      }
    });

    return copyCells;
  };

  const onCellsChanged = changes => {
    const copyCells = { ...cells };

    changes.forEach(({ cell, value }) => {
      cellUpdate(copyCells, cell, value);
    });

    setCells(copyCells);
  };

  return (
    <Datasheet
      data={generateGrid()}
      valueRenderer={cell => cell.value}
      dataRenderer={cell => cell.expr}
      onCellsChanged={onCellsChanged}
    />
  );
};
