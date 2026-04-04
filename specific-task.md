11. Véradás nyilvántartó rendszer
Általános leírás
A feladat célja egy véradásokkal kapcsolatos adminisztrációt segítő nyilvántartó rendszer fejlesztése.

Felhasználási esetek
Helyszínek kezelése
Készítsen felületet véradási helyszínek adatainak (azonosító, intézmény neve, cím) rögzítésére! Biztosítsa továbbá a tárolt helyszínek megjelenítését. Amennyiben egy helyszínen éppen nincs lehetőség véradásra, tegye lehetővé annak ideiglenes inaktiválását (az inaktivált helyszíneken nem vihető fel a rendszerbe újabb véradás). Biztosítsa az újbóli aktiválás lehetőségét is!

Véradó adatainak felvitele
Készítsen felületet a véradók adatainak (név, nem, állampolgárság, születési hely, születési idő, lakcím, TAJ szám) rögzítésére! A véradó TAJ számát ellenőrizze: „A TAJ szám egy kilenc számjegyből álló szám, amelyben az első nyolc számjegy egy folyamatosan kiadott egyszerű sorszám, amely mindig az előző, utoljára kiadott sorszámból egy hozzáadásával keletkezik. A kilencedik számjegy ellenőrző ún. CDV kód, melynek képzési algoritmusa az alábbi: A TAJ szám első nyolc számjegyéből a páratlan helyen állókat hárommal, a páros helyen állókat héttel szorozzuk, és a szorzatokat összeadjuk. Az összeget tízzel elosztva a maradékot tekintjük a kilencedik, azaz CDV kódnak.”.

Amennyiben a TAJ szám formátuma nem megfelelő, jelenítsen meg hibaüzenetet és ne mentse el az adatokat!

Véradás rögzítése
Tegye lehetővé a véradások rögzítését az alábbiak szerint:

1. Először a véradás helyszínét, majd a véradó személyét kell kiválasztani.

2. Meg kell adni a véradás napját, ami alapértelmezetten az aktuális dátum.

3. Rögzíteni kell, hogy a jelölt alkalmas-e a véradásra. Amennyiben nem, el kell tárolni ennek okát is. Mindkét esetben tárolni kell továbbá a vizsgálatot elvégző orvos nevét.

4. Rögzíteni kell, hogy irányított véradás történik-e. Amennyiben igen, meg kell adni a beteg teljes nevét és TAJ számát is.

Ellenőrizze az űrlap helyes kitöltését (pl. ha a jelölt nem alkalmas a véradásra, akkor nem történhet irányított véradás sem; irányított véradás esetén a megjelölt beteg TAJ számának is érvényesnek kell lennie), csak helyesen kitöltött űrlap kerülhessen mentésre!

Véradások megtekintése
Tegye lehetővé a sikeres véradások megjelenítését! Biztosítsa a szűrés lehetőségét helyszín, véradó, és időintervallum (nyitó- és záró dátum) szerint!