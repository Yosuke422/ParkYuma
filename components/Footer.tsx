export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">À propos</h3>
            <p className="footer-text">
              Notre plateforme vous permet de découvrir et réserver facilement 
              des activités passionnantes dans votre région.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <ul className="footer-list">
              <li>Email: contact@activites.com</li>
              <li>Téléphone: 01 23 45 67 89</li>
              <li>Adresse: 123 rue des Sports, 75000 Paris</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Liens utiles</h3>
            <ul className="footer-list">
              <li><a href="/activites">Les activités</a></li>
              <li><a href="/conditions">Conditions générales</a></li>
              <li><a href="/confidentialite">Politique de confidentialité</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Activités. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
