import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('idr');
    if (!id) {
      return new Response(JSON.stringify({ error: "Id Alınamadı" }), { status: 400 });
    }

    // ID ile eşleşen product verisini al
    let res = await prisma.product.findUnique({
      where: { id: id.toString() }, // ID numara tipinde olmalı
    });

    if (!res) {
      return new Response(JSON.stringify({ error: "ürün bulunamadı" }), { status: 404 });
    }

    return new Response(JSON.stringify(res));
  } catch (error) {
    return new Response(JSON.stringify({ error: "server hatası:"+error }), { status: 500 });
  }
}
