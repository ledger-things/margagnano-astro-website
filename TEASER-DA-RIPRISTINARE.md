# Teaser — da ripristinare

Il sito pubblico mostra solo il teaser. I blocchi sotto sono commentati o esclusi dai percorsi pubblici. Il marcatore nel codice è `TEASER`.

Le correzioni di testo (trattini lunghi) e le fotografie nuove restano: non vanno annullate.

## Da riaccendere

- **Suite in homepage** — in `src/pages/index.astro` ripristinare `<LeSuites>`.
- **CTA “View more” di Life in homepage** — in `src/pages/index.astro` togliere `showMore={false}` da `<LifeInMargagnano>`. La destinazione è `/life`.
- **CTA “View more” di Experience in homepage** — in `src/pages/index.astro` togliere `showMore={false}` da `<Experience>`. La destinazione è `/request-access`.
- **Banner Private Collection** — in `src/pages/index.astro` e `src/pages/philosophy.astro` il banner usa i testi Contatti. I testi originali restano i default di `src/components/PrivateCollectionCta.astro`. Togliere le props passate dalle due pagine.
- **Pulsante header “Discover the private collection”** — in `src/components/PublicHeaderNav.tsx` il pulsante è fisso su Contatti. Riattivare il ramo `privateCta` (accesso privato / entra nella collezione).
- **Voce di menu “Life in Margagnano”** — in `src/components/PublicHeaderNav.tsx` ripristinare il link `/life`.
- **Pagina Life pubblica** — `src/pages/life.astro` è ancora nel repo. In `src/lib/access.ts` rimettere `/life` in `PUBLIC_PATHS` e in `src/pages/robots.txt.ts` rimettere `Allow: /life`.
- **Prima e dopo** — in `src/pages/philosophy.astro` ripristinare `<MasseriaCompare>`.
- **Filosofia della cucina** — in `src/pages/philosophy.astro` ripristinare `<CucinaHero variant="section">`.
- **Richiesta accesso pubblica** — `src/pages/request-access.astro` è ancora nel repo ma non è linkata né pubblica. In `src/lib/access.ts` rimettere `/request-access` in `PUBLIC_PATHS` e in `src/pages/robots.txt.ts` rimettere `Allow: /request-access`.

- **Telefono e General Manager** — in `src/components/contacts/ContactsHero.astro` ripristinare le costanti `phone` e `generalManager`, `telHref` e i due blocchi della lista contatti.

## Nota sulla pagina Contatti

`src/pages/contacts.astro` usa l’header pubblico (`PublicHeader`) e `/contacts` è in `PUBLIC_PATHS`, così il teaser non finisce sulla pagina password. L’header dell’area privata (`Header`) linka ancora questa stessa pagina. Quando l’area privata torna visibile, decidere se i visitatori con accesso devono rivedere l’header privato su Contatti.
