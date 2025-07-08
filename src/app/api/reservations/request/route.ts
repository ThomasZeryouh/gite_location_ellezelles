import { NextResponse } from "next/server";
import { Resend } from "resend";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      phone,
      guests,
      specialRequests,
      checkIn,
      checkOut,
      nights,
      total,
    } = await request.json();

    // Validation des champs requis
    if (!name || !email || !phone || !guests || !checkIn || !checkOut) {
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

    // Convertir les dates pour l'affichage
    const arrivalDate = new Date(checkIn);
    const departureDate = new Date(checkOut);

    // Template HTML pour l'email de demande de réservation
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 25px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #374151; margin-bottom: 8px; display: block; }
            .value { background: white; padding: 12px; border-radius: 6px; border-left: 4px solid #2563eb; }
            .dates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
            .date-card { background: white; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #e5e7eb; }
            .date-title { font-weight: bold; color: #2563eb; margin-bottom: 5px; }
            .date-value { font-size: 16px; color: #374151; }
            .summary-box { background: #eff6ff; padding: 20px; border-radius: 8px; border: 1px solid #bfdbfe; }
            .price-line { display: flex; justify-content: space-between; margin: 8px 0; }
            .total-line { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #1d4ed8; border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 15px; }
            .client-info { background: #fef3c7; padding: 20px; border-radius: 8px; border: 1px solid #fde68a; }
            .action-needed { background: #dcfce7; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0; margin: 20px 0; }
            .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">🏠 Nouvelle demande de réservation</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Gîte Ellezelles - Système de réservation</p>
            </div>
            
            <div class="content">
              <div class="action-needed">
                <p style="margin: 0; color: #065f46; font-weight: bold;">⚠️ Action requise : Confirmer ou refuser cette demande de réservation</p>
              </div>

              <div class="section">
                <div class="client-info">
                  <h3 style="margin-top: 0; color: #d97706; font-size: 18px;">👤 Informations du client</h3>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div>
                      <strong>Nom complet :</strong><br>${name}
                    </div>
                    <div>
                      <strong>Nombre de personnes :</strong><br>${guests} personne(s)
                    </div>
                    <div>
                      <strong>Email :</strong><br>${email}
                    </div>
                    <div>
                      <strong>Téléphone :</strong><br>${phone}
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <span class="label">📅 Dates du séjour demandé</span>
                <div class="dates-grid">
                  <div class="date-card">
                    <div class="date-title">🛬 Arrivée</div>
                    <div class="date-value">${format(arrivalDate, "EEEE dd MMMM yyyy", { locale: fr })}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">à partir de 15h00</div>
                  </div>
                  <div class="date-card">
                    <div class="date-title">🛫 Départ</div>
                    <div class="date-value">${format(departureDate, "EEEE dd MMMM yyyy", { locale: fr })}</div>
                    <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">avant 11h00</div>
                  </div>
                </div>
              </div>

              <div class="section">
                <span class="label">💰 Récapitulatif financier</span>
                <div class="summary-box">
                  <div class="price-line">
                    <span>Durée du séjour :</span>
                    <span><strong>${nights} nuit(s)</strong></span>
                  </div>
                  <div class="price-line">
                    <span>Tarif par nuit :</span>
                    <span>96€</span>
                  </div>
                  <div class="price-line">
                    <span>Sous-total hébergement :</span>
                    <span>${nights * 96}€</span>
                  </div>
                  <div class="price-line">
                    <span>Frais de ménage :</span>
                    <span>40€</span>
                  </div>
                  <div class="total-line">
                    <span>Total de la réservation :</span>
                    <span>${total}€</span>
                  </div>
                </div>
              </div>

              ${
                specialRequests
                  ? `
                <div class="section">
                  <span class="label">📝 Demandes spéciales du client</span>
                  <div class="value" style="white-space: pre-wrap;">${specialRequests}</div>
                </div>
              `
                  : ""
              }

              <div class="section">
                <span class="label">ℹ️ Informations importantes</span>
                <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb;">
                  <ul style="margin: 0; padding-left: 20px;">
                    <li><strong>Caution :</strong> 200€ à prélever à l'arrivée</li>
                    <li><strong>Horaires :</strong> Arrivée 15h-20h, Départ 8h-11h</li>
                    <li><strong>Capacité max :</strong> 4 personnes</li>
                    <li><strong>Inclus :</strong> WiFi, parking, linge, ménage final</li>
                  </ul>
                </div>
              </div>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h4 style="margin-top: 0; color: #1f2937;">🔄 Prochaines étapes :</h4>
                <ol style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>Vérifier la disponibilité des dates dans votre planning</li>
                  <li>Répondre directement au client à ${email}</li>
                  <li>Confirmer ou proposer des dates alternatives</li>
                  <li>Si accepté, ajouter la réservation dans votre système admin</li>
                </ol>
              </div>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; border: 1px solid #bbf7d0; margin: 20px 0;">
                <p style="margin: 0; color: #065f46;"><strong>💡 Pour répondre :</strong> Répondez directement à cet email, votre réponse sera envoyée à ${email}</p>
              </div>
              
              <div class="footer">
                <p>Demande reçue le ${new Date().toLocaleString("fr-FR", {
                  timeZone: "Europe/Brussels",
                  dateStyle: "full",
                  timeStyle: "short",
                })}</p>
                <p style="margin-top: 10px;">Gîte Ellezelles - Système de réservation automatique</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email au propriétaire
    const emailData = await resend.emails.send({
      from: "Gîte Ellezelles <onboarding@resend.dev>",
      to: process.env.TO_EMAIL!,
      subject: `🏠 Nouvelle demande de réservation du ${format(arrivalDate, "dd/MM/yyyy")} au ${format(departureDate, "dd/MM/yyyy")} - ${name}`,
      html: htmlTemplate,
      replyTo: email, // Le propriétaire peut répondre directement au client
    });

    console.log(
      "✅ Email de demande de réservation envoyé:",
      emailData.data?.id
    );

    return NextResponse.json({
      message:
        "Votre demande de réservation a été envoyée avec succès ! Le propriétaire vous répondra rapidement pour confirmer la disponibilité.",
      success: true,
      emailId: emailData.data?.id,
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de la demande:", error);

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
              "Trop de demandes envoyées. Veuillez attendre quelques minutes.",
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
        message: "Erreur lors de l'envoi de la demande. Veuillez réessayer.",
        success: false,
      },
      { status: 500 }
    );
  }
}
