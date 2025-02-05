import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  },
  tls: {
    rejectUnauthorized: false,
    ciphers:'SSLv3'
  }
})

// Vérifier la connexion au démarrage
transporter.verify(function(error, success) {
  if (error) {
    console.log('Erreur de configuration SMTP:', error);
  } else {
    console.log('Serveur SMTP prêt à envoyer des emails');
  }
});

export async function sendEmail(
  to: string,  // email de l'utilisateur qui fait la réservation
  activiteName: string,
  datetime: string,
  duration: number
) {
  console.log('Tentative d\'envoi d\'email à:', to)
  console.log('Configuration SMTP:', {
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    user: process.env.EMAIL_SERVER_USER,
    from: process.env.EMAIL_FROM
  })

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: "Confirmation de votre réservation",
      html: `
        <h1>Confirmation de réservation</h1>
        <p>Votre réservation pour l'activité "${activiteName}" a été confirmée.</p>
        <p>Date : ${new Date(datetime).toLocaleString('fr-FR')}</p>
        <p>Durée : ${duration} minutes</p>
      `
    })
    console.log('Email envoyé avec succès:', info)
  } catch (error) {
    console.error('Erreur détaillée lors de l\'envoi de l\'email:', error)
    throw error // Pour voir l'erreur dans les logs de l'API
  }
} 