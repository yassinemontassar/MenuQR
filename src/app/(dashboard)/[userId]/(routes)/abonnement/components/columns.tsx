"use client"

import { ColumnDef } from "@tanstack/react-table"

export type PlanColumn = {
  id: string
  name: string
  createdAt: string
  expirePlan: string;
}

export const columns: ColumnDef<PlanColumn>[] = [
  {
    accessorKey: "name",
    header: "Plan",
    cell:  ({row}) => row.original.name,
  },
  {
    accessorKey: "createdAt",
    header: "Début de Plan",
    cell:  ({row}) => row.original.createdAt,
  },
  {
    accessorKey: "Expiration",
    header: "Fin",
    cell:  ({row}) => row.original.expirePlan,
  },


]
