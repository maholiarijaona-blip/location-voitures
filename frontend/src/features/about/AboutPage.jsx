const ENTITES = [
  { nom: 'CLIENT', x: 20, y: 30, attrs: ['id_client', 'nom', 'prenom', 'email', 'telephone', 'numero_permis', 'adresse'] },
  { nom: 'VOITURE', x: 460, y: 30, attrs: ['id_voiture', 'marque', 'modele', 'immatriculation', 'annee', 'couleur', 'prix_jour', 'statut'] },
  { nom: 'LOCATION', x: 240, y: 270, attrs: ['id_location', 'date_debut', 'date_fin', 'date_retour', 'prix_total', 'statut'] },
  { nom: 'PAIEMENT', x: 240, y: 520, attrs: ['id_paiement', 'montant', 'mode', 'date_paiement'] },
]

const ASSOCIATIONS = [
  { nom: 'EFFECTUER', cx: 130, cy: 330, rx: 55 },
  { nom: 'CONCERNER', cx: 550, cy: 330, rx: 55 },
  { nom: 'RÉGLER', cx: 340, cy: 470, rx: 45 },
]

const LIENS = [
  [130, 202, 130, 313],
  [185, 330, 240, 330],
  [550, 220, 550, 313],
  [495, 330, 440, 330],
  [340, 424, 340, 453],
  [340, 487, 340, 520],
]

const CARDINALITES = [
  { t: '0,n', x: 138, y: 222 },
  { t: '1,1', x: 198, y: 320 },
  { t: '0,n', x: 558, y: 238 },
  { t: '1,1', x: 450, y: 320 },
  { t: '0,n', x: 348, y: 443 },
  { t: '1,1', x: 348, y: 510 },
]

const hauteur = (n) => 50 + (n - 1) * 18 + 14

function Mcd() {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 680 678" className="mx-auto w-full min-w-[520px] max-w-2xl" role="img" aria-labelledby="mcd-titre mcd-desc">
        <title id="mcd-titre">MCD du projet Location de voitures</title>
        <desc id="mcd-desc">
          Quatre entités, Client, Voiture, Location et Paiement, reliées par les associations Effectuer, Concerner et Régler.
        </desc>

        {LIENS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#737373" strokeWidth="1" />
        ))}

        {ENTITES.map((e) => (
          <g key={e.nom}>
            <rect x={e.x} y={e.y} width="200" height={hauteur(e.attrs.length)} rx="4" fill="#171717" stroke="#4ab5ac" strokeWidth="1" />
            <text x={e.x + 100} y={e.y + 18} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="14" fontWeight="500">
              {e.nom}
            </text>
            <line x1={e.x} y1={e.y + 34} x2={e.x + 200} y2={e.y + 34} stroke="#4ab5ac" strokeWidth="0.5" />
            {e.attrs.map((a, i) => (
              <text
                key={a}
                x={e.x + 12}
                y={e.y + 50 + i * 18}
                dominantBaseline="central"
                fill="#d4d4d4"
                fontSize="12"
                textDecoration={i === 0 ? 'underline' : undefined}
              >
                {a}
              </text>
            ))}
          </g>
        ))}

        {ASSOCIATIONS.map((a) => (
          <g key={a.nom}>
            <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry="17" fill="#000000" stroke="#a3a3a3" strokeWidth="1" />
            <text x={a.cx} y={a.cy} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize="12" fontWeight="500">
              {a.nom}
            </text>
          </g>
        ))}

        {CARDINALITES.map((c, i) => (
          <text key={i} x={c.x} y={c.y} fill="#e6775a" fontSize="12" fontWeight="500">
            {c.t}
          </text>
        ))}
      </svg>
    </div>
  )
}

const FONCTIONNALITES = [
  'Gestion des voitures : marque, modèle, immatriculation, prix par jour et statut (disponible, louée, en maintenance).',
  'Gestion des clients : coordonnées et numéro de permis, avec un compte de connexion facultatif.',
  'Gestion des locations : le prix total est calculé automatiquement (nombre de jours × prix par jour).',
  'Suivi des paiements : plusieurs paiements par location, avec calcul du reste à payer.',
  'Tableau de bord, recherche, tri, pagination et export PDF.',
  'Deux profils : l’administrateur gère tout, le client consulte ses propres locations et paiements.',
]

const REGLES = [
  'Les dates de début, de fin et de retour ne peuvent pas être dans le passé.',
  'La date de fin ne peut pas être avant la date de début.',
  'Une voiture en maintenance ne peut pas être louée.',
  'Le statut d’une voiture suit automatiquement ses locations en cours.',
  'Un client ou une voiture qui a des locations ne peut pas être supprimé.',
  'Un paiement ne peut pas être ajouté à une location annulée.',
]

const TECHNOLOGIES = [
  ['Backend', 'Django 5 et Django REST Framework'],
  ['Frontend', 'React, Vite et Tailwind CSS'],
  ['Base de données', 'SQLite'],
  ['Authentification', 'Jeton (token) d’API'],
  ['Hébergement', 'Render (API) et Vercel (interface)'],
]

const LECTURE = [
  ['Un client', 'effectue 0 à n locations ; une location est effectuée par un seul client.'],
  ['Une voiture', 'concerne 0 à n locations ; une location concerne une seule voiture.'],
  ['Une location', 'est réglée par 0 à n paiements ; un paiement règle une seule location.'],
]

function Section({ titre, children }) {
  return (
    <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <h2 className="mb-3 text-lg font-semibold text-white">{titre}</h2>
      {children}
    </section>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">À propos</h1>
        <p className="text-sm text-neutral-400">Présentation du projet et de sa base de données</p>
      </div>

      <Section titre="Le projet">
        <p className="text-sm leading-relaxed text-neutral-300">
          Cette application permet de gérer une agence de location de voitures : le parc de véhicules, les clients, les
          locations et les paiements. Elle se compose d’une API Django et d’une interface React.
        </p>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section titre="Fonctionnalités">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-300">
            {FONCTIONNALITES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Section>

        <Section titre="Règles de gestion">
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-300">
            {REGLES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Section>
      </div>

      <Section titre="Modèle conceptuel de données (MCD)">
        <Mcd />
        <ul className="mt-4 space-y-1 text-sm text-neutral-300">
          {LECTURE.map(([sujet, texte]) => (
            <li key={sujet}>
              <span className="font-medium text-white">{sujet}</span> {texte}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-neutral-500">
          Les identifiants sont soulignés. Les cardinalités sont notées (minimum, maximum).
        </p>
      </Section>

      <Section titre="Technologies">
        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[10rem_1fr]">
          {TECHNOLOGIES.map(([nom, valeur]) => (
            <div key={nom} className="contents">
              <dt className="text-neutral-400">{nom}</dt>
              <dd className="text-neutral-200">{valeur}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
