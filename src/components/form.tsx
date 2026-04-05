"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!key) {
    throw new Error("Falta la clave pública de Stripe");
}

const stripePromise = loadStripe(key);

export default function Form() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                price: Number(price) * 100, // convertir a centavos
            }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Backend error:", text);
            return;
        }

        const data = await res.json();

        console.log("URL de Stripe:", data.url);

        // Redirección directa
        window.location.href = data.url;
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Pago de prueba</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del producto:</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <label>Precio (CAD):</label>
                    <br />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                <button style={{ marginTop: "1rem" }} type="submit">
                    Pagar
                </button>
            </form>
        </div>
    );
}