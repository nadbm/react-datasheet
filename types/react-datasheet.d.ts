import {PureComponent, Component, ReactElement, ReactNode} from "react";

declare namespace ReactDataSheet {
    export interface Cell {
        readOnly?: boolean;
        key?: string | undefined;
        className?: string | undefined;
        component?: Component<any, any>;
        forceComponent?: boolean;
        colSpan?: number;
        rowSpan?: number;
    }

    export interface DataSheetProps<T extends Cell> {
        data: T[][];
        className?: string;
        valueRenderer: ValueRenderer<T>;
        dataRenderer?: DataRenderer<T>;
        attributesRenderer?: AttributesRenderer<T>;
        onChange?: (cell: T, row: number, col: number, newValue: string) => any; //Deprecated!
        onContextMenu?: (event: MouseEvent, cell: T, i : number, j: number) => any;
        onCellsChanged?: (arrayOfChanges: CellsChangedArg<T>, arrayOfAdditions?: CellAdditionsArg<T>) => void;
        sheetRenderer?: SheetRenderer<T>;
        rowRenderer?: RowRenderer<T>;
        onSelect?: (cell: T) => void;
    }

    export type ValueRenderer<T extends Cell> = (cell: T, row: number, col: number) => string | number | null | void;

    export type DataRenderer<T extends Cell> = (cell: T, row: number, col: number) => string | number | null | void;

    export type AttributesRenderer<T extends Cell> = (cell: T, row: number, col: number) => {};

    export type SheetRenderer<T extends Cell> = (props: SheetRendererArgs<T>) => JSX.Element;
    
    export interface SheetRendererArgs<T extends Cell> {
        data: T[][];
        className: string;
        children: ReactNode[];
    }

    export type RowRenderer<T extends Cell> = (props: RowRendererArgs<T>) => JSX.Element;

    export interface RowRendererArgs<T extends Cell> {
        row: number;
        cells: T[];
        children: ReactNode[];
    }

    export type CellsChangedArg<T extends Cell> = {
        cell: T;
        row: number;
        col: number;
        value: string | number | null; //is this ever undefined?
    }[]

    export type CellAdditionsArg<T extends Cell> = {
        row: number;
        col: number;
        value: string | number | null; //is this ever undefined?
    }[]

    export interface CellReference {
        row: number;
        col: number;
    }

    export interface DataSheetState {
        start?: CellReference;
        end?: CellReference;
        selecting?: boolean;
        forceEdit?: boolean;
        editing?: CellReference;
        clear?: CellReference;
    }
}

declare class ReactDataSheet<T extends ReactDataSheet.Cell> extends PureComponent<ReactDataSheet.DataSheetProps<T>, ReactDataSheet.DataSheetState> {
        getSelectedCells: (data: T[][], start: ReactDataSheet.CellReference, end: ReactDataSheet.CellReference) => {cell: T, row: number, col: number};
}

export default ReactDataSheet;