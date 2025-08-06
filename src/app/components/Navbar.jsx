"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  X,
  Menu,
  Search,
  Bell,
  Heart,
  ShoppingCart,
  Mail,
  Phone,
  Laptop,
  Home,
  Shirt,
  Dumbbell,
  HeartPulse,
  Music,
  Car,
  SprayCan,
  Hammer,
  Shovel,
  ShoppingBag,
  Baby,
  Utensils,
  Notebook,
  ShoppingBagIcon,
  User,
  MapPin,
  Download,
  HomeIcon,
} from "lucide-react";
import { useCartStore } from "./hooks/cart";
import { useHomeLikes } from "./hooks/likes";
import { useAuth } from "./hooks/useAuth";
import CategoryList from "./CategoryList";
import NotificationModal from "../notifacation/page";
import { useNotificationsStore } from "../store/useNotificationsStore";

const getCategoryIcon = (categoryName) => {
  switch (categoryName) {
    case "Telefonlar":
      return <Phone className="w-4 h-4 mr-2" />;
    case "Noutbuklar va kompyuterlar":
      return <Laptop className="w-4 h-4 mr-2" />;
    case "Maishiy texnika":
      return <Home className="w-4 h-4 mr-2" />;
    case "Kiyim":
      return <Shirt className="w-4 h-4 mr-2" />;
    case "Sport va hordiq":
      return <Dumbbell className="w-4 h-4 mr-2" />;
    case "Salomatlik":
      return <HeartPulse className="w-4 h-4 mr-2" />;
    case "Xobbi va ijod":
      return <Music className="w-4 h-4 mr-2" />;
    case "Avtotovarlar":
      return <Car className="w-4 h-4 mr-2" />;
    case "Maishiy va kimyoviy moddalar":
      return <SprayCan className="w-4 h-4 mr-2" />;
    case "Qurilish va ta'mirlash":
      return <Hammer className="w-4 h-4 mr-2" />;
    case "Poyabzallar":
      return <Shovel className="w-4 h-4 mr-2" />;
    case "Aksessuarlar":
      return <ShoppingBag className="w-4 h-4 mr-2" />;
    case "Bolalar tovarlari":
      return <Baby className="w-4 h-4 mr-2" />;
    case "Oziq-ovqat mahsulotlari":
      return <Utensils className="w-4 h-4 mr-2" />;
    case "Kanselyariya tovarlari":
      return <Notebook className="w-4 h-4 mr-2" />;
    default:
      return <ShoppingBagIcon className="w-4 h-4 mr-2" />;
  }
};

const categoriesData = [
  {
    name: "Telefonlar",
    sub: [
      {
        title: "Smartfonlar",
        items: [
          "iPhone",
          "Samsung",
          "Xiaomi",
          "Realme",
          "Honor",
          "Vivo",
          "Oppo",
          "Infinix",
          "Poco",
          "Tecno",
          "Motorola",
          "Asus",
          "Nokia",
        ],
      },
      {
        title: "Aksessuarlar",
        items: [
          "G'ilof va himoya plyonkalar",
          "Zaryadlovchi qurilmalar",
          "Quvvat bank (Powerbank)",
          "Telefon ushlagichlar (Holder)",
          "Ekran himoyachilari (Tempered glass)",
          "Kabellar (USB, Type-C, Lightning)",
          "MagSafe aksessuarlar",
          "Mobil telefonlar uchun gajetlar",
        ],
      },
      {
        title: "Naushniklar va audio",
        items: [
          "Bluetooth naushniklar",
          "True Wireless (TWS) naushniklar",
          "Quloq ichiga joylashuvchi naushniklar",
          "Quloq usti naushniklar",
          "Ovoz kuchaytirgichli quloqchinlar",
          "Mikrofonli naushniklar",
          "Apple AirPods",
          "Samsung Galaxy Buds",
        ],
      },
      {
        title: "Smart soatlar va bilaguzuklar",
        items: [
          "Apple Watch",
          "Samsung Galaxy Watch",
          "Xiaomi Smart Band",
          "Huawei Watch",
          "Aqlli bilaguzuklar",
          "GPS sport soatlar",
          "Qon bosimi va yurak urishi o‘lchovchi soatlar",
        ],
      },
      {
        title: "Telefonlar uchun kamera va media",
        items: [
          "Mobil gimbal stabilizatorlar",
          "Mobil LED yoritkichlar",
          "Mobil mikrofonlar",
          "Telefonlar uchun kamera linzalari",
          "Tripod va selfie stick'lar",
        ],
      },
      {
        title: "SIM kartalar va raqamlar",
        items: [
          "Esim aktivatsiya xizmatlari",
          "Oddiy SIM kartalar (UZMOBILE, Beeline, Ucell, Humans)",
          "VIP raqamlar",
          "Ikkinchi raqam ilovalari",
        ],
      },
      {
        title: "Zaryadlash va quvvat",
        items: [
          "Tez zaryadlovchilar (Fast chargers)",
          "Avtomobil zaryadlovchilari",
          "Quvvat o‘lchovchi adapterlar",
          "Magnetik zaryadlovchilar",
          "Wireless chargers (Simsiz zaryad)",
        ],
      },
    ],
  },
  {
    name: "Noutbuklar va kompyuterlar",
    sub: [
      {
        title: "Noutbuk va aksessuarlar",
        items: [
          "Shaxsiy kompyuter uchun keyslar",
          "Laptop Notebooklar",
          "Shaxsiy kompyuter uchun monitorlar",
          "Quloqchinlar",
          "Mishkalar",
          "Aksessuarlar",
          "Koverlar",
          "Videokartalar",
          "Protsessorlar",
          "Kompyuter sovutish tizimi",
          "Block power kompyuter uchun",
          "Keyboard",
        ],
      },
      {
        title: "Kompyuterlar va Monitorlar",
        items: ["Kompyuterlar", "Monobloklar", "Monitorlar"],
      },
      {
        title: "Tashqi qurilmalar",
        items: [
          "Garnituralar",
          "Akkumulyatorlar (UPS)",
          "Akustika va karnay",
          "Klaviatura va sichqoncha to'plami",
          "Klaviatura",
          "Sichqoncha",
          "Veb-kamera",
          "Mikrofonlar va aksessuarlar",
          "UPS",
          "Sichqoncha uchun gilamchalar",
          "Kompyuter ko'zoynaklari",
        ],
      },
      {
        title: "Printerlar va sarf materiallar",
        items: ["Printer MFU", "Printer"],
      },
      {
        title: "Kompyuter aksessuarlari",
        items: [
          "Ichki qattiq disklar va SSD",
          "Protsessorlar",
          "Ona plata",
          "Korpus",
          "Quvvat manbalari",
          "Operativ xotira",
          "Video kartalari",
        ],
      },
      {
        title: "Geymerlar uchun mebel",
        items: ["Ofis kreslosi", "O'yin stullari"],
      },
      {
        title: "Tarmoq uskunalari",
        items: [
          "Wi-fi routerlar",
          "Wi-Fi signal kuchaytirgich",
          "Wi-Fi adapterlar",
          "Tarmoq uskunalari",
          "Kummutator",
        ],
      },
    ],
  },
  {
    name: "Maishiy texnika",
    sub: [
      {
        title: "Oshxona texnikasi",
        items: [
          "Blenderlar",
          "Sharbat chiqargichlar",
          "Elektr choynaklar",
          "Mikroto‘lqinli pechlar",
          "Multivarkalar",
          "Kofe mashinalari",
          "Toaster va sandwich-maker",
          "Go‘sht qiymalagichlar",
          "Oshxona kombaynlari",
          "Rafli pechlar (duxovka)",
          "Induksion va gaz plitalari",
        ],
      },
      {
        title: "Sovutish va isitish",
        items: [
          "Konditsionerlar",
          "Ventilyatorlar",
          "Isitgichlar (obogrevatel)",
          "Havoni tozalovchi qurilmalar",
          "Namlagichlar va quritgichlar",
          "Termostatlar",
          "Elektr kaminlar",
        ],
      },
      {
        title: "Kir yuvish va tozalash",
        items: [
          "Kir yuvish mashinalari",
          "Kir quritgich mashinalari",
          "Changyutkichlar",
          "Quruq tozalovchi (robot) changyutkichlar",
          "Bug‘li tozalovchilar",
          "Poyabzal quritgichlar",
          "Gilam yuvish qurilmalari",
        ],
      },
      {
        title: "Sovutgichlar va muzlatgichlar",
        items: [
          "Muzlatgichlar zamonaviy (karkasli va zamonaviy)",
          "Mini muzlatgichlar",
          "Sharbat sovutgichlar",
          "Vitrina sovutkichlar",
          "No-frost sovutkichlar",
          "Muzlatgichli shkaflar",
          "Muzlatgichlar va extiyot qismlari",
        ],
      },
      {
        title: "Dazmol va kir parvarishi",
        items: [
          "Bug‘li dazmollar",
          "Oddiy dazmollar",
          "Vertikal dazmollar",
          "Kir quritish moslamalari",
          "Kir savatlari",
          "Kir yuvish doskalari",
        ],
      },
      {
        title: "Maishiy mayda texnika",
        items: [
          "Soch fenlari",
          "Soch to‘g‘rilagichlar",
          "Soch jingalak qilgichlar",
          "Taroq-fenlar",
          "Quloq tozalovchi moslamalar",
          "Soch olish mashinalari",
          "Elektrodepilyatorlar",
        ],
      },
      {
        title: "Hovli va tom uchun texnika",
        items: [
          "Elektr generatorlar",
          "Suv nasoslari",
          "Chiroqlar va LED fonuslar",
          "Bog‘ sug‘orish texnikalari",
          "Elektr zanjirli arra (pilalar)",
          "Changyutkichli moplar",
        ],
      },
    ],
  },
  {
    name: "Kiyim",
    sub: [
      {
        title: "Erkakalar kiyimi",
        items: [
          " Futbolkalar va polo ",
          " Paypoqlar va getrlar ",
          " Shimlar ",
          " Xudi va svitshotlar ",
          " Jemperlar, sviterlar va kardiganlar ",
          " Ko'ylaklar ",
          " Jinsilar ",
          " Sport kiyimlari ",
          " Ustki kiyim ",
          " Kiyim to'plamlari ",
          " Ichki kiyimlar ",
          " Shortilar ",
          " Maxsus kiyimlar ",
          " Choʻmilish plavkalari va shortilari ",
          " Maykalar ",
          " Uy kiyimi ",
          " Katta o'lchamli kiyimlar ",
          " Termal ichki kiyimlar ",
          " Pidjaklar va kostyumlar ",
          " Erkaklar uchun diniy kiyim ",
          " Karnaval uchun kiyimlar ",
        ],
      },
      {
        title: "O'g'il bolalar uchun kiyimlar",
        items: [
          "Kiyim to'plamlari ",
          "Futbolkalar va maykalar ",
          "Kostyumlar va pidjaklar  ",
          "Sport kiyimlari ",
          "  Shimlar va jinsilar ",
          "  Tolstovka va olimpiykalar ",
          "  Paypoqlar ",
          "  Shortilar ",
          "  Ko'ylaklar ",
          "  Ichki kiyim va termal ichki kiyim ",
          "  Uy kiyimi ",
          "  Jemperlar, sviterlar va kardiganlar ",
          "  Ustki kiyim ",
          "  Choʻmilish plavkalari va shortilari ",
          "  Oʻgʻil bolalar uchun maktab formasi ",
          "  Kombinezonlar va yarim kombinezonlar ",
          "  Karnaval uchun kiyimlar ",
          "  Oʻgʻil bolalar uchun diniy kiyim ",
        ],
      },
      {
        title: "Ayollar kiyimi",
        items: [
          " Liboslar va sarafanlar ",
          " Futbolkalar va polo ",
          " Paypoqlar, kolgotkilar va chulkilar ",
          " Shimlar ",
          " Kiyim to'plamlari ",
          " Jemperlar, sviterlar va kardiganlar ",
          " Bluzkalar va ko'ylaklar ",
          " Uy kiyimi ",
          " Jinsilar ",
          " Ichki kiyim ",
          " Sport kiyimlari ",
          " Diniy kiyim ",
          " Yubkalar ",
          " Top va maykalar ",
          " Xudi va svitshotlar ",
          " Tunikalar ",
          " Ustki kiyim ",
          " Pidjaklar va kostyumlar ",
          " Shortilar ",
          " Homiladorlar uchun kiyimlar ",
          " Kombinezonlar ",
          "Bodi",
          " To`qilgan kostyumlar ",
          " Milliy kiyimlar ",
        ],
      },
      {
        title: "Qiz bolalar kiyimlari",
        items: [
          "  Koʻylaklar va sarafanlar  ",
          " Kiyim to'plamlari ",
          " Futbolkalar va polo ",
          " Paypoq va kolgotkilar ",
          " Top va maykalar ",
          " Shimlar va jinsilar ",
          " Kostyumlar va pidjaklar ",
          " Sport kiyimlari ",
          " Yubkalar va shortilar ",
          " Ichki kiyim va termal ichki kiyim ",
          " Jemperlar, sviterlar va kardiganlar ",
          " Tolstovka va olimpiykalar ",
          " Uy kiyimi ",
          " Qizlar uchun maktab formasi ",
          " Bluzkalar va ko'ylaklar ",
          " Ustki kiyim ",
        ],
      },
      {
        title: "Yangi tugʻilgan chaqaloqlar uchun kiyimlar ",
        items: [
          "  Bodi va kombinezonlar  ",
          " Kostyumlar va toʻplamlar ",
          "  Paypoqlar, pinetkalar  ",
          "  Shimlar va ishtonlar  ",
          " Yangi tugʻilgan chaqaloqlar uchun qalpoqchalar, chepchiklar va qoʻlqopchalar ",
          " Futbolkalar, ko'ylaklar va raspashonkalar  ",
          "  Jemperlar va tolstovkalar  ",
          "  Koʻylaklar va yubkalar ",
          " Ustki kiyim ",
          " Yangi tugʻilgan chaqaloqlar uchun diniy kiyimlar ",
        ],
      },
    ],
  },
  {
    name: "Sport va hordiq",
    sub: [
      {
        title: "Sport anjomlari",
        items: [
          "Trenajorlar",
          "Yugurish yo'lakchalari",
          "Velotrenajorlar",
          "Massaj apparatlari",
          "Qomat tuzatuvchilar",
          "Dumbbell va gantellar",
          "Kauchuk ekspanderlar",
          "Gym mat (yog‘och yoki kauchuk gilamcha)",
        ],
      },
      {
        title: "Sayr va dam olish",
        items: [
          "Tashqi o‘rindiqlar",
          "Plaj karavotlari",
          "Gilamlar va palatkalar",
          "Termos va termokrujkalar",
          "Choyshab va gilamchalari",
          "Piknik to‘plamlari",
          "Power bank (sayohat uchun)",
        ],
      },
      {
        title: "Velosiped va skuterlar",
        items: [
          "Bolalar velosipedlari",
          "Kattalar uchun velosipedlar",
          "Elektr skuterlar",
          "Bolalar uchun skuterlar",
          "Velosiped aksessuarlari",
          "Dublyonka va shlem",
          "Skuter sumkalar",
        ],
      },
      {
        title: "Sport kiyimlari",
        items: [
          "Sport kiyim to‘plamlari",
          "Yugurish uchun kiyimlar",
          "Sport krossovkalari",
          "Futbol formasi",
          "Sport bras (ayollar uchun)",
          "Termal kiyimlar",
          "Sport shortilar",
        ],
      },
      {
        title: "Hovuz va suzish anjomlari",
        items: [
          "Suzish ko'zoynaklari",
          "Suzish do‘konchalari (krujka, koltuk)",
          "Bolalar uchun hovuz",
          "Nafas olish trubkalari",
          "Suzish qalpoqlari",
          "Shnorkel to‘plami",
        ],
      },
      {
        title: "O'yin va hordiq",
        items: [
          "Stol tennis to‘plami",
          "Dart to‘plamlari",
          "Shaffof to‘p va basketbol to‘plari",
          "Ochiq havoda o‘ynaladigan to‘plar",
          "Bilyard aksessuarlari",
          "Mini futbol darvozalari",
        ],
      },
    ],
  },
  {
    name: "Salomatlik",
    sub: [
      {
        title: "Tibbiy asboblar",
        items: [
          "Termometrlar",
          "Tonometrlar",
          "Glyukometrlar",
          "Nebulyatorlar",
          "Inhalatorlar",
          "Massaj uskunalari",
          "Meditsina qoʻlqoplari",
        ],
      },
      {
        title: "Gigiyena va parvarish",
        items: [
          "Tish pastasi va cho‘tkasi",
          "Yuz va tana tozalovchilari",
          "Antibakterial vositalar",
          "Gigiyenik salfetkalar",
          "Quloq tozalagichlar",
        ],
      },
      {
        title: "Vitaminlar va parhez",
        items: [
          "Vitamin komplekslari",
          "Oshqozon uchun biologik qo‘shimchalar",
          "Sport uchun proteinlar",
          "Immunitet kuchaytiruvchilar",
          "Uyquni yaxshilovchi vositalar",
        ],
      },
      {
        title: "Shaxsiy tibbiy himoya",
        items: [
          "Yuz niqoblari",
          "Antiseptiklar",
          "Steril bintlar",
          "Tibbiy ko‘zoynaklar",
          "Tibbiy aprondlar",
        ],
      },
    ],
  },
  {
    name: "Xobbi va ijod",
    sub: [
      {
        title: "Rassomlik uchun",
        items: [
          "Bo‘yoqlar (akril, guash)",
          "Mo‘yqalamlar",
          "Rasm daftar va kanvaslar",
          "Molbertlar",
          "Grafit qalamlar",
          "Marker va linerlar",
        ],
      },
      {
        title: "Qo‘l mehnati (handmade)",
        items: [
          "Tikuvchilik asboblari",
          "Boncuklar va toshlar",
          "Iplik va gazlama",
          "Yelim va dekor materiallari",
          "Scrapbooking materiallari",
        ],
      },
      {
        title: "Musiqa asboblari",
        items: [
          "Gitara va aksessuarlari",
          "Kalitli asboblar (sintezator)",
          "Perkussiya (baraban)",
          "Dutor, rubob va milliy cholg‘ular",
          "Quloqchin va audio tizimlar",
        ],
      },
      {
        title: "Konstruksiyalar va model yasash",
        items: [
          "Lego va konstruktiv o‘yinchoqlar",
          "Plastik modellash vositalari",
          "Yelim va bo‘yoq",
          "Uchadigan modelllar (dron, samolyot)",
          "3D printerlar va filamentlar",
        ],
      },
    ],
  },
  {
    name: "Avtotovarlar",
    sub: [
      {
        title: "Avto ehtiyot qismlar",
        items: [
          "Akkumulyatorlar",
          "Tormoz disklari va kolodkalar",
          "Filtrlar (havo, moy, yoqilg‘i)",
          "Yorug‘lik lampalari",
          "Motor yog‘lari va moylar",
        ],
      },
      {
        title: "Avto aksessuarlar",
        items: [
          "Avtomobil gilamchalari",
          "Telefon ushlagichlari",
          "Suvyutgich (avtomobil sovutgichi)",
          "Mashina chiroqlari",
          "Mashina chiroq bezaklari",
          "USB zaryadlovchilar",
        ],
      },
      {
        title: "Avto tozalash va parvarish",
        items: [
          "Shampunlar va vositalar",
          "Salon spreyi",
          "Avto changyutgich",
          "Tashqi yuvish uskunalari",
          "Mikrofiber sochiqlar",
        ],
      },
      {
        title: "Avto xavfsizlik",
        items: [
          "Video registratorlar",
          "Signalizatsiya tizimlari",
          "GPS trekerlar",
          "Tirkamalar uchun to‘plamlar",
          "Mashina qulf va blokirovkalar",
        ],
      },
    ],
  },
  {
    name: "Maishiy va kimyoviy moddalar",
    sub: [
      {
        title: "Tozalash vositalari",
        items: [
          "Idish yuvish vositalari",
          "Pol yuvish vositalari",
          "Hojatxona tozalovchilari",
          "Ko‘p maqsadli spreyi",
          "Dezinfeksiya vositalari",
        ],
      },
      {
        title: "Kir yuvish vositalari",
        items: [
          "Kir yuvish kukuni",
          "Gellari va kapsulalari",
          "Dog‘ ketkazuvchilar",
          "Kir yuvish parfyumlari",
          "Oqartiruvchi vositalar",
        ],
      },
      {
        title: "Idish-tovoq yuvish",
        items: [
          "Idish yuvish mashinasi uchun tabletkalar",
          "Qo‘l bilan idish yuvish gellari",
          "Gubkalar va lattalar",
          "Yumshatuvchilar",
          "Choyshab yuvish vositalari",
        ],
      },
      {
        title: "Shaxsiy parvarish",
        items: [
          "Sovunlar (qattiq va suyuq)",
          "Shampun va konditsionerlar",
          "Dush geli va skrablar",
          "Dezodorantlar",
          "Krem va losonlar",
        ],
      },
    ],
  },
  {
    name: "Qurilish va ta’mirlash",
    sub: [
      {
        title: "Qurilish materiallari",
        items: [
          "Sement, gips, ohak",
          "G‘isht, blok",
          "Yopishqoq materiallar",
          "Suvga chidamli qoplamalar",
          "Shpaklyovka va bo‘yoqlar",
        ],
      },
      {
        title: "Ta’mirlash asboblari",
        items: [
          "Perforatorlar",
          "Burghular",
          "Elektr matkaplar",
          "Qirqish asboblari",
          "Vintli otvertkalar to‘plami",
        ],
      },
      {
        title: "Yoritish va elektr",
        items: [
          "Lampalar (LED, energotejamkor)",
          "Elektr simlar",
          "Rozetkalar va vilkalar",
          "Yorug‘lik sensorlari",
          "Elektr shchitlar",
        ],
      },
      {
        title: "Pol va devor qoplamalari",
        items: [
          "Laminat",
          "Linoleum",
          "Oboylar",
          "Kafel va plitkalar",
          "Dekorativ panellar",
        ],
      },
    ],
  },
  {
    name: "Poyabzallar",
    sub: [
      {
        title: "Erkaklar uchun poyabzallar",
        items: [
          "Kundalik tuflilar",
          "Sport krossovkalar",
          "Qishki etiklar",
          "Ofis tuflilari",
          "Charm etiklar",
          "Uy shippaklari",
        ],
      },
      {
        title: "Ayollar uchun poyabzallar",
        items: [
          "Baland poshnali tuflilar",
          "Sandallar",
          "Yozgi shippaklar",
          "Sport oyoq kiyimlari",
          "Qishki etiklar",
          "Uy poyabzallari",
        ],
      },
      {
        title: "Bolalar uchun poyabzallar",
        items: [
          "Kichkintoylar uchun poyabzallar",
          "Bolalar krossovkalari",
          "Maktab uchun poyabzallar",
          "Qishki bolalar etiklari",
          "Sandallar",
          "Shippaklar",
        ],
      },
    ],
  },
  {
    name: "Aksessuarlar",
    sub: [
      {
        title: "Moda aksessuarlari",
        items: [
          "Soatlar (aqlli va oddiy)",
          "Bilaguzuklar",
          "Zargarlik buyumlari",
          "Ko‘zoynaklar",
          "Shlyapalar va kepkalar",
        ],
      },
      {
        title: "Telefon aksessuarlari",
        items: [
          "Telefon g‘iloflari",
          "Zaryadlovchi qurilmalar",
          "Quvvat banklar (Powerbank)",
          "Kabellar",
          "Eshitkichlar",
        ],
      },
      {
        title: "Sumkalar va ryukzaklar",
        items: [
          "Qo‘l sumkalari",
          "Yelka sumkalari",
          "Sport ryukzaklar",
          "Bolalar sumkalari",
          "Kosmetik sumkalar",
        ],
      },
    ],
  },
  {
    name: "Bolalar tovarlari",
    sub: [
      {
        title: "Chaqaloqlar uchun",
        items: [
          "Podguzniklar",
          "Butilkalar",
          "Gigiyena vositalari",
          "Kiyimlar (bodi, kombinezon)",
          "Aravachalar",
        ],
      },
      {
        title: "O‘yinchoqlar",
        items: [
          "Ta'limiy o‘yinchoqlar",
          "Elektron o‘yinchoqlar",
          "Yumshoq o‘yinchoqlar",
          "Konstrukturlar",
          "Mashinalar va robotlar",
        ],
      },
      {
        title: "Bolalar jihozlari",
        items: [
          "Bolalar kreslolar",
          "O‘rindiqlar (avtokreslolar)",
          "Bolalar mebellari",
          "Ko‘rpa-to‘shak",
          "Yotoqxona to‘plamlari",
        ],
      },
    ],
  },
  {
    name: "Oziq-ovqat mahsulotlari",
    sub: [
      {
        title: "Asosiy mahsulotlar",
        items: [
          "Un, guruch, makaron",
          "Tuz, shakar, yog‘",
          "Sut, yogurt, pishloq",
          "Go‘sht va parranda go‘shti",
          "Tuxum",
        ],
      },
      {
        title: "Ichimliklar va shirinliklar",
        items: [
          "Choy va qahva",
          "Sharbatlar va suvlar",
          "Shokolad va konfetlar",
          "Pechenyelar",
          "Non mahsulotlari",
        ],
      },
      {
        title: "Bolalar ovqati va organik mahsulotlar",
        items: [
          "Bolalar ovqatlari",
          "Organik mahsulotlar",
          "Tez tayyor ovqatlar",
          "Soslar va ziravorlar",
          "Muzlatilgan mahsulotlar",
        ],
      },
    ],
  },
  {
    name: "Kanselyariya tovarlari",
    sub: [
      {
        title: "Yozuv va chizuv anjomlari",
        items: [
          "Ruchkalar, qalamlar",
          "Marker va flomasterlar",
          "O‘chirgich, qalam o‘tkirlagichlar",
          "Bo‘yoqlar, rangli qalamlar",
          "Transportir, lineyka, sirkul",
        ],
      },
      {
        title: "Qog‘oz va daftarlar",
        items: [
          "Daftarlar",
          "Ofis qog‘ozlari",
          "Yozuv bloknotlari",
          "Qog‘ozlar to‘plami",
          "Rangli qog‘ozlar",
        ],
      },
      {
        title: "Ofis jihozlari",
        items: [
          "Papkalar va fayllar",
          "Yelim, qaychi, shtamplar",
          "Skotch, skrepkalar",
          "Organayzerlar",
          "Stol anjomlari to‘plami",
        ],
      },
    ],
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("UZ");
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(categoriesData[0]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // const { isAuthenticated, loading: authLoading } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.phoneNumber) {
      setIsAuthenticated(true);
    }
  }, []);

  // Cart va likes hooks
  const { cart } = useCartStore();
  const { likes } = useHomeLikes();

  const toggleGroup = (title) => {
    setExpandedGroup((prevTitle) => (prevTitle === title ? null : title));
  };

  useEffect(() => {
    if (!selectedCat || !isOpen) return;

    const fetchSubCats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories?catalogId=${selectedCat.id}`
        );
        setSubCats(res.data.data || []);
        if (res.data.data?.length) setSelectedSubCat(res.data.data[0]);
      } catch (err) {
        console.error("Subcat Error:", err);
      }
    };
    fetchSubCats();
  }, [selectedCat, isOpen]);

  // Fetch products
  useEffect(() => {
    if (!selectedSubCat || !isOpen) return;

    const fetchProds = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/getSubCategoryProducts/all?subCategoryId=${selectedSubCat.id}`
        );
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product Error:", err);
      }
    };
    fetchProds();
  }, [selectedSubCat, isOpen]);

  // Get localized name

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  useEffect(() => {
    setExpandedGroups({});
  }, [selectedCategory]);

  // Toggle dropdown with animation
  const toggleDropdown = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  };

  const inputRef = useRef(null);

  const handleIconClick = () => {
    inputRef.current?.focus();
  };
  const notifications = useNotificationsStore((state) => state.notifications);

  // O‘qilmaganlar soni
  const unreadCount = notifications.filter((n) => !n.read).length;
  // Handle category hover
  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) =>
      prev?.name === category.name ? null : category
    );
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".catalog-dropdown") &&
        !event.target.closest(".catalog-btn")
      ) {
        toggleDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 w-full mx-auto rounded-lg shadow-lg z-50 py-2 bg-white/95 backdrop-blur-sm max-[1260px]:px-4">
        <div className="flex mx-auto justify-between max-w-[1240px] gap-10">
          <a
            href="https://www.google.com/maps/place/Yunusabad"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <MapPin className="text-[#1862D9]" /> Toshkent
          </a>

          <div className="flex gap-10">
            <a
              href="mailto:azikmelor7705@gmail.com"
              className="flex items-center gap-3 cursor-pointer max-[500px]:hidden text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Mail className="text-[#1862D9]" />
              <span>Aloqa uchun</span>
            </a>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UZ">UZ</option>
              <option value="RU">RU</option>
              <option value="ENG">ENG</option>
            </select>
          </div>
        </div>

        <div className="max-w-[1240px] w-full flex items-start justify-between pt-4 mx-auto">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer text-2xl leading-6 font-bold flex flex-col hover:opacity-80 transition-opacity"
          >
            <span className="text-gray-800">BOJXONA</span>
            <span className="text-[#249B73] text-xs text-center tracking-[16px]">
              SERVIS
            </span>
          </button>
          <div className="hidden max-[670px]:block">
            <button className="bg-gradient-to-r text-[12px] from-[#0D63F5] to-[#0D63F5] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 font-semibold">
              <Download size={18} />
              YUKLAB OLISH
            </button>
          </div>
          {/* Catalog Button - Hidden on small screens */}
          <div className="relative max-[670px]:hidden">
            <button
              onClick={toggleDropdown}
              className={`catalog-btn bg-gradient-to-r from-[#0D63F5] to-[#0D63F5] w-[150px] text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:scale-105 ${
                isOpen ? "bg-gradient-to-r from-[#0D63F5] to-[#0D63F5]" : ""
              }`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="font-semibold">KATALOG</span>
            </button>
          </div>

          {/* Search - Shows only on larger screens */}
          <div className="relative w-1/3 max-[670px]:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
              <label htmlFor="search" className="sr-only">
                Mahsulotlarni izlash
              </label>

              <input
                id="search"
                ref={inputRef}
                type="text"
                placeholder="Mahsulotlarni izlash"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none transition-all bg-gray-50 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <button
                type="button"
                onClick={handleIconClick}
                className="absolute inset-y-0 right-0 bg-[#0D63F5] cursor-pointer text-white px-4 rounded-r-lg transition-all hover:bg-[#0052d9]"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="relative flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors relative">
                <Bell size={20} className="text-[#1862D9]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Aloqa</span>
            </button>

            <NotificationModal open={open} setOpen={setOpen} />

            <button
              onClick={() => router.push("/wishes")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <Heart size={20} className="text-[#1862D9]" />
                {likes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {likes.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Tanlanganlar</span>
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="flex flex-col items-center cursor-pointer relative group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md relative group-hover:bg-[#dbeafe] transition-colors">
                <ShoppingCart size={20} className="text-[#1862D9]" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-600 pt-1">Savat</span>
            </button>

            {isAuthenticated ? (
              <Link href="/profile">
                <button
                  className="flex flex-col items-center cursor-pointer group"
                  title="Profilga o'tish"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#ECF4FF] rounded-md group-hover:bg-[#dbeafe] transition-colors">
                    <User className="w-6 h-6 text-[#1862D9]" />
                  </div>
                  <span className="text-xs text-gray-600 pt-1">Profil</span>
                </button>
              </Link>
            ) : (
              <Link className="self-start" href="/register">
                <button className="px-8 py-3 text-black rounded-md cursor-pointer bg-gradient-to-r from-[#EED3DC] to-[#CDD6FD] hover:from-[#e6c7d3] hover:to-[#c4cefb] transition-all duration-200 transform hover:scale-105">
                  KIRISH
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search - Shows only on small screens */}
        <div className="relative w-full mt-4 hidden max-[670px]:block max-w-[1240px] mx-auto">
          <form onSubmit={handleSearch} className="relative w-full">
            <label htmlFor="mobile-search" className="sr-only">
              Mahsulotlarni izlash
            </label>

            <input
              id="mobile-search"
              type="text"
              placeholder="Mahsulotlarni izlash"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 w-full outline-none transition-all bg-gray-50 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              type="button"
              onClick={handleIconClick}
              className="absolute inset-y-0 right-0 bg-[#0D63F5] cursor-pointer text-white px-4 rounded-r-lg transition-all hover:bg-[#0052d9]"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {!isOpen && <CategoryList onMoreClick={toggleDropdown} />}
      </header>

      <div
        className={`catalog-dropdown fixed top-[120px] left-0 right-0 z-40 transition-all duration-300 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-4"
        } ${isAnimating ? "pointer-events-none" : ""}`}
      >
        <div className="bg-white max-w-full h-auto">
          <div className="max-w-[1250px] mx-auto   border border-gray-100 overflow-hidden">
            <div className="flex h-[85vh]">
              {/* Left Categories Menu */}
              <div className="w-[280px] bg-gradient-to-b from-gray-50 to-white border-r border-gray-100">
                <div className="py-4 px-2 space-y-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {categoriesData.map((category, index) => (
                    <div
                      key={index}
                      onClick={() => handleCategoryClick(category)}
                      className={`py-3 px-4 rounded-lg cursor-pointer transition-all duration-200 text-sm font-medium relative group ${
                        selectedCategory?.name === category.name
                          ? "bg-gradient-to-r from-blue-50 to-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getCategoryIcon(category.name)}
                          <span className="truncate">{category.name}</span>
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            selectedCategory?.name === category.name
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Subcategories Menu */}
              <div className="flex-1 overflow-y-auto max-h-full p-6 bg-white">
                <h2 className="text-2xl font-bold text-[#1e7d5d] mb-6">
                  {selectedCategory?.name || "Kategoriya nomi yo'q"}
                </h2>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 text-sm">
                  {selectedCategory?.sub?.map((group, idx) => {
                    const isExpanded = expandedGroup === group.title;
                    const hasItems = group.items && group.items.length > 0;
                    const visibleItems = isExpanded
                      ? group.items
                      : group.items?.slice(0, 6) || [];
                    const hiddenCount = hasItems ? group.items.length - 6 : 0;

                    return (
                      <div
                        key={idx}
                        className="break-inside-avoid mb-6 bg-white p-2 rounded-md"
                      >
                        {/* Title */}
                        <h3
                          className={`font-bold mb-3 text-base ${
                            hasItems
                              ? "text-gray-800 border-b border-gray-200 pb-2"
                              : "text-blue-700 text-xl"
                          }`}
                        >
                          {group.title}
                        </h3>

                        {/* Items */}
                        {hasItems && (
                          <div className="space-y-2">
                            {visibleItems.map((item, i) => (
                              <a
                                key={i}
                                href="#"
                                className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-all duration-200 leading-relaxed text-sm hover:translate-x-1"
                              >
                                {item.trim()}
                              </a>
                            ))}

                            {hiddenCount > 0 && (
                              <button
                                onClick={() => toggleGroup(group.title)}
                                className="flex items-center gap-1 text-blue-500 cursor-pointer text-sm mt-2 hover:text-blue-700 transition-colors px-2 py-1 hover:bg-blue-50 rounded"
                              >
                                <span>
                                  {isExpanded
                                    ? "Yopish"
                                    : `Yana ${hiddenCount} ta`}
                                </span>
                                <svg
                                  className={`w-4 h-4 transition-transform duration-200 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center md:hidden">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center text-gray-600"
        >
          <HomeIcon size={20} className="text-[#1862D9]" />
          <span className="text-xs">Bosh sahifa</span>
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center text-gray-600"
        >
          <Bell size={20} className="text-[#1862D9]" />
          <span className="text-xs">Aloqa</span>
        </button>

        <button
          onClick={() => router.push("/wishes")}
          className="flex flex-col items-center text-gray-600"
        >
          <Heart size={20} className="text-[#1862D9]" />
          <span className="text-xs">Tanlangan</span>
        </button>

        <button
          onClick={() => router.push("/cart")}
          className="flex flex-col items-center text-gray-600"
        >
          <ShoppingCart size={20} className="text-[#1862D9]" />
          <span className="text-xs">Savat</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={() => router.push("/profile")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#1862D9]" />
            <span className="text-xs">Profil</span>
          </button>
        ) : (
          <button
            onClick={() => router.push("/register")}
            className="flex flex-col items-center text-gray-600"
          >
            <User size={20} className="text-[#1862D9]" />
            <span className="text-xs">Kirish</span>
          </button>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
    </>
  );
}
