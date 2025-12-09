import React from "react";
import prisma from "../../../lib/prisma";

export default async function Page({
  params,
}: {
  params: any;
}) {
  const { shareId } = params;
  const order = await prisma.cardOrder.findUnique({ where: { shareId } });

  if (!order || !order.paid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-panel text-center max-w-xl">
          <h2 className="text-2xl font-semibold">This card is not available</h2>
          <p className="mt-2 text-slate-300">Either it does not exist or payment hasn't completed.</p>
        </div>
      </div>
    );
  }

  const videoSrc = `/cards/${order.cardType}.mp4`;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <article className="card-panel max-w-2xl w-full">
        <div className="rounded-lg overflow-hidden bg-black">
          <video src={videoSrc} className="w-full h-64 object-cover" controls autoPlay muted loop playsInline />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">For {order.recipientName}</h3>
          <p className="mt-2 text-slate-200">{order.message}</p>
        </div>
        <footer className="mt-6 text-sm text-slate-400">A Living Tree Card 🌱</footer>
      </article>
    </main>
  );
}


