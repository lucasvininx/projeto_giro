import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Operation from "@/models/operation";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    await dbConnect();

    // Build query
    const query: any = { userId };

    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { number: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    // Fetch operations
    const operations = await Operation.find(query).sort({ createdAt: -1 });

    return NextResponse.json(operations);
  } catch (error) {
    console.error("Error fetching operations:", error);
    return NextResponse.json(
      { error: "Erro ao buscar operações" },
      { status: 500 }
    );
  }
}
