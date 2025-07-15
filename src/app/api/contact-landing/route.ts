import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validation des champs requis
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          message: "Tous les champs obligatoires doivent être remplis",
          success: false,
        },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          message: "Format d'email invalide",
          success: false,
        },
        { status: 400 }
      );
    }

    // Template HTML pour l'email au propriétaire
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #f97316; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            .client-info { background: #fff7ed; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #fed7aa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 Nouveau message de contact</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Gîte Ellezelles - Site web</p>
            </div>
            <div class="content">
              <div class="client-info">
                <h3 style="margin-top: 0; color: #ea580c;">👤 Informations du client</h3>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                ${phone ? `<p><strong>Téléphone :</strong> ${phone}</p>` : ""}
              </div>
              
              
              
              <div class="field">
                <span class="label">💬 Message complet :</span>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
              
              <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #bbf7d0;">
                <p style="margin: 0; color: #065f46;"><strong>💡 Pour répondre :</strong> Vous pouvez répondre directement à cet email, votre réponse sera envoyée à ${email}</p>
              </div>
              
              <div class="footer">
                <p>Message reçu le ${new Date().toLocaleString("fr-FR", {
                  timeZone: "Europe/Brussels",
                  dateStyle: "full",
                  timeStyle: "short",
                })}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer UN SEUL email au propriétaire
    const emailData = await resend.emails.send({
      from: "Gîte Ellezelles <onboarding@resend.dev>",
      to: process.env.TO_EMAIL!,
      subject: `[Contact Site]  - De: ${name}`,
      html: htmlTemplate,
      replyTo: email, // Le propriétaire peut répondre directement au client
    });

    console.log("✅ Email envoyé au propriétaire:", emailData.data?.id);

    return NextResponse.json({
      message:
        "Votre message a été envoyé avec succès ! Nous vous répondrons rapidement.",
      success: true,
      emailId: emailData.data?.id,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi:", error);

    // Gestion spécifique des erreurs Resend
    if (error instanceof Error) {
      if (error.message?.includes("API key")) {
        return NextResponse.json(
          {
            message:
              "Erreur de configuration email. Veuillez réessayer plus tard.",
            success: false,
          },
          { status: 500 }
        );
      }

      if (error.message?.includes("rate limit")) {
        return NextResponse.json(
          {
            message:
              "Trop de messages envoyés. Veuillez attendre quelques minutes.",
            success: false,
          },
          { status: 429 }
        );
      }

      if (error.message?.includes("Forbidden")) {
        return NextResponse.json(
          {
            message:
              "Problème d'autorisation. Veuillez vérifier la configuration.",
            success: false,
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        success: false,
      },
      { status: 500 }
    );
  }
}
