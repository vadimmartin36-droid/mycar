/* ==========================================================================
   МОИ ДАННЫЕ / MOJE DANE
   Здесь расположены все основные параметры автомобиля, цены, контакты,
   галерея и характеристики. Вы можете изменять любые значения ниже.
   ========================================================================== */

import heroImg from './assets/images/citroen_c4_hero_1785044801876.jpg';
import interiorImg from './assets/images/citroen_c4_interior_1785044814261.jpg';
import rearImg from './assets/images/citroen_c4_rear_1785044826811.jpg';
import trunkImg from './assets/images/citroen_c4_trunk_1785540318427.jpg';
import dashboardImg from './assets/images/citroen_c4_dashboard_1785540332304.jpg';
import wheelsImg from './assets/images/citroen_c4_wheels_1785540344092.jpg';

export const DEFAULT_GALLERY_ITEMS = [
  { id: 'def-1', title: 'Citroën C4 Picasso - Przód / Sylwetka', src: heroImg, category: 'Nadwozie' },
  { id: 'def-2', title: 'Citroën C4 Picasso - Wnętrze / Tapicerka', src: interiorImg, category: 'Wnętrze' },
  { id: 'def-3', title: 'Citroën C4 Picasso - Tył / Nadwozie', src: rearImg, category: 'Nadwozie' },
  { id: 'def-4', title: 'Citroën C4 Picasso - Deska Rozdzielcza', src: dashboardImg, category: 'Detale' },
  { id: 'def-5', title: 'Citroën C4 Picasso - Pojemny Bagażnik', src: trunkImg, category: 'Detale' },
  { id: 'def-6', title: 'Citroën C4 Picasso - Felgi i Opony', src: wheelsImg, category: 'Detale' }
];

export const CAR_CONFIG = {
  // Основные данные автомобиля
  brand: "Citroën",
  model: "C4 Picasso",
  year: 2007,
  engine: "1.6 HDi (109 KM / 80 kW)",
  mileage: "274 000 km",
  mileageNum: 274000,
  pricePLN: "8 999 zł",
  priceEUR: "~2 100 EUR",
  location: "Łódź, Łódzkie",
  vin: "VF7UD9HZC45205083",
  color: "Biały",
  transmission: "Manualna (5-biegowa)",
  fuelType: "Diesel (Common Rail)",
  bodyType: "Minivan / MPV (5-miejscowy)",
  statusBadge: "Stan Bardzo Dobry",
  price: "8 999 zł",
  fuelConsumption: "5.2 l / 100 km",
  
  // Изображения автомобиля
  images: {
    hero: heroImg,
    interior: interiorImg,
    rear: rearImg,
    trunk: trunkImg,
    dashboard: dashboardImg,
    wheels: wheelsImg,
    gallery: DEFAULT_GALLERY_ITEMS
  },

  // Контактные данные продавца
  seller: {
    name: "Właściciel",
    phone: "+48 500 000 000",
    telegramUrl: "https://t.me/vadimmartin",
    whatsappUrl: "https://wa.me/48500000000",
    facebookUrl: "https://www.facebook.com/vdjvadimmartin",
    email: "kontakt@citroenc4picasso.pl",
    city: "Łódź, Łódzkie",
    workingHours: "Poniedziałek - Niedziela: 08:00 - 21:00",
    olxUrl: "https://www.olx.pl",
    instagramUrl: "https://www.instagram.com"
  },

  // Карточки основных характеристик (Ubezpieczenie, Badanie techniczne, Serwis, Opony, Właściciele)
  keySpecs: [
    {
      id: "ubezpieczenie",
      title: "Ubezpieczenie OC",
      value: "Ważne do 13.06.2027",
      subtext: "Opłacone w całości, przechodzi na nowego właściciela",
      icon: "🛡️",
      badge: "Ważne"
    },
    {
      id: "badanie",
      title: "Badanie Techniczne",
      value: "Ważne do 22.12.2026",
      subtext: "Przegląd przeszło bez najmniejszych zastrzeżeń",
      icon: "📋",
      badge: "Aktualne"
    },
    {
      id: "serwis",
      title: "Ostatni Serwis",
      value: "271 500 km",
      subtext: "Wymiana oleju Total 5W30, filtrów oraz rozrządu",
      icon: "🔧",
      badge: "Świeży"
    },
    {
      id: "opony",
      title: "Opony i Koła",
      value: "Zalecana wymiana opon",
      subtext: "Obecne opony kwalifikują się do wymiany. Drugi komplet kół nie wchodzi w cenę pojazdu.",
      icon: "🛞",
      badge: "Do wymiany",
      badgeType: "warning"
    },
    {
      id: "wlasciciele",
      title: "Właściciele",
      value: "3. Właściciel w Polsce",
      subtext: "Garażowany, używany prywatnie na trasach",
      icon: "👤",
      badge: "Prywatny"
    },
    {
      id: "spalanie",
      title: "Średnie Spalanie",
      value: "5.6 l / 100 km",
      subtext: "Niezwykle oszczędny silnik 1.6 HDi",
      icon: "⛽",
      badge: "Eko"
    }
  ],

  // Подробная комплектация автомобиля (Wyposażenie)
  equipmentCategories: [
    {
      category: "Komfort & Wnętrze",
      items: [
        "Klimatyzacja automatyczna dwustrefowa (Climatronic)",
        "Panoramiczna przednia szyba (Citroën Visiospace)",
        "Wielofunkcyjna kierownica z nieruchomym środkiem",
        "Komputer pokładowy z wyświetlaczem centralnym",
        "Elektrycznie sterowane szyby przednie i tylne",
        "Podłokietniki dla kierowcy i pasażera",
        "Rolety przeciwsłoneczne w tylnych drzwiach",
        "Stoliki lotnicze w oparciach przednich foteli"
      ]
    },
    {
      category: "Bezpieczeństwo & Technologia",
      items: [
        "Systemy bezpieczeństwa ABS, ESP, EBD, ASR",
        "7 poduszek powietrznych (w tym kolanowa kierowcy)",
        "System wspomagania ruszania na wzniesieniu (Hill Holder)",
        "Automatyczny hamulec postojowy (elektryczny)",
        "Czujniki deszczu oraz czujnik zmierzchu",
        "Mocowania ISOFIX na 3 niezależnych fotelach z tyłu",
        "Tempomat z ogranicznikiem prędkości",
        "Centralny zamek z pilotem"
      ]
    },
    {
      category: "Multimedia & Dodatki",
      items: [
        "Oryginalne radio CD/MP3 ze sterowaniem w kierownicy",
        "Nagłośnienie Fabryczne (6 głośników)",
        "Felgi stalowe 16 cali",
        "Światła przeciwmgielne przednie",
        "Liczne schowki (w desce rozdzielczej i podłodze)",
        "Chłodzony schowek centralny na napoje",
        "Pełnowymiarowe koło zapasowe w bagażniku"
      ]
    }
  ],

  // История обслуживания (Historia serwisowa)
  serviceHistory: [
    {
      date: "05.2026 / 271 500 km",
      title: "Duży przegląd okresowy + Rozrząd",
      desc: "Wymiana kompletnego rozrządu z pompą wody (INA), wymiana oleju Total Quartz 9000 5W30 oraz komplet filtrów (oleju, powietrza, paliwa, kabinowy)."
    },
    {
      date: "11.2025 / 265 000 km",
      title: "Serwis układu hamulcowego i zawieszenia",
      desc: "Wymiana tarcz i klocków hamulcowych z przodu i z tyłu (Brembo). Nowe łączniki stabilizatora i końcówki drążków kierowniczych."
    },
    {
      date: "04.2025 / 258 000 km",
      title: "Serwis Klimatyzacji",
      desc: "Odgrzybianie ozonowe, wymiana filtra cząstek stałych, uzupełnienie czynnika chłodniczego R134a i test szczelności."
    },
    {
      date: "09.2024 / 249 000 km",
      title: "Wymiana akumulatora i regeneracja alternatora",
      desc: "Nowy akumulator Varta Silver Dynamic, regeneracja alternatora dla bezawaryjnej pracy w warunkach zimowych."
    }
  ],

  // Описание продавца (Opis pojazdu)
  descriptionParagraphs: [
    "Sprzedaję prywatny, bardzo dobry Citroën C4 Picasso z niezawodnym i ekonomicznym silnikiem 1.6 HDi. Samochód nie był w wypadkach, używany jako auto rodzinne – głównie po mieście.",
    "Silnik pracuje bez zarzutu. Nie bierze oleju, nie dymi, a dynamika przyjemnie zaskakuje przy spalaniu około 5,0 l/100 km. Zawieszenie pozbawione stuków, sprężyste i pewne.",
    "Wnętrze jest w dobrym stanie. Ogromna, panoramiczna przednia szyba daje niezapomniane wrażenia za kierownicą i zalewa wnętrze światłem.",
    "Samochód nie jest nowy, więc drobne mankamenty są do przyjęcia!"
  ],

  // Historia CEPiK (Oficjalny Raport z Krajowego Rejestru Pojazdów)
  cepikHistory: [
    {
      id: "cepik-1",
      date: "2007",
      category: "production",
      title: "Rok produkcji pojazdu",
      subtitle: "Wykaz fabryczny Citroën",
      badge: "Fabryczny",
      badgeType: "gold",
      details: [
        { label: "Wykaz", value: "Rok produkcji: 2007" }
      ]
    },
    {
      id: "cepik-2",
      date: "29.10.2007",
      category: "registration",
      title: "Pierwsza rejestracja za granicą",
      subtitle: "Rejestracja w kraju pochodzenia",
      badge: "Import",
      badgeType: "info",
      details: [
        { label: "Kraj pierwszej rejestracji", value: "Za granicą (UE)" }
      ]
    },
    {
      id: "cepik-3",
      date: "05.09.2010",
      category: "owner",
      title: "Pierwszy właściciel w Polsce",
      subtitle: "Właściciel do 08.07.2014",
      badge: "Właściciel",
      badgeType: "info",
      details: [
        { label: "Typ właściciela", value: "Osoba fizyczna" },
        { label: "Województwo", value: "Wielkopolskie" },
        { label: "Okres posiadania", value: "05.09.2010 – 08.07.2014" }
      ]
    },
    {
      id: "cepik-4",
      date: "05.09.2010",
      category: "owner",
      title: "Dodanie współwłaściciela",
      subtitle: "Współwłaściciel do 15.07.2014",
      badge: "Współwłaściciel",
      badgeType: "info",
      details: [
        { label: "Typ współwłaściciela", value: "Osoba fizyczna" },
        { label: "Okres posiadania", value: "05.09.2010 – 15.07.2014" }
      ]
    },
    {
      id: "cepik-5",
      date: "29.10.2010",
      category: "registration",
      title: "Pierwsza rejestracja w Polsce",
      subtitle: "Wprowadzony do bazy CEPiK",
      badge: "Rejestracja PL",
      badgeType: "gold",
      details: [
        { label: "Kraj rejestracji", value: "Polska" }
      ]
    },
    {
      id: "cepik-6",
      date: "18.09.2012",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 18.09.2013",
      badge: "Pozytywny",
      badgeType: "success",
      skpCode: "FZI/010",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 18.09.2013" },
        { label: "Numer SKP", value: "FZI/010" }
      ]
    },
    {
      id: "cepik-7",
      date: "25.11.2013",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 25.11.2014",
      badge: "Pozytywny",
      badgeType: "success",
      skpCode: "FZI/010",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 25.11.2014" },
        { label: "Numer SKP", value: "FZI/010" }
      ]
    },
    {
      id: "cepik-8",
      date: "08.07.2014",
      category: "owner",
      title: "Zmiana właściciela",
      subtitle: "Właściciel do 17.10.2014",
      badge: "Właściciel",
      badgeType: "info",
      details: [
        { label: "Typ właściciela", value: "Osoba fizyczna" },
        { label: "Województwo", value: "Wielkopolskie" }
      ]
    },
    {
      id: "cepik-9",
      date: "17.10.2014",
      category: "owner",
      title: "Zmiana właściciela",
      subtitle: "Właściciel do 23.04.2016",
      badge: "Firma / Org.",
      badgeType: "info",
      details: [
        { label: "Typ właściciela", value: "Firma lub organizacja" },
        { label: "Województwo", value: "Wielkopolskie" }
      ]
    },
    {
      id: "cepik-10",
      date: "25.11.2014",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 25.11.2015",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 183119,
      mileageFormatted: "183 119 km",
      skpCode: "PSE/005",
      note: "Początek oficjalnego gromadzenia stanu licznika w systemie CEPiK",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 25.11.2015" },
        { label: "Odczytany stan licznika", value: "183 119 km" },
        { label: "Numer SKP", value: "PSE/005" }
      ]
    },
    {
      id: "cepik-11",
      date: "29.12.2015",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 29.12.2016",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 200801,
      mileageFormatted: "200 801 km",
      skpCode: "PLE/007/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 29.12.2016" },
        { label: "Odczytany stan licznika", value: "200 801 km" },
        { label: "Numer SKP", value: "PLE/007/P" }
      ]
    },
    {
      id: "cepik-12",
      date: "23.04.2016",
      category: "owner",
      title: "Zmiana właściciela",
      subtitle: "Długoletni właściciel prywatny (2016–2025)",
      badge: "Właściciel (9 lat)",
      badgeType: "gold",
      details: [
        { label: "Typ właściciela", value: "Osoba fizyczna" },
        { label: "Województwo", value: "Łódzkie" },
        { label: "Okres posiadania", value: "23.04.2016 – 07.04.2025" }
      ]
    },
    {
      id: "cepik-13",
      date: "30.12.2016",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 30.12.2017",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 213863,
      mileageFormatted: "213 863 km",
      skpCode: "EZG/01",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 30.12.2017" },
        { label: "Odczytany stan licznika", value: "213 863 km" },
        { label: "Numer SKP", value: "EZG/01" }
      ]
    },
    {
      id: "cepik-14",
      date: "29.12.2017",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 29.12.2018",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 225496,
      mileageFormatted: "225 496 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 29.12.2018" },
        { label: "Odczytany stan licznika", value: "225 496 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-15",
      date: "28.12.2018",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2019",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 234444,
      mileageFormatted: "234 444 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2019" },
        { label: "Odczytany stan licznika", value: "234 444 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-16",
      date: "28.12.2019",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2020",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 242542,
      mileageFormatted: "242 542 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2020" },
        { label: "Odczytany stan licznika", value: "242 542 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-17",
      date: "28.12.2020",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2021",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 248484,
      mileageFormatted: "248 484 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2021" },
        { label: "Odczytany stan licznika", value: "248 484 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-18",
      date: "28.12.2021",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2022",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 253578,
      mileageFormatted: "253 578 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2022" },
        { label: "Odczytany stan licznika", value: "253 578 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-19",
      date: "28.12.2022",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2023",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 258596,
      mileageFormatted: "258 596 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2023" },
        { label: "Odczytany stan licznika", value: "258 596 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-20",
      date: "28.12.2023",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2024",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 263593,
      mileageFormatted: "263 593 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2024" },
        { label: "Odczytany stan licznika", value: "263 593 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-21",
      date: "28.12.2024",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Ważne do 28.12.2025",
      badge: "Pozytywny",
      badgeType: "success",
      mileageKm: 267221,
      mileageFormatted: "267 221 km",
      skpCode: "EZG/028/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 28.12.2025" },
        { label: "Odczytany stan licznika", value: "267 221 km" },
        { label: "Numer SKP", value: "EZG/028/P" }
      ]
    },
    {
      id: "cepik-22",
      date: "07.04.2025",
      category: "owner",
      title: "Zbycie pojazdu & Zmiana właściciela",
      subtitle: "Zmiana właściciela na osobę fizyczną",
      badge: "Zbycie / Zmiana",
      badgeType: "info",
      details: [
        { label: "Wydarzenie", value: "Zbycie pojazdu" },
        { label: "Właściciel", value: "Osoba fizyczna" },
        { label: "Województwo", value: "Łódzkie" }
      ]
    },
    {
      id: "cepik-23",
      date: "22.12.2025",
      category: "inspection",
      title: "Okresowe badanie techniczne",
      subtitle: "Aktualny stan – Ważne do 22.12.2026!",
      badge: "Ważne do 2026",
      badgeType: "success",
      mileageKm: 271594,
      mileageFormatted: "271 594 km",
      skpCode: "EL/115/P",
      details: [
        { label: "Wynik badania", value: "Pozytywny" },
        { label: "Ważność badania", value: "do 22.12.2026" },
        { label: "Odczytany stan licznika", value: "271 594 km" },
        { label: "Numer SKP", value: "EL/115/P" }
      ]
    }
  ],

  // Wykres przebiegu według oficjalnych badań technicznych CEPiK
  mileageHistory: [
    { year: "2014", date: "25.11.2014", mileage: 183119, label: "183 119 km", skp: "PSE/005" },
    { year: "2015", date: "29.12.2015", mileage: 200801, label: "200 801 km", skp: "PLE/007/P" },
    { year: "2016", date: "30.12.2016", mileage: 213863, label: "213 863 km", skp: "EZG/01" },
    { year: "2017", date: "29.12.2017", mileage: 225496, label: "225 496 km", skp: "EZG/028/P" },
    { year: "2018", date: "28.12.2018", mileage: 234444, label: "234 444 km", skp: "EZG/028/P" },
    { year: "2019", date: "28.12.2019", mileage: 242542, label: "242 542 km", skp: "EZG/028/P" },
    { year: "2020", date: "28.12.2020", mileage: 248484, label: "248 484 km", skp: "EZG/028/P" },
    { year: "2021", date: "28.12.2021", mileage: 253578, label: "253 578 km", skp: "EZG/028/P" },
    { year: "2022", date: "28.12.2022", mileage: 258596, label: "258 596 km", skp: "EZG/028/P" },
    { year: "2023", date: "28.12.2023", mileage: 263593, label: "263 593 km", skp: "EZG/028/P" },
    { year: "2024", date: "28.12.2024", mileage: 267221, label: "267 221 km", skp: "EZG/028/P" },
    { year: "2025", date: "22.12.2025", mileage: 271594, label: "271 594 km", skp: "EL/115/P" }
  ],

  // FAQ / Pytania i Odpowiedzi
  faqs: [
    {
      question: "Czy auto jest bezwypadkowe?",
      answer: "Tak, samochód jest w 100% bezwypadkowy."
    },
    {
      question: "Czy można sprawdzić samochód na stacji kontroli pojazdów?",
      answer: "Można! Koszt przeglądu pokrywa jednak kupujący. Ważne, żeby pamiętać, że samochód nie jest nowy!"
    },
    {
      question: "Czy cena podlega negocjacji?",
      answer: "Dopuszczam rozsądną negocjację ceny po obejrzeniu auta na miejscu."
    },
    {
      question: "Jakie dokumenty przekazuję przy zakupie?",
      answer: "Dowód rejestracyjny, kartę pojazdu, aktualną polisę OC, zaświadczenie o badaniu technicznym oraz komplet 2 oryginalnych kluczyków z pilotem."
    }
  ]
};
