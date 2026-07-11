import { resend, FROM_EMAIL } from "./resend";
import { bookingConfirmationEmail } from "./email-templates/bookingConfirmation";
import { paymentReceivedEmail } from "./email-templates/paymentReceived";
import { tournamentInviteEmail } from "./email-templates/tournamentInvite";
import { partnerRequestAcceptedEmail } from "./email-templates/partnerRequestAccepted";

export async function sendBookingConfirmationEmail(to, data) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `تأكيد حجزك في ${data.venueName}`,
      html: bookingConfirmationEmail(data),
    });
  } catch (err) {
    console.error("Failed to send booking confirmation email:", err);
  }
}

export async function sendPaymentReceivedEmail(to, data) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "تم تأكيد دفعتك — InstaPadel",
      html: paymentReceivedEmail(data),
    });
  } catch (err) {
    console.error("Failed to send payment email:", err);
  }
}

export async function sendTournamentInviteEmail(to, data) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `بطولة جديدة: ${data.tournamentName}`,
      html: tournamentInviteEmail(data),
    });
  } catch (err) {
    console.error("Failed to send tournament invite:", err);
  }
}

export async function sendPartnerRequestAcceptedEmail(to, data) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "تم قبول طلب انضمامك — InstaPadel",
      html: partnerRequestAcceptedEmail(data),
    });
  } catch (err) {
    console.error("Failed to send partner accepted email:", err);
  }
}
