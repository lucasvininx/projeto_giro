import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Operation from "@/models/operation";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await req.json();

    await dbConnect();

    // Get the count of existing operations to generate a new number
    const count = await Operation.countDocuments();
    const operationNumber = `OP${(count + 1).toString().padStart(3, "0")}`;

    // Add userId and number to the operation data
    const operationData = {
      ...data,
      userId,
      number: operationNumber,
      status: "Pré-Análise", // Default status for new operations
    };

    const operation = await Operation.create(operationData);

    return NextResponse.json(operation, { status: 201 });
  } catch (error) {
    console.error("Error creating operation:", error);
    return NextResponse.json(
      { error: "Erro ao criar operação" },
      { status: 500 }
    );
  }
}
