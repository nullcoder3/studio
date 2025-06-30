
"use client";

import { useRouter } from "next/navigation";
import { useMaterials } from "@/hooks/use-materials";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PackagePlus, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MaterialsPage() {
  const { materials, isLoading } = useMaterials();
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 animate-fade-in-down gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline flex items-center gap-3">
            <HardHat className="h-10 w-10" />
            Materials Inventory
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            A list of all materials in the workshop.
          </p>
        </div>
        <div>
          <Button 
            className="w-full md:w-auto"
            onClick={() => router.push('/add-material')}
          >
            <PackagePlus />
            Add New Material
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Materials</CardTitle>
          <CardDescription>Browse and manage all workshop materials.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material Name</TableHead>
                <TableHead>Material Code</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead>Ownership</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : materials.length > 0 ? (
                materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.materialCode}</TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell className="text-right">{material.stockQuantity ?? 0}</TableCell>
                    <TableCell>
                      {material.ownership === 'Railway' ? (
                         <Badge variant="secondary">Railway (R)</Badge>
                      ) : (
                        <Badge variant="outline">SSWPI (S)</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No materials found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
