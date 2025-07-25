import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteWithLog } from "../../../../../utils/deleteWithLog";

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const result = await deleteWithLog(prisma, "user", id);

  if (result.ok) {
    return NextResponse.json({ message: "User deleted" });
  }

  return NextResponse.json(
    { error: "Erreur suppression user" },
    { status: 500 }
  );
}
