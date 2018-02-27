import {PureComponent, Component, ReactNode, MouseEventHandler} from "react";

declare namespace ReactDataSheet {
    export interface Cell {
        //dataEditor
        className?: string | undefined;
        component?: JSX.Element; //this enables the example code in the readme, but the description seems to imply that you can also pass a component in.
        colSpan?: number;
        forceComponent?: boolean;
        key?: string | undefined;
        //disableEvents
        overflow?: 'wrap' | 'nowrap' | 'clip';
        readOnly?: boolean;
        rowSpan?: number;
        // valueViewer?: ValueViewer<T>;
        width: number | string;
    }

    export interface DataSheetProps<T extends Cell> {
        attributesRenderer?: AttributesRenderer<T>;
        /** Optional function or React Component to render each cell element. The default renders a td element. */
        cellRenderer?: CellRenderer<T>;
        className?: string;
        /** Array of rows and each row should contain the cell objects to display */
        data: T[][];
        /** Optional function or React Component to render a custom editor. Affects every cell in the sheet. Affects every cell in the sheet. See cell options to override individual cells. */
        //dataEditor
        /** Method to render the underlying value of the cell function(cell, i, j). This data is visible once in edit mode. */
        dataRenderer?: DataRenderer<T>;
        /** onCellsChanged handler: function(arrayOfChanges[, arrayOfAdditions]) {}, where changes is an array of objects of the shape {cell, row, col, value} */
        onCellsChanged?: CellsChangedHandler<T>;
        /** Context menu handler : function(event, cell, i, j) */
        onContextMenu?: (event: MouseEvent, cell: T, i : number, j: number) => any;
        onSelect?: (cell: T) => void;
        /** Grid default for how to render overflow text in cells */
        overflow?: 'wrap' | 'nowrap' | 'clip';
        /** Optional function or React Component to render each row element. The default renders a tr element. */
        rowRenderer?: RowRenderer<T>;
        /** If set, the function will be called with the raw clipboard data. It should return an array of arrays of strings. This is useful for when the clipboard may have data with irregular field or line delimiters. If not set, rows will be split with line breaks and cells with tabs. */
        //parsePaste
        /** Optional function or React Component to render the main sheet element. The default renders a table element. */
        sheetRenderer?: SheetRenderer<T>;
        /** Method to render the value of the cell function(cell, i, j). This is visible by default */
        valueRenderer: ValueRenderer<T>;
        /** Optional function or React Component to customize the way the value for each cell in the sheet is displayed. Affects every cell in the sheet. See cell options to override individual cells. */
        valueViewer?: ValueViewer<T>;
    }

    export type ValueRenderer<T extends Cell> = (cell: T, row: number, col: number) => string | number | null | void;

    export type DataRenderer<T extends Cell> = (cell: T, row: number, col: number) => string | number | null | void;

    export type AttributesRenderer<T extends Cell> = (cell: T, row: number, col: number) => {};

    export type SheetRenderer<T extends Cell> = (props: SheetRendererArgs<T>) => JSX.Element;
    
    export interface SheetRendererArgs<T extends Cell> {
        /** The same data array as from main ReactDataSheet component */
        data: T[][];
        /** Classes to apply to your top-level element. You can add to these, but your should not overwrite or omit them unless you want to implement your own CSS also. */
        className: string;
        /** The regular react props.children. You must render {props.children} within your custom renderer or you won't see your rows and cells. */
        children: ReactNode;
    }

    export type RowRenderer<T extends Cell> = (props: RowRendererArgs<T>) => JSX.Element;

    export interface RowRendererArgs<T extends Cell> {
        /** The current row index */
        row: number;
        /** The cells in the current row */
        cells: T[];
        /** The regular react props.children. You must render {props.children} within your custom renderer or you won't see your cells. */
        children: ReactNode;
    }

    export type CellsChangedHandler<T extends Cell> = (arrayOfChanges: CellsChangedArgs<T>, arrayOfAdditions?: CellAdditionsArgs<T>) => void;

    export type CellsChangedArgs<T extends Cell> = {
        cell: T;
        row: number;
        col: number;
        value: string | number | null; //is this ever undefined?
    }[];

    export type CellAdditionsArgs<T extends Cell> = {
        row: number;
        col: number;
        value: string | number | null; //is this ever undefined?
    }[];

    export interface CellRendererArgs<T extends Cell> {
        /** The current row index */
        row: number;
        /** The current column index */
        col: number;
        /** The cell's raw data structure */
        cell: T;
        /** Classes to apply to your cell element. You can add to these, but your should not overwrite or omit them unless you want to implement your own CSS also. */
        className: string;
        /** Generated styles that you should apply to your cell element. This may be null or undefined. */
        style: object | null | undefined;
        /** Is the cell currently selected */
        selected: boolean;
        /**	Is the cell currently being edited */
        editing: boolean;
        /** Was the cell recently updated */
        updated: boolean;
        /** As for the main ReactDataSheet component */
        attributesRenderer: AttributesRenderer<T>;
        /** Event handler: important for cell selection behavior */
        onMouseDown: MouseEventHandler<HTMLElement>;
        /** Event handler: important for cell selection behavior */
        onMouseOver: MouseEventHandler<HTMLElement>;
        /** Event handler: important for editing */
        onDoubleClick: MouseEventHandler<HTMLElement>;
        /** Event handler: to launch default content-menu handling. You can safely ignore this handler if you want to provide your own content menu handling. */
        onContextMenu: MouseEventHandler<HTMLElement>;
        /** The regular react props.children. You must render {props.children} within your custom renderer or you won't your cell's data. */
        children: ReactNode; //Array or component
    }
    
    export type CellRenderer<T extends Cell> = (props: CellRendererArgs<T>) => JSX.Element;

    export interface ValueViewerArgs<T extends Cell> {
        /** The result of the valueRenderer function */
        value: ReactNode;
        /** The current row index */
        row: number;
        /** The current column index */
        col: number;	
        /** The cell's raw data structure */
        cell: T;
    }

    export type ValueViewer<T extends Cell> = (props: ValueViewerArgs<T>) => JSX.Element;

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

declare class ReactDataSheet<T extends ReactDataSheet.Cell> extends Component<ReactDataSheet.DataSheetProps<T>, ReactDataSheet.DataSheetState> {
        getSelectedCells: (data: T[][], start: ReactDataSheet.CellReference, end: ReactDataSheet.CellReference) => {cell: T, row: number, col: number};
}

export default ReactDataSheet;