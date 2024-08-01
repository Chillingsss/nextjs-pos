import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

function KeybindsTable() {
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2">
      <Card className="sm:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Keybinds</CardTitle>
          <div className="max-w-lg text-balance leading-relaxed">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sm:table-cell">Title</TableHead>
                    <TableHead className="sm:table-cell">Key</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-accent">
                    <TableCell>
                      <div >Enter Barcode</div>
                    </TableCell>
                    <TableCell>
                      <div >Ctrl + F1</div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-accent">
                    <TableCell>
                      <div>Cash Received Entry</div>
                    </TableCell>
                    <TableCell>
                      <div >Ctrl + F2</div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-accent">
                    <TableCell>
                      <div >Switch Theme</div>
                    </TableCell>
                    <TableCell>
                      <div >Ctrl + F12</div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardHeader>
      </Card>

    </div>
  );
}

export default KeybindsTable;
