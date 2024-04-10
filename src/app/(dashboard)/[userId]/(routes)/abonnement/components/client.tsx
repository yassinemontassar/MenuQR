"use client";

import { useParams, useRouter } from "next/navigation";
import { PlanColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface PlanClientProps {
  data: PlanColumn[];
}

export const PlanClient: React.FC<PlanClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between mt-20 p-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Abonnement</h2>
          <p className="text-sm text-muted-foreground">
            Cette table présente les détails de votre abonnement, y compris le
            nom de l abonnement, la date de début et la date d expiration.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
