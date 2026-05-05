import { NextResponse } from "next/server";
import { getProjectById, getProjectApprovals } from "@/lib/data/queries";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getProjectById(id)) {
    return NextResponse.json(
      { success: false, error: `Project ${id} not found.` },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, data: getProjectApprovals(id) });
}
