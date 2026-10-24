import { User, Database } from 'lucide-react'

const INFOS = [
  ['Nom', 'Ny Sahy'],
  ['Matricule', '3417/24'],
  ['Classe', 'IGFIB'],
]

// k : 'pk' (clé primaire) ou 'fk' (clé étrangère). t : type affiché dans les tableaux, s : type SQL du MPD.
const TABLES = [
  {
    nom: 'client',
    desc: 'Regroupe les clients de l’agence, avec un compte de connexion facultatif.',
    champs: [
      { n: 'id', t: 'BigAutoField', s: 'INTEGER', c: 'Clé primaire', k: 'pk' },
      { n: 'nom', t: 'varchar(100)', s: 'VARCHAR(100)', c: 'Obligatoire' },
      { n: 'prenom', t: 'varchar(100)', s: 'VARCHAR(100)', c: 'Obligatoire' },
      { n: 'email', t: 'varchar(254)', s: 'VARCHAR(254)', c: 'Unique, obligatoire' },
      { n: 'telephone', t: 'varchar(20)', s: 'VARCHAR(20)', c: 'Unique, obligatoire (8 à 15 chiffres)' },
      { n: 'numero_permis', t: 'varchar(30)', s: 'VARCHAR(30)', c: 'Unique, obligatoire' },
      { n: 'adresse', t: 'text', s: 'TEXT', c: 'Facultatif' },
      { n: 'created_at', t: 'datetime', s: 'DATETIME', c: 'Date de création' },
      { n: 'user_id', t: 'BigInteger', s: 'INTEGER', c: 'Clé étrangère vers auth_user.id, facultative', k: 'fk', ref: 'auth_user.id' },
    ],
  },
  {
    nom: 'voiture',
    desc: 'Décrit les véhicules du parc et leur disponibilité.',
    champs: [
      { n: 'id', t: 'BigAutoField', s: 'INTEGER', c: 'Clé primaire', k: 'pk' },
      { n: 'marque', t: 'varchar(60)', s: 'VARCHAR(60)', c: 'Obligatoire' },
      { n: 'modele', t: 'varchar(60)', s: 'VARCHAR(60)', c: 'Obligatoire' },
      { n: 'immatriculation', t: 'varchar(20)', s: 'VARCHAR(20)', c: 'Unique, obligatoire' },
      { n: 'annee', t: 'smallint', s: 'SMALLINT', c: 'De 1990 à 2100' },
      { n: 'couleur', t: 'varchar(30)', s: 'VARCHAR(30)', c: 'Facultatif' },
      { n: 'prix_jour', t: 'decimal(10,2)', s: 'DECIMAL(10,2)', c: 'Supérieur ou égal à 1' },
      { n: 'statut', t: 'varchar(15)', s: 'VARCHAR(15)', c: 'disponible, louee ou maintenance (défaut : disponible)' },
      { n: 'created_at', t: 'datetime', s: 'DATETIME', c: 'Date de création' },
    ],
  },
  {
    nom: 'location',
    desc: 'Enregistre la location d’une voiture par un client.',
    champs: [
      { n: 'id', t: 'BigAutoField', s: 'INTEGER', c: 'Clé primaire', k: 'pk' },
      { n: 'date_debut', t: 'date', s: 'DATE', c: 'Obligatoire, pas dans le passé' },
      { n: 'date_fin', t: 'date', s: 'DATE', c: 'Obligatoire, pas avant la date de début' },
      { n: 'date_retour', t: 'date', s: 'DATE', c: 'Facultatif, pas dans le passé' },
      { n: 'prix_total', t: 'decimal(12,2)', s: 'DECIMAL(12,2)', c: 'Calculé : nombre de jours × prix par jour' },
      { n: 'statut', t: 'varchar(15)', s: 'VARCHAR(15)', c: 'en_cours, terminee ou annulee (défaut : en_cours)' },
      { n: 'created_at', t: 'datetime', s: 'DATETIME', c: 'Date de création' },
      { n: 'client_id', t: 'BigInteger', s: 'INTEGER', c: 'Clé étrangère vers client.id', k: 'fk', ref: 'client.id' },
      { n: 'voiture_id', t: 'BigInteger', s: 'INTEGER', c: 'Clé étrangère vers voiture.id', k: 'fk', ref: 'voiture.id' },
    ],
  },
  {
    nom: 'paiement',
    desc: 'Enregistre les règlements effectués pour une location.',
    champs: [
      { n: 'id', t: 'BigAutoField', s: 'INTEGER', c: 'Clé primaire', k: 'pk' },
      { n: 'montant', t: 'decimal(12,2)', s: 'DECIMAL(12,2)', c: 'Supérieur ou égal à 1' },
      { n: 'mode', t: 'varchar(15)', s: 'VARCHAR(15)', c: 'especes, carte, mobile_money ou virement' },
      { n: 'date_paiement', t: 'date', s: 'DATE', c: 'Défaut : date du jour' },
      { n: 'created_at', t: 'datetime', s: 'DATETIME', c: 'Date de création' },
      { n: 'location_id', t: 'BigInteger', s: 'INTEGER', c: 'Clé étrangère vers location.id', k: 'fk', ref: 'location.id' },
    ],
  },
]

const CLES_ETRANGERES = TABLES.flatMap((t) =>
  t.champs.filter((c) => c.k === 'fk').map((c) => ({ de: `${t.nom}.${c.n}`, vers: c.ref })),
)

/* ------------------------------- Cartes ------------------------------- */

function CarteTable({ table }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      <div className="px-4 pb-3 pt-4">
        <p className="font-mono text-sm font-semibold text-white">{table.nom}</p>
        <p className="mt-1 text-xs text-neutral-400">{table.desc}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-900 text-neutral-400">
            <tr>
              <th className="px-4 py-2 font-normal">Champ</th>
              <th className="px-4 py-2 font-normal">Type</th>
              <th className="px-4 py-2 font-normal">Contraintes / rôle</th>
            </tr>
          </thead>
          <tbody>
            {table.champs.map((c) => (
              <tr key={c.n} className="border-t border-neutral-900">
                <td className="whitespace-nowrap px-4 py-2 font-mono text-neutral-200">{c.n}</td>
                <td className="whitespace-nowrap px-4 py-2 text-neutral-400">{c.t}</td>
                <td className="px-4 py-2 text-neutral-300">{c.c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* -------------------------------- MCD --------------------------------- */

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
  [130, 202, 130, 313], [185, 330, 240, 330], [550, 220, 550, 313],
  [495, 330, 440, 330], [340, 424, 340, 453], [340, 487, 340, 520],
]
const CARDINALITES = [
  { t: '0,n', x: 138, y: 222 }, { t: '1,1', x: 198, y: 320 }, { t: '0,n', x: 558, y: 238 },
  { t: '1,1', x: 450, y: 320 }, { t: '0,n', x: 348, y: 443 }, { t: '1,1', x: 348, y: 510 },
]
const hauteurMcd = (n) => 50 + (n - 1) * 18 + 14

function Mcd() {
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 680 678" className="mx-auto w-full min-w-[520px] max-w-2xl" role="img" aria-label="MCD du projet Location de voitures">
        {LIENS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#737373" strokeWidth="1" />
        ))}
        {ENTITES.map((e) => (
          <g key={e.nom}>
            <rect x={e.x} y={e.y} width="200" height={hauteurMcd(e.attrs.length)} rx="4" fill="#171717" stroke="#4ab5ac" />
            <text x={e.x + 100} y={e.y + 18} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="14" fontWeight="500">{e.nom}</text>
            <line x1={e.x} y1={e.y + 34} x2={e.x + 200} y2={e.y + 34} stroke="#4ab5ac" strokeWidth="0.5" />
            {e.attrs.map((a, i) => (
              <text key={a} x={e.x + 12} y={e.y + 50 + i * 18} dominantBaseline="central" fill="#d4d4d4" fontSize="12" textDecoration={i === 0 ? 'underline' : undefined}>{a}</text>
            ))}
          </g>
        ))}
        {ASSOCIATIONS.map((a) => (
          <g key={a.nom}>
            <ellipse cx={a.cx} cy={a.cy} rx={a.rx} ry="17" fill="#000" stroke="#a3a3a3" />
            <text x={a.cx} y={a.cy} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="12" fontWeight="500">{a.nom}</text>
          </g>
        ))}
        {CARDINALITES.map((c, i) => (
          <text key={i} x={c.x} y={c.y} fill="#e6775a" fontSize="12" fontWeight="500">{c.t}</text>
        ))}
      </svg>
    </div>
  )
}

/* -------------------------------- MLD --------------------------------- */

function LigneMld({ table }) {
  const pk = table.champs.filter((c) => c.k === 'pk')
  const simples = table.champs.filter((c) => !c.k)
  const fks = table.champs.filter((c) => c.k === 'fk')
  return (
    <div className="rounded-lg border border-neutral-800 border-l-4 border-l-teal-500 bg-neutral-950 px-4 py-3 font-mono text-sm text-neutral-300">
      <span className="font-semibold text-teal-400">{table.nom}</span> (&nbsp;
      {pk.map((c) => (
        <span key={c.n}>
          <u className="font-semibold text-white">{c.n}</u>,{' '}
        </span>
      ))}
      {simples.map((c) => `${c.n}, `)}
      {fks.map((c, i) => (
        <span key={c.n} className="text-teal-300">
          #{c.n}
          {i < fks.length - 1 ? ', ' : ''}
        </span>
      ))}
      &nbsp;)
    </div>
  )
}

function Mld() {
  return (
    <div className="space-y-3">
      {TABLES.map((t) => (
        <LigneMld key={t.nom} table={t} />
      ))}
      <div className="pt-2">
        <p className="mb-1 text-sm font-semibold text-white">Clés étrangères</p>
        <ul className="space-y-1 font-mono text-xs text-teal-300">
          {CLES_ETRANGERES.map((f) => (
            <li key={f.de}>
              # {f.de} <span className="text-neutral-500">→</span> {f.vers}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-neutral-500">Gras souligné = clé primaire &nbsp;·&nbsp; # = clé étrangère</p>
    </div>
  )
}

/* -------------------------------- MPD --------------------------------- */

const BOITE_W = 230
const ENTETE = 30
const LIGNE = 28

const ordreMpd = (t) => [...t.champs.filter((c) => c.k === 'pk'), ...t.champs.filter((c) => !c.k), ...t.champs.filter((c) => c.k === 'fk')]
const parNom = Object.fromEntries(TABLES.map((t) => [t.nom, t]))

const POSITIONS = {
  client: { x: 20, y: 30 },
  location: { x: 385, y: 30 },
  voiture: { x: 750, y: 30 },
  paiement: { x: 385, y: 400 },
}

function BoiteMpd({ table, x, y }) {
  const lignes = ordreMpd(table)
  const h = ENTETE + lignes.length * LIGNE
  return (
    <g>
      <rect x={x} y={y} width={BOITE_W} height={h} rx="8" fill="#0a0a0a" stroke="#404040" />
      <path d={`M${x} ${y + ENTETE} V${y + 8} a8 8 0 0 1 8 -8 H${x + BOITE_W - 8} a8 8 0 0 1 8 8 V${y + ENTETE} Z`} fill="#0f766e" />
      <text x={x + BOITE_W / 2} y={y + ENTETE / 2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="14" fontWeight="600">{table.nom}</text>
      {lignes.map((c, i) => {
        const ry = y + ENTETE + i * LIGNE
        const fond = c.k === 'pk' ? '#2a2208' : c.k === 'fk' ? '#0c2a2e' : 'transparent'
        return (
          <g key={c.n}>
            <rect x={x + 0.5} y={ry} width={BOITE_W - 1} height={LIGNE} fill={fond} />
            {c.k && (
              <text x={x + 10} y={ry + LIGNE / 2} dominantBaseline="central" fontSize="10" fontWeight="700" fill={c.k === 'pk' ? '#fbbf24' : '#5eead4'}>
                {c.k.toUpperCase()}
              </text>
            )}
            <text x={x + 36} y={ry + LIGNE / 2} dominantBaseline="central" fontSize="12" fill="#e5e5e5" textDecoration={c.k === 'pk' ? 'underline' : undefined}>
              {c.k === 'fk' ? `#${c.n}` : c.n}
            </text>
            <text x={x + BOITE_W - 10} y={ry + LIGNE / 2} dominantBaseline="central" textAnchor="end" fontSize="10" fill="#8a8a8a">{c.s}</text>
          </g>
        )
      })}
    </g>
  )
}

function Mpd() {
  const loc = POSITIONS.location
  const nLoc = ordreMpd(parNom.location).length
  const yLocBas = loc.y + ENTETE + nLoc * LIGNE
  const yClient = loc.y + ENTETE + ordreMpd(parNom.location).findIndex((c) => c.n === 'client_id') * LIGNE + LIGNE / 2
  const yVoiture = loc.y + ENTETE + ordreMpd(parNom.location).findIndex((c) => c.n === 'voiture_id') * LIGNE + LIGNE / 2
  const yId = POSITIONS.client.y + ENTETE + LIGNE / 2
  const xC = POSITIONS.client.x + BOITE_W
  const xV = POSITIONS.voiture.x
  const xCentre = loc.x + BOITE_W / 2
  const cardClass = { fill: '#e6775a', fontSize: 12, fontWeight: 600 }
  return (
    <div className="overflow-x-auto">
      <svg viewBox="0 0 1000 640" className="mx-auto w-full min-w-[760px]" role="img" aria-label="MPD du projet Location de voitures">
        <g fill="none" stroke="#737373" strokeWidth="1.2">
          <path d={`M${xC} ${yId} H320 V${yClient} H${loc.x}`} />
          <path d={`M${loc.x + BOITE_W} ${yVoiture} H682 V${yId} H${xV}`} />
          <path d={`M${xCentre} ${yLocBas} V${POSITIONS.paiement.y}`} />
        </g>
        {Object.entries(POSITIONS).map(([nom, p]) => (
          <BoiteMpd key={nom} table={parNom[nom]} x={p.x} y={p.y} />
        ))}
        <text x={xC + 6} y={yId - 8} {...cardClass}>0,n</text>
        <text x={loc.x - 34} y={yClient - 8} {...cardClass}>1,1</text>
        <text x={loc.x + BOITE_W + 6} y={yVoiture - 8} {...cardClass}>1,1</text>
        <text x={xV - 34} y={yId - 8} {...cardClass}>0,n</text>
        <text x={xCentre + 8} y={yLocBas + 18} {...cardClass}>0,n</text>
        <text x={xCentre + 8} y={POSITIONS.paiement.y - 8} {...cardClass}>1,1</text>
        <g fontSize="11">
          <text x="20" y="620" fill="#fbbf24" fontWeight="700">PK</text>
          <text x="40" y="620" fill="#a3a3a3">clé primaire</text>
          <text x="130" y="620" fill="#5eead4" fontWeight="700">FK #</text>
          <text x="165" y="620" fill="#a3a3a3">clé étrangère (client.user_id référence auth_user.id, table de Django)</text>
        </g>
      </svg>
    </div>
  )
}

/* ------------------------------- Page --------------------------------- */

function Bloc({ icone: Icone, titre, children }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-white">
        {Icone && <Icone className="h-5 w-5 text-teal-400" />}
        {titre}
      </h2>
      {children}
    </section>
  )
}

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-teal-400">Location de voitures</p>
        <h1 className="text-2xl font-semibold text-white">À propos</h1>
        <p className="text-sm text-neutral-400">
          Présentation du projet et étude du schéma de base de données relationnelle (SBDR).
        </p>
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-white">
          <User className="h-5 w-5 text-teal-400" /> Informations
        </h2>
        <dl className="grid gap-4 sm:grid-cols-3">
          {INFOS.map(([label, valeur]) => (
            <div key={label}>
              <dt className="text-sm text-neutral-400">{label}</dt>
              <dd className="text-sm font-medium text-white">{valeur}</dd>
            </div>
          ))}
        </dl>
      </section>

      <Bloc icone={Database} titre="Tables">
        <div className="grid gap-5 lg:grid-cols-2">
          {TABLES.map((t) => (
            <CarteTable key={t.nom} table={t} />
          ))}
        </div>
      </Bloc>

      <Bloc icone={Database} titre="Modèle Conceptuel de Données (MCD)">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <Mcd />
          <ul className="mt-4 space-y-1 text-sm text-neutral-300">
            <li><span className="font-medium text-white">Un client</span> effectue 0 à n locations ; une location est effectuée par un seul client.</li>
            <li><span className="font-medium text-white">Une voiture</span> concerne 0 à n locations ; une location concerne une seule voiture.</li>
            <li><span className="font-medium text-white">Une location</span> est réglée par 0 à n paiements ; un paiement règle une seule location.</li>
          </ul>
          <p className="mt-3 text-xs text-neutral-500">Les identifiants sont soulignés. Les cardinalités sont notées (minimum, maximum).</p>
        </div>
      </Bloc>

      <Bloc icone={Database} titre="Modèle Logique de Données (MLD)">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="mb-4 text-xs text-neutral-500">Notation relationnelle</p>
          <Mld />
        </div>
      </Bloc>

      <Bloc icone={Database} titre="Modèle Physique de Données (MPD)">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="mb-4 text-xs text-neutral-500">Django · SQLite en local, PostgreSQL en ligne</p>
          <Mpd />
        </div>
      </Bloc>
    </div>
  )
}
