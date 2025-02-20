// src/pages/api/create-brevo-contact.ts

export const prerender = false;

import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("content-type") === "application/json") {
    const body = await request.json();

    const { email, name,  } = body; // Asegúrate de recibir el nombre

    const BREVO_API_URL = "https://api.brevo.com/v3/contacts";
    const BREVO_API_KEY =
      import.meta.env.BREVO_API_KEY ?? process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.error("No BREVO_API_KEY defined");
      return new Response(null, { status: 400 });
    }

    // Payload para agregar el contacto a Brevo
    const payload = {
      updateEnabled: true,
      email: email,
      firstName: name,  // Añadimos el nombre al contacto
      listIds: [2],  // Aquí puedes poner la lista en la que quieres agregar el contacto
    };

    try {
      // Añadir contacto a Brevo
      const response = await fetch(BREVO_API_URL, {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Contact added successfully");

        // Enviar el correo al destinatario especificado
        const emailPayload = {
          sender: { name: "Tu Nombre", email: import.meta.env.EMAIL_BREVO_ACCOUNT }, // Tu correo
          to: [{ email: import.meta.env.EMAIL_BREVO_SEND }], // Correo a donde se reenviará el mensaje
          subject: "Nuevo mensaje de contacto",
          htmlContent: `<p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Correo:</strong> ${email}</p>
                        <p><strong>Mensaje:</strong> ${body.message}</p>`,
        };

        const sendEmailResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY,
          },
          body: JSON.stringify(emailPayload),
        });

        if (!sendEmailResponse.ok) {
          console.error("Error al reenviar el correo.");
          return new Response(null, { status: 400 });
        }

        // Si todo es exitoso, retornar mensaje al frontend
        return new Response(
          JSON.stringify({ message: "Mensaje enviado con exito" }),
          { status: 200 }
        );
      } else {
        console.error("Failed to add contact to Brevo");
        return new Response(null, { status: 400 });
      }
    } catch (error) {
      console.error("An unexpected error occurred while adding contact:", error);
      return new Response(null, { status: 400 });
    }
  }

  return new Response(null, { status: 400 });
};
