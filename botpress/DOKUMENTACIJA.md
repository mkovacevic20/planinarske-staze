# Dokumentacija chatbota StazeHR
Chatbot je napravljen za stranicu "planinarske-staze" u sklopu kolegija Tehnologije interaktivnog weba za prvi projektni rad.
Autori: Michel Kovačević i Noel Uran

## 1. Vrsta chatbota i razlog odabira

StazeHR je generativni AI chatbot s pretraživanjem vlastite baze znanja — pristup sličan RAG-u (Retrieval-Augmented Generation). Odabran je zato što korisnik može postaviti pitanje prirodnim jezikom, a agent može pronaći relevantne podatke o stazama i oblikovati odgovor prema kontekstu razgovora. Upute ograničavaju odgovore na podatke iz projekta i traže da agent ne nagađa kada podatak nedostaje.

## 2. Korištene tehnologije i alati

- **Botpress Cloud** — hosta AI agenta i konfiguraciju.
- **Botpress Playbook** — sadrži upute za prikupljanje kriterija i preporuku staze.
- **Knowledge Search i Knowledge → Files** — pretražuju učitane projektne materijale; odgovori mogu prikazati izvor.
- **Botpress User Memory** — ugrađena memorija konfigurirana za preferencije kondicije, regije i raspoloživog vremena.
- **Botpress Webchat v5** — prikazuje razgovor na web-stranici.
- **HTML stranice projekta** — učitavaju Webchat putem javnih Botpress skripti; za chatbot nije izrađen zaseban backend.

Integracija Webchata na stranicama projekta koristi ove skripte:

```html
<script src="https://cdn.botpress.cloud/webchat/v5.0/inject.js"></script>
<script src="https://files.bpcontent.cloud/2026/11/26/12/20261126123254-36CUXJLF.js" defer></script>
```

### Što je izrađeno za projekt, a što pruža Botpress

**Projektna konfiguracija i sadržaj:** hrvatski identitet i upute agenta, sigurnosna pravila, baza podataka o stazama i savjetima te Playbook „Preporuka planinarske staze”. Lokalni izvori su [agent-instructions.txt](./agent-instructions.txt), [knowledge-base.txt](./knowledge-base.txt) i [conversation-flow.md](./conversation-flow.md). U Botpress Knowledge → Files učitani su `knowledge-base.txt` i `conversation-flow.md`; odgovori s preporukama citiraju `knowledge-base.txt`.

**Ugrađene mogućnosti Botpressa:** AI runtime, Playbook editor i izvršavanje, Knowledge Search, izvori odgovora, Webchat v5 te User Memory. Nisu izrađeni vlastiti modeli, algoritam pretraživanja ni poslužiteljski API.

## 3. Prilagodba web-stranici i korisnicima

Agent je namijenjen posjetiteljima hrvatske stranice o planinarskim stazama. Naziv, opis, početna poruka i upute za odgovaranje prilagođeni su hrvatskom jeziku, prijateljskom tonu i obraćanju s „ti”. Učitana baza znanja opisuje 12 staza iz šest regija te sadrži savjete za pripremu i popis opreme.

Upute naglašavaju da agent treba koristiti podatke iz baze, ne izmišljati detalje staza i jasno navesti kada nema traženih informacija. Za sigurnost korisnika upućuje na provjeru prognoze i aktualnih uvjeta, kretanje markiranim stazama, obavještavanje druge osobe o planu te poziv na 112 u nuždi.

**Snimke implementacije**

![Hrvatski identitet i upute agenta u Botpressu](./screenshots/01-upute-agenta.png)

*Slika 1. Uloge i opseg agenta konfigurirani su na hrvatskom jeziku.*

![Datoteke učitane u Botpress Knowledge](./screenshots/02-baza-znanja.png)

*Slika 2. U Botpress Knowledge → Files nalaze se baza znanja i dokument tijeka razgovora.*

![Playbook za preporuku planinarske staze](./screenshots/03-playbook-preporuke.png)

*Slika 3. Playbook određuje kada se pokreće preporuka i kako agent koristi kriterije i Knowledge Search.*

## 4. Obrada upita i generiranje odgovora

Korisnik unosi poruku u Webchat, a Botpressov AI agent tumači namjeru. Za preporuku staze, Playbook provjerava jesu li poznati:

1. kondicija korisnika (početnik, redovito planinari ili iskusan),
2. željena regija ili odabir „svejedno”,
3. raspoloživo vrijeme u satima.

Agent koristi već navedene kriterije i preferencije dostupne u memoriji. Ako kriterij nedostaje, pita samo za prvi nedostajući podatak; ne zaključuje kondiciju iz želje za lakom stazom. Kada su kriteriji poznati, pretražuje bazu putem Knowledge Searcha te preporučuje samo staze koje odgovaraju regiji, vremenu i pravilima težine za odabranu kondiciju. Odgovor navodi dostupne podatke o stazi i može prikazati korišteni izvor. Ako nema odgovarajuće staze, agent to kaže i pita želi li korisnik promijeniti kriterij.

## 5. Dodatna funkcionalnost

Dodatna funkcionalnost je **personalizirana preporuka staze uz vođeno prikupljanje kriterija i memoriju korisničkih preferencija**. Umjesto da traži sve podatke ponovno, agent pita samo ono što nedostaje, a zatim koristi kondiciju, regiju i raspoloživo vrijeme za filtriranje ponuda. Primjeri 1 i 2 u nastavku prikazuju cijeli tijek od dopunskog pitanja do preporuke.

U konfiguriranom editoru nisu bila dostupna zasebna prilagođena polja korisnika (user variables). Zato je uključena ugrađena User Memory kao najbliža dostupna mogućnost. Test potvrđuje korištenje kriterija unutar istog razgovora, trajnost preferencija kroz različite razgovore nije zasebno testirana.

## 6. Testiranje i uočene poteškoće

Provjereni su hrvatski odgovori, prikupljanje kriterija, preporuka iz baze i ponašanje kada nema podudaranja. Preporuka je u probnom razgovoru prikazala i izvor `knowledge-base.txt`.

### Primjer 1 — nedostaje podatak o kondiciji

**Upit:** „Želim laganu stazu u regiji Zagreb i okolica. Imam 2 sata na raspolaganju.”

**Odgovor:** „Bok! Ja sam StazeHR, tvoj AI planinarski vodič. Kakva je tvoja kondicija: početnik, redovito planinariš ili si iskusan?”

**Rezultat:** Prošao. Bot nije pretpostavio kondiciju na temelju želje za laganom stazom i pitao je samo za nedostajući podatak.

![Chatbot pita za nedostajuću kondiciju](./screenshots/02-nedostajuci-kriterij.png)

*Slika 4. Prvi korak personalizirane preporuke.*

### Primjer 2 — preporuka nakon dopune kriterija

**Nastavak razgovora:** „Početnik sam.”

**Odgovor:** Bot preporučuje **Japetić iz Šoićeve kuće** u regiji Zagreb i okolica. Navodi da je staza laka, traje 1,5 sat, duga je 4 km i ima 300 m visinske razlike; polazište je Šoićeva kuća, a cilj vrh Japetić (879 m). Odgovor obrazlaže da je staza prikladna početniku i stane u raspoloživa 2 sata, uz sigurnosni podsjetnik i izvor `knowledge-base.txt`.

**Rezultat:** Prošao. Preporuka odgovara kriterijima iz prethodne poruke, a staza i njezini podaci nalaze se u učitanoj bazi.

![Preporuka Japetića uz podatke i izvor](./screenshots/03-preporuka-japetic.png)

*Slika 5. Bot koristi kriterije iz prethodne poruke i citira bazu znanja.*

### Primjer 3 — nema staze koja zadovoljava kriterije

**Upit:** „Kao početnik želim stazu u Dalmaciji do 1 sata. Što preporučuješ?”

**Odgovor:** „Za početnika u Dalmaciji nema staze koja traje do 1 sata. Najkraća laka staza u bazi traje 1,5 sat, ali nalazi se u regiji Primorje i Istra; dalmatinske staze traju najmanje 3 sata i nisu lake. Želiš li promijeniti regiju, raspoloživo vrijeme ili kriterij kondicije?”

**Rezultat:** Prošao. Bot nije predstavio neodgovarajuću stazu kao prikladnu, objasnio je razlog i ponudio promjenu kriterija.

![Odgovor chatbota kada nema odgovarajuće staze](./screenshots/04-bez-podudaranja.png)

*Slika 6. Bot jasno prijavljuje da nema podudaranja.*

Tijekom konfiguracije ranija poveznica na Botpress Studio prikazivala je „Bot not found”; postavke su dovršene u dostupnom Botpress editoru, a agent je objavljen. U samom Webchatu hrvatski su naziv, opis, polje za unos i odgovori, no neki ugrađeni Botpress elementi, primjerice oznaka izvora i potpis „by Botpress”, ostaju na engleskom.

## 7. Ograničenja i moguća poboljšanja

- Baza je statična i sadrži ograničen broj staza; ne prikazuje trenutno vrijeme, zatvaranja, prohodnost, stanje markacija ni dostupnost domova.
- Botpress User Memory zamjenjuje zasebna prilagođena polja. Njezino zadržavanje preferencija kroz različite razgovore nije potvrđeno testom.
- Odgovore generira AI prema uputama i pronađenim izvorima; Playbook nije deterministički programski filtar, pa odgovor ipak može odstupiti od pravila i zahtijeva nadzor.
- Dio standardnog sučelja Webchata ostaje na engleskom.

Moguća poboljšanja su redovito ažuriranje baze, integracija provjerenog izvora za vremenske i službene obavijesti, dodatno testiranje memorije kroz nove razgovore te provjera podržava li trenutna verzija Botpressa prilagođena polja i lokalizaciju preostalih elemenata Webchata.

## Literatura

- Botpress – Documentation – Dokumentacija platforme i integracija. https://botpress.com/docs/botpress-hub/
- Botpress – Knowledge Bases – Korištenje vlastitih sadržaja za odgovore. https://www.botpress.com/docs/learn/reference/knowledge-base/introduction/
