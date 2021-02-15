import React from 'react';
import { CellShape } from './Cell';

interface RowProps {
  row: number;
  cells: CellShape[];
  children: React.ReactNode;
}

const Row = (props: RowProps) => {
  return <tr>{props.children}</tr>;
};

export default Row;
