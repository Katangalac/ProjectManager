import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ⚠️ désactive la vérification du certificat
  },
});

/**
 * Envoie un courriel
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  await transporter.sendMail({
    from: `"ProjectManager" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

/**
 * Envoie un courriel
 */
export const sendWelcomeEmail = async (to: string, userName:string) => {
  const subject = "Bienvenue sur Project Manager 🚀";

  const text = `Bonjour ${userName},
Bienvenue sur Project Manager ! Vous pouvez dès maintenant créer vos projets,
gérer vos équipes et suivre vos tâches en temps réel.

— L'équipe Project Manager`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1)">
        <h2 style="color: #333;">👋 Bonjour ${userName},</h2>
        <p>Bienvenue sur <strong>Project Manager</strong> !</p>
        <p>Vous pouvez maintenant créer des projets, gérer vos équipes et suivre vos tâches en temps réel.</p>
        <p>Commencez dès maintenant à organiser vos idées et à collaborer efficacement 🚀</p>
        <a href="${process.env.APP_URL}" style="display:inline-block; margin-top:15px; background-color:#007bff; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px;">
          Accéder à l’application
        </a>
        <p style="margin-top: 30px; color: #888;">— L’équipe Project Manager</p>
      </div>
    </div>
  `;

  await sendEmail(to, subject, text, html);
};