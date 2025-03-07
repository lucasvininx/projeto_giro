import { type NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Operation from "@/models/operation";
import { getAuthSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;

    await dbConnect();

    const operation = await Operation.findOne({ _id: id, userId });

    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(operation);
  } catch (error) {
    console.error("Error fetching operation:", error);
    return NextResponse.json(
      { error: "Erro ao buscar operação" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;
    const data = await req.json();

    await dbConnect();

    // Find operation and verify ownership
    const operation = await Operation.findOne({ _id: id, userId });

    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 }
      );
    }

    // Update operation
    const updatedOperation = await Operation.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return NextResponse.json(updatedOperation);
  } catch (error) {
    console.error("Error updating operation:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar operação" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id } = params;

    await dbConnect();

    // Find operation and verify ownership
    const operation = await Operation.findOne({ _id: id, userId });

    if (!operation) {
      return NextResponse.json(
        { error: "Operação não encontrada" },
        { status: 404 }
      );
    }

    // Delete operation
    await Operation.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting operation:", error);
    return NextResponse.json(
      { error: "Erro ao excluir operação" },
      { status: 500 }
    );
  }
}
