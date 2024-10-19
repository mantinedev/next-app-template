import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any) {
  try {
              const url = new URL(req.url);
    const pathSegments = url.pathname.split('/'); // '/' ile ayır
    const id = pathSegments[pathSegments.length - 1]; // Son segmenti al
    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
    }

    // ID ile eşleşen product verisini al
    let res = await prisma.product.findUnique({
      where: { id: id.toString() }, // ID numara tipinde olmalı
    });

    if (!res) {
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(res));
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
