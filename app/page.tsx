import Link from 'next/link'
import { Calendar, Users, Award, ArrowRight } from 'lucide-react'
import styles from './page.module.css'

export default function Home() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Découvrez nos activités exceptionnelles
          </h1>
          <p className={styles.heroSubtitle}>
            Rejoignez-nous pour des moments inoubliables et des expériences uniques
          </p>
          <div className={styles.heroCta}>
            <Link href="/activites" className="btn btn-primary">
              Voir les activités
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/register" className="btn btn-secondary">
              S'inscrire
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <Calendar className={styles.featureIcon} />
              <h2 className={styles.featureTitle}>Activités variées</h2>
              <p className={styles.featureDescription}>
                Des activités pour tous les goûts et tous les niveaux
              </p>
            </div>

            <div className={styles.feature}>
              <Users className={styles.featureIcon} />
              <h2 className={styles.featureTitle}>Communauté active</h2>
              <p className={styles.featureDescription}>
                Rejoignez une communauté passionnée et dynamique
              </p>
            </div>

            <div className={styles.feature}>
              <Award className={styles.featureIcon} />
              <h2 className={styles.featureTitle}>Qualité garantie</h2>
              <p className={styles.featureDescription}>
                Des activités soigneusement sélectionnées pour votre satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
