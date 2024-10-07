import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Table() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border rounded-lg p-2">
        <ShadTable>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>João</TableCell>
              <TableCell>123456</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>2</TableCell>
              <TableCell>Maria</TableCell>
              <TableCell>654321</TableCell>
            </TableRow>
          </TableBody>
        </ShadTable>
      </div>
    </div>
  );
}
