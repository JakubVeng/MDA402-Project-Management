import { type Header, flexRender, type Cell } from '@tanstack/react-table';
import { type PropsWithChildren } from 'react';

export const Table = ({ children }: PropsWithChildren) => (
	<table className="min-w-full overflow-auto">{children}</table>
);

export const TableHead = ({ children }: PropsWithChildren) => (
	<thead className="bg-gray-800 text-white">{children}</thead>
);

export const TableRow = ({ children }: PropsWithChildren) => (
	<tr className="even:bg-gray-100">{children}</tr>
);

export const TableHeaderCell = <T,>({
	header
}: {
	header: Header<T, unknown>;
}) => (
	<th className="text-left">
		{flexRender(header.column.columnDef.header, header.getContext())}
	</th>
);

export const TableBody = ({ children }: PropsWithChildren) => (
	<tbody>{children}</tbody>
);

type TableDataCellProps<T> = {
	cell: Cell<T, unknown>;
  }

export const TableDataCell = <T,>({ cell }: TableDataCellProps<T>) => {
	return (
		<td
			style={{
				width: cell.column.getSize()
			}}
		>
			{flexRender(cell.column.columnDef.cell, cell.getContext())}
		</td>
	);
};