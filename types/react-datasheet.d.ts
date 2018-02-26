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
        valueRenderer: (cell: T) => string | number | void;
        dataRenderer?: (cell: T) => string | number | void;
        onChange?: (cell: T, row: number, col: number, newValue: string) => any;
        onContextMenu?: (event: MouseEvent, cell: T, i : number, j: number) => any;
        onCellsChanged?: (arrayOfChanges: {cell: T, row: number, col: number, value: any}[]) => void;
        sheetRenderer: (props: SheetRendererArgs<T>) => JSX.Element;
        rowRenderer: (props: RowRendererArgs<T>) => JSX.Element;
    }

    export interface SheetRendererArgs<T> {
        data: T[][];
        className: string;
        children: ReactNode[];
    }

    export interface RowRendererArgs<T> {
        row: number;
        cells: T[];
        children: ReactNode[];
    }

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