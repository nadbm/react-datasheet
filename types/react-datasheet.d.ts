import { Component, ReactNode, MouseEventHandler} from "react";

declare namespace ReactDataSheet {
    /** The cell object is what gets passed to the callbacks and events, and contains the basic information about what to show in each cell. You should extend this interface to build a place to store your data.
     * @example
     * interface GridElement extends ReactDataSheet.Cell<GridElement> {
     *      value: number | string | null;
     * }
     */ 
    export interface Cell<T extends Cell<T>> {
        /** Optional function or React Component to render a custom editor. Overrides grid-level dataEditor option. Default: undefined. */
        dataEditor?: DataEditor<T>
        /** Additional class names for cells. Default: undefined. */
        className?: string | undefined;
        /** Insert a react element or JSX to this field. This will render on edit mode. Default: undefined. */
        component?: JSX.Element;
        /** The colSpan of the cell's td element. Default: 1 */
        colSpan?: number;
        /** If true, renders what's in component at all times, even when not in edit mode. Default: false. */
        forceComponent?: boolean;
        /** By default, each cell is given the key of col number and row number. This would override that key. Default: undefined. */
        key?: string | undefined;
        /** Makes cell unselectable and read only. Default: false. */
        disableEvents?: boolean;
        /** How to render overflow text. Overrides grid-level overflow option. Default: undefined. */
        overflow?: 'wrap' | 'nowrap' | 'clip';
        /** If true, the cell will never go in edit mode. Default: false. */
        readOnly?: boolean;
        /** The rowSpan of the cell's td element. Default: 1. */
        rowSpan?: number;
        /** Optional function or React Component to customize the way the value for this cell is displayed. Overrides grid-level valueViewer option. Default: undefined. */
        valueViewer?: ValueViewer<T>;
        /** Sets the cell's td width using a style attribute. Number is interpreted as pixels, strings are used as-is. Note: This will only work if the table does not have a set width. Default: undefined. */
        width?: number | string;
    }

    /** Properties of the ReactDataSheet component. */
    export interface DataSheetProps<T extends Cell<T>> {
        /** Optional function to add attributes to the rendered cell element. It should return an object with properties corresponding to the name and vales of the attributes you wish to add. */
        attributesRenderer?: AttributesRenderer<T>;
        /** Optional function or React Component to render each cell element. The default renders a td element. */
        cellRenderer?: CellRenderer<T>;
        className?: string;
        /** Array of rows and each row should contain the cell objects to display. */
        data: T[][];
        /** Optional function or React Component to render a custom editor. Affects every cell in the sheet. Affects every cell in the sheet. See cell options to override individual cells. */
        dataEditor?: DataEditor<T>;
        /** Method to render the underlying value of the cell function(cell, i, j). This data is visible once in edit mode. */
        dataRenderer?: DataRenderer<T>;
        /** onCellsChanged handler: function(arrayOfChanges[, arrayOfAdditions]) {}, where changes is an array of objects of the shape {cell, row, col, value}. */
        onCellsChanged?: CellsChangedHandler<T>;
        /** Context menu handler : function(event, cell, i, j). */
        onContextMenu?: ContextMenuHandler<T>;
        onSelect?: (cell: T) => void;
        /** Grid default for how to render overflow text in cells. */
        overflow?: 'wrap' | 'nowrap' | 'clip';
        /** Optional function or React Component to render each row element. The default renders a <tr> element. */
        rowRenderer?: RowRenderer<T>;
        /** If set, the function will be called with the raw clipboard data. It should return an array of arrays of strings. This is useful for when the clipboard may have data with irregular field or line delimiters. If not set, rows will be split with line breaks and cells with tabs. */
        parsePaste?: PasteParser;
        /** Optional function or React Component to render the main sheet element. The default renders a table element. */
        sheetRenderer?: SheetRenderer<T>;
        /** Method to render the value of the cell function(cell, i, j). This is visible by default. */
        valueRenderer: ValueRenderer<T>;
        /** Optional function or React Component to customize the way the value for each cell in the sheet is displayed. Affects every cell in the sheet. See cell options to override individual cells. */
        valueViewer?: ValueViewer<T>;
    }

    /** A function to process the raw clipboard data. It should return an array of arrays of strings. This is useful for when the clipboard may have data with irregular field or line delimiters. If not set, rows will be split with line breaks and cells with tabs. To wire it up pass your function to the parsePaste property of the ReactDataSheet component. */
    export type PasteParser = (pastedString: string) => string[][];

    /** A function to render the value of the cell function(cell, i, j). This is visible by default. To wire it up, pass your function to the valueRenderer property of the ReactDataSheet component. */
    export type ValueRenderer<T extends Cell<T>> = (cell: T, row: number, col: number) => string | number | null | void;

    /** A function to render the underlying value of the cell. This data is visible once in edit mode.  To wire it up, pass your function to the dataRenderer property of the ReactDataSheet component. */
    export type DataRenderer<T extends Cell<T>> = (cell: T, row: number, col: number) => string | number | null | void;

    /** A function to add attributes to the rendered cell element. It should return an object with properties corresponding to the name and vales of the attributes you wish to add. To wire it up, pass your function to the attributesRenderer property of the ReactDataSheet component. */
    export type AttributesRenderer<T extends Cell<T>> = (cell: T, row: number, col: number) => {};
    
    /** The properties that will be passed to the SheetRenderer component or function. */
    export interface SheetRendererProps<T extends Cell<T>> {
        /** The same data array as from main ReactDataSheet component */
        data: T[][];
        /** Classes to apply to your top-level element. You can add to these, but your should not overwrite or omit them unless you want to implement your own CSS also. */
        className: string;
        /** The regular react props.children. You must render {props.children} within your custom renderer or you won't see your rows and cells. */
        children: ReactNode;
    }

    /** Optional function or React Component to render the main sheet element. The default renders a table element. To wire it up, pass your function to the sheetRenderer property of the ReactDataSheet component. */
    export type SheetRenderer<T extends Cell<T>> = React.ComponentClass<SheetRendererProps<T>> | React.SFC<SheetRendererProps<T>>;

    /** The properties that will be passed to the RowRenderer component or function. */
    export interface RowRendererProps<T extends Cell<T>> {
        /** The current row index */
        row: number;
        /** The cells in the current row */
        cells: T[];
        /** The regular react props.children. You must render {props.children} within your custom renderer or you won't see your cells. */
        children: ReactNode;
    }

    /** Optional function or React Component to render each row element. The default renders a tr element. To wire it up, pass your function to the rowRenderer property of the ReactDataSheet component. */
    export type RowRenderer<T extends Cell<T>> = React.ComponentClass<RowRendererProps<T>> | React.SFC<RowRendererProps<T>>;

    /** The arguments that will be passed to the first parameter of the onCellsChanged handler function. These represent all the changes _inside_ the bounds of the existing grid. The first generic parameter (required) indicates the type of the cell property, and the second generic parameter (default: string) indicates the type of the value property. */
    export type CellsChangedArgs<T extends Cell<T>, V = string> = {
        /** the original cell object you provided in the data property. This may be null */
        cell: T | null;
        /** row index of changed cell */
        row: number;
        /** column index of changed cell */
        col: number;
        /** The new cell value. This is usually a string, but a custom editor may provide any type of value. */
        value: V | null;
    }[];

    /** The arguments that will be passed to the second parameter of the onCellsChanged handler function. These represent all the changes _outside_ the bounds of the existing grid. The  generic parameter (default: string) indicates the type of the value property. */
    export type CellAdditionsArgs<V = string> = {
        row: number;
        col: number;
        value: V | null;
    }[];

    /** onCellsChanged handler: function(arrayOfChanges[, arrayOfAdditions]) {}, where changes is an array of objects of the shape {cell, row, col, value}. To wire it up, pass your function to the onCellsChanged property of the ReactDataSheet component. */
    export type CellsChangedHandler<T extends Cell<T>> = (arrayOfChanges: CellsChangedArgs<T>, arrayOfAdditions?: CellAdditionsArgs<T>) => void;

    /** Context menu handler : function(event, cell, i, j). To wire it up, pass your function to the onContextMenu property of the ReactDataSheet component. */
    export type ContextMenuHandler<T extends Cell<T>> = (event: MouseEvent, cell: T, row : number, col: number) => void;

    /** The properties that will be passed to the CellRenderer component or function. */
    export interface CellRendererProps<T extends Cell<T>> {
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
        /** Is the cell currently being edited */
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
        children: ReactNode;
    }
    
    /** A function or React Component to render each cell element. The default renders a td element. To wire it up, pass it to the cellRenderer property of the ReactDataSheet component.  */
    export type CellRenderer<T extends Cell<T>> = React.ComponentClass<CellRendererProps<T>> | React.SFC<CellRendererProps<T>>;

    /** The properties that will be passed to the CellRenderer component or function. */
    export interface ValueViewerProps<T extends Cell<T>> {
        /** The result of the valueRenderer function */
        value: ReactNode;
        /** The current row index */
        row: number;
        /** The current column index */
        col: number;    
        /** The cell's raw data structure */
        cell: T;
    }

    /** Optional function or React Component to customize the way the value for each cell in the sheet is displayed. If it is passed to the valueViewer property of the ReactDataSheet component, it affects every cell in the sheet. Different editors can also be passed to the valueViewer property of each Cell to control each cell separately. */
    export type ValueViewer<T extends Cell<T>> = React.ComponentClass<ValueViewerProps<T>> | React.SFC<ValueViewerProps<T>>;

    /** The properties that will be passed to the DataEditor component or function. */
    export interface DataEditorProps<T> {
        /** The result of the dataRenderer (or valueRenderer if none) */
        value: string | JSX.Element;
        /** The current row index */
        row: number;
        /** The current column index */
        col: number;
        /** The cell's raw data structure */
        cell: T;
        /** A callback for when the user changes the value during editing (for example, each time they type a character into an input). onChange does not indicate the final edited value. It works just like a controlled component in a form. */
        onChange: (newValue: string) => void;
        /** An event handler that you can call to use default React-DataSheet keyboard handling to signal reverting an ongoing edit (Escape key) or completing an edit (Enter or Tab). For most editors based on an input element this will probably work. However, if this keyboard handling is unsuitable for your editor you can trigger these changes explicitly using the onCommit and onRevert callbacks. */
        onKeyDown: React.KeyboardEventHandler<HTMLElement>;
        /** function (newValue, [event]) {} A callback to indicate that editing is over, here is the final value. If you pass a KeyboardEvent as the second argument, React-DataSheet will perform default navigation for you (for example, going down to the next row if you hit the enter key). You actually don't need to use onCommit if the default keyboard handling is good enough for you. */
        onCommit: (newValue: string | JSX.Element, event: React.KeyboardEvent<HTMLElement>) => void;
        /** function () {} A no-args callback that you can use to indicate that you want to cancel ongoing edits. As with onCommit, you don't need to worry about this if the default keyboard handling works for your editor. */
        onRevert: () => void;
    }

    /** A function or React Component to render a custom editor. If it is passed to the dataEditor property of the ReactDataSheet component, it affects every cell in the sheet. Different editors can also be passed to the dataEditor property of each Cell to control each cell separately. */
    export type DataEditor<T extends Cell<T>> = React.ComponentClass<DataEditorProps<T>> | React.SFC<ValueViewerProps<T>>;

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

declare class ReactDataSheet<T extends ReactDataSheet.Cell<T>> extends Component<ReactDataSheet.DataSheetProps<T>, ReactDataSheet.DataSheetState> {
        getSelectedCells: (data: T[][], start: ReactDataSheet.CellReference, end: ReactDataSheet.CellReference) => {cell: T, row: number, col: number};
}

export default ReactDataSheet;