import React, { useEffect, useRef } from 'react';
import { TableComponents, TableVirtuoso, TableVirtuosoHandle } from 'react-virtuoso';

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface GeneralTableProps {
    headers: string[];
    tables: string[][];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSelectedFeature: (feature: any) => void; // Click on a row to select a feature
    selectedRowIndex: number;
    id?: string;
    style?: React.CSSProperties; // Add style as an optional prop
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderCell?: (rowData: any, rowIndex: number, columnIndex: number) => React.ReactNode; // A custom funtion to render cell
}

/*
 * General table template.
 */
const GeneralTable: React.FC<GeneralTableProps> = ({
    headers,
    tables,
    updateSelectedFeature,
    selectedRowIndex,
    renderCell,
    ...props
}) => {
    // Add useRef for table ref
    const tableRef = useRef<TableVirtuosoHandle>(null);

    // Scroll to row on selectedRowIndex change
    useEffect(() => {
        if (tableRef.current && selectedRowIndex && selectedRowIndex !== -1 && selectedRowIndex !== 0) {
            tableRef.current.scrollIntoView({ index: selectedRowIndex, align: 'center', behavior: 'smooth' });
        }
    }, [selectedRowIndex]);

    //The table headers
    const fixedHeaderContent = () => {
        return (
            <TableRow>
                {headers.map((header) => (
                    <TableCell
                        key={header}
                        variant='head'
                        sx={{
                            backgroundColor: 'background.paper',
                        }}
                    >
                        {header}
                    </TableCell>
                ))}
            </TableRow>
        );
    };

    // The table rows
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowContent = (index: number, row: any[]) => {
        return (
            <React.Fragment>
                {row.map((entry, columnIndex) => {
                    const id = row[row.length - 1]; // The Id of the table is put on the last column
                    return (
                        <TableCell
                            key={id + columnIndex}
                            sx={{
                                backgroundColor: index === selectedRowIndex ? '#e3f7ff' : 'inherit',
                            }}
                            onClick={() => updateSelectedFeature(id)}
                        >
                            {renderCell ? renderCell(row, index, columnIndex) : entry}
                        </TableCell>
                    );
                })}
            </React.Fragment>
        );
    };

    return (
        <Paper {...props}>
            <TableVirtuoso
                data={tables}
                components={VirtuosoTableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
                ref={tableRef}
            />
        </Paper>
    );
};

// A part from VirtuosoTableComponents
const Scroller = React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
));
Scroller.displayName = 'Scroller';

// A part from VirtuosoTableComponents
const MyTableBody = React.forwardRef<HTMLTableSectionElement>((props, ref) => <TableBody {...props} ref={ref} />);
MyTableBody.displayName = 'MyTableBody';

/* eslint-disable @typescript-eslint/no-explicit-any */
const VirtuosoTableComponents: TableComponents<any> = {
    Scroller: Scroller,
    Table: (props) => (
        <Table {...props} size='small' sx={{ borderCollapse: 'separate', width: 'auto', tableLayout: 'auto' }} />
    ),
    TableHead,
    TableRow: ({ ...props }) => (
        <TableRow
            {...props}
            sx={{
                '&:hover': {
                    backgroundColor: '#e3f7ff',
                    cursor: 'pointer',
                },
            }}
        />
    ),
    TableBody: MyTableBody,
};

export { GeneralTable };
