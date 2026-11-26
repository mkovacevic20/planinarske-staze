# Botpress – razgovorni tok za preporuku staze

Ovaj nacrt pretpostavlja Botpress Webchat i koristi bazu znanja iz `knowledge-base.txt`. Objavljeni Webchat ugrađen je na sve četiri stranice projekta. Naziv, opis, placeholder i tekst početnog zaslona prevedeni su na hrvatski. U Viber editoru postavljene su hrvatske upute, pozdrav i sigurnosna pravila, a postojeći playbook za preporuku staze ažuriran je pravilima prikupljanja kriterija. Datoteka `knowledge-base.txt` učitana je u Knowledge → Files.

Provjera u novom razgovoru: nakon upita s regijom, raspoloživim vremenom i željom za laganom stazom, bot je na hrvatskom pitao samo za nedostajuću kondiciju. Nakon odgovora „Početnik sam” preporučio je Japetić iz Šoićeve kuće, naveo podatke iz baze i prikazao izvor `knowledge-base.txt`. Dodatni test za početnika u Dalmaciji do jednog sata ispravno je vratio da nema podudaranja i ponudio promjenu kriterija.

## Hrvatski jezik i identitet

U Botpress Dashboardu pod **Webchat → Bot Identity** i **Webchat → Features → Home page** postavljene su ove hrvatske vrijednosti:

- **Display name:** `Planinarski vodič`
- **Description:** `Preporuke planinarskih staza i savjeti za pripremu izleta u Hrvatskoj.`
- **Composer placeholder:** `Postavi pitanje o stazama ili opremi...`
- **Home page title:** `Pronađi svoju sljedeću stazu`
- **Home page subtitle:** `Pitaj za preporuke staza ili savjete za planinarski izlet.`

U Viber editoru postavljen je hrvatski pozdrav iz `agent-instructions.txt`, uz prijateljski ton, standardni hrvatski i obraćanje s „ti”. Upute za odgovore nalaze se pod **Behaviour → Identity** i **Behaviour → Safety**. Lokalna baza znanja navodi hrvatski kao obvezan jezik odgovora i sada je učitana u bota.

## Podaci razgovora

U Viber editoru uključena je korisnička memorija samo za ove preference, kako bi se mogle koristiti i u nastavku razgovora:

- `kondicija`: `pocetnik`, `redovita` ili `iskusan`
- `regija`: jedna od šest regija iz baze ili `sve`
- `raspoloziviSati`: pozitivan broj sati

Koristi spremljene vrijednosti kada su relevantne; ako mogu biti zastarjele ili su u sukobu s novom porukom, pitaj korisnika za potvrdu. Uvijek daj prednost najnovijem odgovoru korisnika.

Viber editor nije prikazao zasebna prilagođena polja za Botpress User varijable; ugrađena korisnička memorija konfigurirana je kao najbliža dostupna zamjena.

## Tok

1. **Pozdrav i namjera**
   - Pozdravi korisnika i ponudi pomoć oko preporuke staze ili pripreme za izlet.
   - Ako korisnik postavi pitanje o opremi ili savjetima, odgovori iz baze znanja.
   - Ako traži preporuku, započni prikupljanje samo podataka koji nedostaju.

2. **Kondicija**
   - Pitaj: „Koja najbolje opisuje tvoju kondiciju?”
   - Odgovori: „Početnik”, „Redovito planinarim”, „Iskusan planinar”.
   - Spremi odabir u `kondicija`.

3. **Regija**
   - Pitaj u kojoj regiji korisnik želi planinariti.
   - Ponudi: Zagreb i okolica, Gorski kotar, Velebit, Primorje i Istra, Dalmacija, Slavonija, „Svejedno”.
   - Spremi odabir u `regija`.

4. **Raspoloživo vrijeme**
   - Pitaj koliko sati korisnik ima za hodanje, uz napomenu da unese broj sati.
   - Prihvati samo broj veći od nule. Ako odgovor nije broj ili je nula/manji, pojasni očekivani unos i ponovi pitanje.
   - Spremi vrijednost u `raspoloziviSati`.

5. **Odabir staza**
   - Uključi samo staze čije je trajanje manje ili jednako `raspoloziviSati`.
   - Ako je `regija` različita od `sve`, uključi samo staze iz te regije.
   - Za `pocetnik` uključi samo lake staze; za `redovita` lake i srednje; za `iskusan` sve težine.
   - Poredaj rezultate prema prikladnosti kondiciji: početniku lake, redovitom planinaru srednje pa lake, iskusnom teške pa srednje pa lake. Kod iste težine prednost daj kraćem trajanju.
   - Predstavi najbolji rezultat i do dvije alternative, ako postoje.
   - Ako nema rezultata, nemoj izmišljati stazu. Reci da nema podudaranja i ponudi promjenu regije, raspoloživog vremena ili razine kondicije.

6. **Format preporuke**
   - Navedi naziv, regiju, težinu, trajanje, duljinu, visinsku razliku, polazište i vrh.
   - Ukratko objasni zašto odgovara zadanim kriterijima koristeći opis iz baze.
   - Ponudi poveznicu na `staze.html` za pregled svih staza.
   - Podsjeti korisnika da provjeri aktualnu prognozu i stanje staze. Za hitne slučajeve u Hrvatskoj navedi broj 112.

7. **Nastavak razgovora**
   - Sačuvaj preference za dodatna pitanja, primjerice „Što trebam ponijeti?”.
   - Ako korisnik izričito promijeni vrijeme, regiju ili kondiciju, ažuriraj samo odgovarajuću varijablu i ponovi preporuku.
   - Za vremensku prognozu, zatvaranja i aktualno stanje staza jasno reci da bot nema podatke uživo.

## Probni razgovori

### Početnik u okolici Zagreba

- Korisnik: „Tražim laganu stazu blizu Zagreba.”
- Bot pita za kondiciju, regiju i raspoloživo vrijeme ako ih već ne zna.
- Odgovori: početnik, Zagreb i okolica, 2 sata.
- Očekivana preporuka: **Japetić iz Šoićeve kuće** — laka staza, 1,5 h, 4 km, 300 m visinske razlike; polazište je Šoićeva kuća u Samoborskom gorju, a vrh Japetić (879 m).

### Srednja kondicija u Dalmaciji

- Odgovori: redovito planinarim, Dalmacija, 3 sata.
- Očekivana preporuka: **Vidova gora iz Bola** — srednje zahtjevna, 3 h, 6 km, 770 m visinske razlike; polazište je Bol, a vrh Vidova gora (778 m).

### Iskusan planinar na Velebitu

- Odgovori: iskusan planinar, Velebit, 8 sati.
- Očekivana preporuka: **Vaganski vrh iz Velike Paklenice** — teška staza, 8 h, 14 km, 1700 m visinske razlike. Bot treba napomenuti da je tura duga, preporučiti dovoljno vode i spomenuti mogućnost noćenja u domu ili skloništu.

### Nema podudaranja

- Odgovori: početnik, Zagreb i okolica, 1 sat.
- Očekivano ponašanje: bot kaže da nema staze koja zadovoljava sve uvjete i pita želi li povećati raspoloživo vrijeme ili odabrati drugu regiju. Ne smije preporučiti stazu koja ne zadovoljava ograničenja kao da ih zadovoljava.
