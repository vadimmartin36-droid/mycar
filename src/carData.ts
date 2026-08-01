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

export const CAR_CONFIG = {
  // Основные данные автомобиля
  brand: "Citroën",
  model: "C4 Picasso",
  year: 2007,
  engine: "1.6 HDi (109 KM / 80 kW)",
  mileage: "274 000 km",
  mileageNum: 274000,
  pricePLN: "9 999 PLN",
  priceEUR: "~2 300 EUR",
  location: "Warszawa, Mazowieckie",
  vin: "VF7UD9HZC45892104",
  color: "Złoty Metallic (Champagne Gold)",
  transmission: "Manualna (5-biegowa)",
  fuelType: "Diesel (Common Rail)",
  bodyType: "Minivan / MPV (5-miejscowy)",
  
  // Изображения автомобиля
  images: {
    hero: heroImg,
    interior: interiorImg,
    rear: rearImg,
    trunk: trunkImg,
    dashboard: dashboardImg,
    wheels: wheelsImg,
    gallery: []
  },

  // Контактные данные продавца
  seller: {
    name: "Właściciel",
    telegramUrl: "https://t.me/citroenc4picasso",
    whatsappUrl: "https://wa.me/48500000000",
    facebookUrl: "https://m.me/citroenc4picasso",
    email: "kontakt@citroenc4picasso.pl",
    city: "Warszawa, Mazowieckie",
    workingHours: "Poniedziałek - Niedziela: 08:00 - 21:00",
    olxUrl: "https://www.olx.pl",
    instagramUrl: "https://www.instagram.com"
  },

  // Карточки основных характеристик (Ubezpieczenie, Badanie techniczne, Serwis, Opony, Właściciele)
  keySpecs: [
    {
      id: "ubezpieczenie",
      title: "Ubezpieczenie OC",
      value: "Ważne do 11.2026",
      subtext: "Opłacone w całości, przechodzi na nowego właściciela",
      icon: "🛡️",
      badge: "Ważne"
    },
    {
      id: "badanie",
      title: "Badanie Techniczne",
      value: "Ważne do 09.2026",
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
      value: "Komplet Zimowy + Letni",
      subtext: "Opony letnie Michelin z 2023 r., alufelgi 16\"",
      icon: "🛞",
      badge: "2 Komplety"
    },
    {
      id: "wlasciciele",
      title: "Właściciele",
      value: "2. Właściciel w Polsce",
      subtext: "Garażowany, używany prywatnie na trasach",
      icon: "👤",
      badge: "Prywatny"
    },
    {
      id: "spalanie",
      title: "Średnie Spalanie",
      value: "4.8 - 5.4 l / 100 km",
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
        "Elektrycznie składane i podgrzewane lusterka",
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
        "Alufelgi fabryczne Citroën 16 cali",
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
    "Na sprzedaż prywatny, wysoce zadbany Citroën C4 Picasso z niezawodnym i oszczędnym silnikiem 1.6 HDi. Samochód jest bezwypadkowy, serwisowany regularnie i używany jako autko rodzinne głównie w trasach.",
    "Silnik pracuje równo, cicho i płynnie. Nie pobiera oleju, nie dymi i charakteryzuje się świetną dynamiką przy spalaniu na poziomie około 5.0 litrów na 100 km. Zawieszenie pozbawione stuków, prowadzi się sprężyście i pewnie.",
    "Wnętrze jest czyste, zadbane i pachnące. Gigantyczna panoramiczna przednia szyba zapewnia nieporównywalne z innymi autami doznania z jazdy i idealne doświetlenie kabiny. Samochód jest w pełni gotowy do drogi, nie wymaga absolutnie żadnego wkładu finansowego."
  ],

  // FAQ / Pytania i Odpowiedzi
  faqs: [
    {
      question: "Czy auto jest bezwypadkowe?",
      answer: "Tak, samochód jest w 100% bezwypadkowy. Wszystkie szyby i elementy blacharskie posiadają fabryczne oznaczenia."
    },
    {
      question: "Czy można sprawdzić samochód na stacji kontroli pojazdów?",
      answer: "Zdecydowanie tak! Zgadzam się na wizytę na dowolnej stacji diagnostycznej lub w autoryzowanym serwisie w Warszawie i okolicach."
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
