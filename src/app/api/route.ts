import Stripe from "stripe";

export const runtime = "nodejs";

const key = process.env.STRIPE_SECRET_KEY

if (!key) {
    throw new Error("Falta la clave pública de Stripe");
}

const stripe = new Stripe(key , {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {

  console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

  try {
    const { name, price } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: { name },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000",
      cancel_url: "http://localhost:3000",
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return new Response("Error creating session", { status: 500 });
  }
}