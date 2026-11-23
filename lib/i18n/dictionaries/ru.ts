import type { AccidentSeverity, AccidentStatus, FuelType, Transmission } from "@/lib/types";
import type {
  AuctionResult,
  ImportType,
  LienStatus,
  MileageCheckpointSource,
  MileageVerdict,
  OwnerType,
  RegistrationEventType,
  RestrictionStatus,
  RestrictionType,
} from "@/lib/types";
import type { KnownCity, KnownColor, KnownStreet, KnownWeather } from "../domain-values";

const severity: Record<AccidentSeverity, string> = {
  "Лёгкая": "Лёгкая",
  "Средняя": "Средняя",
  "Тяжёлая": "Тяжёлая",
};

const status: Record<AccidentStatus, string> = {
  "Урегулировано": "Урегулировано",
  "В процессе": "В процессе",
  "Отклонено": "Отклонено",
};

const transmission: Record<Transmission, string> = {
  "Механическая": "Механическая",
  "Автоматическая": "Автоматическая",
  "Вариатор": "Вариатор",
  "Робот": "Робот",
};

const fuelType: Record<FuelType, string> = {
  "Бензин": "Бензин",
  "Дизель": "Дизель",
  "Электро": "Электро",
  "Гибрид": "Гибрид",
  "Газ/Бензин": "Газ/Бензин",
};

const cities: Record<KnownCity, string> = {
  "Ташкент": "Ташкент",
  "Самарканд": "Самарканд",
  "Бухара": "Бухара",
  "Андижан": "Андижан",
  "Наманган": "Наманган",
  "Фергана": "Фергана",
  "Навои": "Навои",
  "Карши": "Карши",
  "Термез": "Термез",
  "Нукус": "Нукус",
};

const colors: Record<KnownColor, string> = {
  "Белый": "Белый",
  "Чёрный": "Чёрный",
  "Серебристый": "Серебристый",
  "Серый": "Серый",
  "Синий": "Синий",
  "Красный": "Красный",
  "Тёмно-синий": "Тёмно-синий",
  "Бежевый": "Бежевый",
  "Коричневый": "Коричневый",
  "Зелёный": "Зелёный",
};

const weather: Record<KnownWeather, string> = {
  "Ясно": "Ясно",
  "Облачно": "Облачно",
  "Дождь": "Дождь",
  "Туман": "Туман",
  "Гололёд": "Гололёд",
  "Снег": "Снег",
};

const streets: Record<KnownStreet, string> = {
  "Амира Темура": "Амира Темура",
  "Мустакиллик": "Мустакиллик",
  "Бунёдкор": "Бунёдкор",
  "Нукус": "Нукус",
  "Фаргона йули": "Фаргона йули",
  "Чиланзар": "Чиланзар",
  "Юнусабад": "Юнусабад",
  "Себзор": "Себзор",
};

// The generator (scripts/generate-db.js) only ever emits these 12 exact
// sentences. Translated at render time via exact-match lookup — see
// lib/i18n/domain-labels.ts. Falls back to the original Russian if a
// description was hand-written by an admin and isn't one of these 12.
const accidentDescriptions: Record<string, string> = {
  "Незначительное касание при парковке, поверхностные царапины.":
    "Незначительное касание при парковке, поверхностные царапины.",
  "Лёгкое ДТП на перекрёстке, повреждена только облицовка.":
    "Лёгкое ДТП на перекрёстке, повреждена только облицовка.",
  "Наезд на бордюр, деформация без нарушения геометрии кузова.":
    "Наезд на бордюр, деформация без нарушения геометрии кузова.",
  "Царапина от соседнего автомобиля на стоянке торгового центра.":
    "Царапина от соседнего автомобиля на стоянке торгового центра.",
  "Столкновение при перестроении на городской улице, деформация двери.":
    "Столкновение при перестроении на городской улице, деформация двери.",
  "ДТП на регулируемом перекрёстке, повреждён кузов и оптика.":
    "ДТП на регулируемом перекрёстке, повреждён кузов и оптика.",
  "Наезд на препятствие на обочине трассы, требуется ремонт крыла.":
    "Наезд на препятствие на обочине трассы, требуется ремонт крыла.",
  "Боковое столкновение при развороте, деформация панели кузова.":
    "Боковое столкновение при развороте, деформация панели кузова.",
  "Серьёзное столкновение на трассе, значительные повреждения кузова.":
    "Серьёзное столкновение на трассе, значительные повреждения кузова.",
  "ДТП с опрокидыванием на обледенелой дороге.": "ДТП с опрокидыванием на обледенелой дороге.",
  "Лобовое столкновение на загородной трассе, повреждена силовая структура.":
    "Лобовое столкновение на загородной трассе, повреждена силовая структура.",
  "Множественное столкновение в условиях плохой видимости.":
    "Множественное столкновение в условиях плохой видимости.",
};

const ownerType: Record<OwnerType, string> = {
  "Физическое лицо": "Физическое лицо",
  "Юридическое лицо": "Юридическое лицо",
};

const mileageSource: Record<MileageCheckpointSource, string> = {
  "Постановка на учёт": "Постановка на учёт",
  "Техосмотр": "Техосмотр",
  "Плановое ТО": "Плановое ТО",
  "Диагностика при покупке": "Диагностика при покупке",
  "Продажа автомобиля": "Продажа автомобиля",
};

const mileageVerdict: Record<MileageVerdict, string> = {
  consistent: "Показания согласованы",
  discrepancy: "Обнаружено несоответствие",
};

const lienStatus: Record<LienStatus, string> = {
  none: "Не в залоге",
  active: "В активном залоге",
  released: "Залог снят",
};

const importType: Record<ImportType, string> = {
  "Новый": "Новый",
  "С пробегом": "С пробегом",
};

const auctionResult: Record<AuctionResult, string> = {
  "Продано": "Продано",
  "Не продано": "Не продано",
};

const restrictionType: Record<RestrictionType, string> = {
  "Розыск": "Розыск",
  "Арест": "Арест",
  "Ограничение на регистрационные действия": "Ограничение на регистрационные действия",
};

const restrictionStatus: Record<RestrictionStatus, string> = {
  "Активно": "Активно",
  "Снято": "Снято",
};

const registrationEventType: Record<RegistrationEventType, string> = {
  "Постановка на учёт": "Постановка на учёт",
  "Перерегистрация": "Перерегистрация",
  "Смена региона": "Смена региона",
};

const originCountry: Record<string, string> = {
  "Узбекистан": "Узбекистан",
  "Республика Корея": "Республика Корея",
  "Япония": "Япония",
  "Германия": "Германия",
  "Китай": "Китай",
};

const ru = {
  meta: {
    title: "Charx — Проверка автомобиля по VIN и госномеру",
    description:
      "Charx — сервис проверки истории ДТП, повреждений и надёжности автомобилей в Узбекистане. Проверяйте автомобиль перед покупкой по VIN или государственному номеру.",
    reportPageTitle: "Отчёт об автомобиле — Charx",
  },
  common: {
    streetAbbr: "ул.",
    loading: "Загрузка...",
    close: "Закрыть",
  },
  nav: {
    howItWorks: "Как это работает",
    features: "Возможности",
    stats: "Статистика",
    checkVehicle: "Проверить авто",
  },
  footer: {
    tagline:
      "Независимая проверка истории автомобилей в Узбекистане. Прозрачные данные для покупателей, банков и страховых компаний.",
    productTitle: "Продукт",
    checkVehicle: "Проверить автомобиль",
    howItWorks: "Как это работает",
    features: "Возможности",
    pricing: "Тарифы",
    companyTitle: "Компания",
    about: "О сервисе",
    forBanks: "Партнёрам и банкам",
    contact: "Контакты",
    legalTitle: "Правовая информация",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    offer: "Публичная оферта",
    copyright: "Charx. Демонстрационная версия продукта.",
    adminPanel: "Панель администратора",
    openSource: "Открытый код",
  },
  theme: {
    toggle: "Переключить тему",
  },
  locale: {
    switchLabel: "Язык",
  },
  hero: {
    badge: "Данные по 10 регионам Узбекистана",
    title: "Узнайте правду об автомобиле до покупки",
    subtitle:
      "Charx проверяет VIN и государственный номер по базе ДТП и формирует подробный отчёт за считанные секунды — с картой происшествий, диаграммой повреждений и оценкой надёжности.",
    trustVerified: "Проверенные отчёты",
    trustHistory: "История ДТП",
    trustMarket: "Прозрачный рынок",
  },
  howItWorks: {
    title: "Три шага до полной картины",
    subtitle: "От запроса до готового отчёта — меньше минуты.",
    steps: [
      {
        title: "Введите VIN или госномер",
        description: "Укажите идентификатор автомобиля в строке поиска — данные проверяются мгновенно.",
      },
      {
        title: "Сверка с базой ДТП",
        description: "Система сопоставляет автомобиль с записями о происшествиях по всем регионам страны.",
      },
      {
        title: "Получите отчёт",
        description: "Подробный отчёт с историей ДТП, картой, диаграммой повреждений и оценкой надёжности.",
      },
    ],
  },
  features: {
    title: "Всё для уверенного решения",
    subtitle: "Каждый отчёт Charx собирает данные, которые сложно найти самостоятельно.",
    items: [
      {
        title: "Диаграмма повреждений",
        description: "Интерактивная схема кузова с точной локализацией повреждённых элементов.",
      },
      {
        title: "Карта происшествий",
        description: "Каждое ДТП отображается на карте с точным местом и датой происшествия.",
      },
      {
        title: "Оценка надёжности",
        description: "Итоговый балл от 0 до 100 на основе тяжести и количества зафиксированных ДТП.",
      },
      {
        title: "Полная хронология",
        description: "Временная шкала всех происшествий с описанием, фото и суммой ущерба.",
      },
      {
        title: "Для банков и страховых",
        description: "Формат отчёта подходит для оценки залога и расчёта страховой премии.",
      },
      {
        title: "Экспорт и печать",
        description: "Скачайте отчёт в PDF, распечатайте или поделитесь ссылкой в один клик.",
      },
    ],
  },
  stats: {
    title: "Платформа в цифрах",
    subtitle: "Растущая база данных, которой доверяют покупатели, банки и страховые компании.",
    vehiclesChecked: "автомобилей проверено",
    accidentsFound: "ДТП обнаружено в базе",
    verifiedReports: "подтверждённых отчётов",
    citiesCovered: "городов Узбекистана",
  },
  locked: {
    badge: "Уже доступно",
    title: "Что входит в отчёт Charx",
    subtitle: "Каждая из этих проверок включена в стандартный отчёт и использует данные реестров и партнёров.",
    includedBadge: "Включено",
    items: [
      { title: "История владельцев", description: "Полная хронология смены собственников с датами перерегистрации." },
      { title: "Проверка пробега", description: "Сверка показаний одометра по данным техосмотров и сервисов." },
      { title: "История такси", description: "Проверка использования автомобиля в качестве такси или каршеринга." },
      { title: "Статус кредита/залога", description: "Проверка нахождения автомобиля в залоге у банка или лизинговой компании." },
      { title: "История импорта", description: "Сведения о таможенном оформлении и стране происхождения автомобиля." },
      { title: "История аукционов", description: "Проверка участия автомобиля в торгах и аукционных продажах." },
      { title: "Розыск и ограничения", description: "Проверка по базам розыска, арестов и иных ограничений." },
      { title: "История регистрации", description: "Полная хронология постановки и снятия с регистрационного учёта." },
    ],
  },
  searchBar: {
    placeholder: "Введите VIN или госномер",
    ariaLabel: "VIN или государственный номер",
    button: "Проверить автомобиль",
    validation: "Введите не менее 4 символов VIN или номера.",
    examplesLabel: "Например:",
    recentLabel: "Недавние:",
  },
  searchSteps: [
    "Проверка автомобиля...",
    "Поиск в базе ДТП...",
    "Анализ истории...",
    "Формирование отчёта...",
  ],
  searchEmpty: {
    title: "Автомобиль не найден",
    description:
      "По указанному VIN или государственному номеру записей в базе Charx не обнаружено. Проверьте правильность ввода и попробуйте снова.",
    backHome: "Вернуться на главную",
    tryAnother: "Попробовать другой запрос",
  },
  vehicleCard: {
    vin: "VIN",
    registrationDate: "Дата регистрации",
    registrationCity: "Город регистрации",
    ownerCount: "Количество владельцев",
    color: "Цвет",
    engine: "Двигатель",
    transmission: "Коробка передач",
    fuelType: "Тип топлива",
    yearSuffix: "год",
    mileageAtCheck: "Пробег на момент проверки:",
  },
  scoreSeal: {
    outOf100: "из 100",
    titleExcellent: "Отличная история",
    titleMinor: "Обнаружены незначительные повреждения",
    titleAttention: "Требуется тщательная проверка",
    summaryExcellentNoAccidents: "Записей о ДТП не обнаружено. Автомобиль не имеет зафиксированных повреждений.",
    summaryExcellent: "Зафиксировано {count} незначительных событий, существенного влияния на состояние автомобиля не выявлено.",
    summaryMinor: "Обнаружено ДТП со степенью тяжести «{severity}». Рекомендуется ознакомиться с деталями отчёта.",
    summaryAttention: "Зафиксировано серьёзное происшествие («{severity}»). Перед покупкой рекомендуется очный осмотр.",
  },
  reportHeader: {
    verified: "Отчёт подтверждён",
    reportNumber: "№",
    generatedAt: "Сформирован",
    share: "Поделиться",
    print: "Печать",
    downloadPdf: "Скачать PDF",
    shareTitle: "Отчёт Charx",
    linkCopied: "Ссылка на отчёт скопирована",
    linkCopyFailed: "Не удалось скопировать ссылку",
    pdfComingTitle: "Экспорт в PDF появится в следующем обновлении",
    pdfComingDescription: "Функция находится в разработке.",
  },
  reportInteractive: {
    diagramTitle: "Диаграмма повреждений",
    diagramAllDescription: "Все зафиксированные повреждения (вид сверху)",
    diagramSelectedDescription: "Повреждения по выбранному ДТП",
    mapTitle: "Карта происшествий",
    mapDescription: "Нажмите на метку, чтобы выделить ДТП в списке",
    timelineTitle: "Хронология ДТП",
  },
  carDiagram: {
    ariaLabel: "Схема повреждений автомобиля (вид сверху)",
    noDamage: "Повреждённые элементы не зафиксированы",
  },
  timeline: {
    noAccidentsTitle: "Записей о ДТП не найдено",
    noAccidentsDescription: "По данным базы Charx, этот автомобиль не участвовал в зарегистрированных происшествиях.",
    accidentNumberPrefix: "№",
    repair: "Ремонт",
    weather: "Погода",
    insuranceCompany: "Страховая компания",
    damagedParts: "Повреждённые элементы",
    photos: "Фотофиксация",
    photoCaptionSuffix: "— зафиксированные повреждения",
  },
  mapCard: {
    empty: "Нет данных для отображения на карте",
  },
  mileageChart: {
    title: "Динамика пробега",
    subtitle: "По данным техосмотров, сервисных проверок и продаж",
    actualLabel: "Пробег автомобиля",
    averageLabel: "Средний показатель по рынку",
    yearAxisLabel: "Год",
    kmAxisLabel: "км",
    disclaimer:
      "График построен по зафиксированным показаниям одометра (техосмотры, сервисные визиты, продажи) в сравнении со средним показателем по рынку.",
    tooltipCurrent: "Пробег",
    tooltipAverage: "Среднее",
    tooltipSource: "Источник",
  },
  notFoundPage: {
    title: "Страница не найдена",
    description: "Похоже, эта страница уехала на СТО. Проверьте адрес или вернитесь на главную.",
    backHome: "На главную",
  },
  errorPage: {
    title: "Что-то пошло не так",
    description: "Произошла непредвиденная ошибка при загрузке страницы. Попробуйте обновить страницу ещё раз.",
    retry: "Попробовать снова",
    backHome: "На главную",
  },
  admin: {
    login: {
      title: "Панель администратора",
      subtitle: "Введите пароль для доступа к управлению данными",
      passwordLabel: "Пароль",
      submit: "Войти",
      submitting: "Проверка...",
      demoNote: "Демо-доступ: пароль указан в файле .env.local.example",
      welcomeToast: "Добро пожаловать в панель администратора",
      loginFailedFallback: "Не удалось войти",
      connectionError: "Ошибка соединения. Попробуйте снова.",
    },
    sidebar: {
      overview: "Обзор",
      vehicles: "Автомобили",
      accidents: "ДТП",
      openSite: "Открыть сайт",
      logout: "Выйти",
      logoutToast: "Вы вышли из панели администратора",
    },
    readonlyBanner:
      "Файловая система этого хостинга доступна только для чтения. Изменения сохранятся до перезапуска сервера, но не переживут повторный деплой.",
    overview: {
      title: "Обзор",
      subtitle: "Общая статистика платформы Charx",
      cardVehicles: "Автомобилей в базе",
      cardAccidents: "ДТП зафиксировано",
      cardReports: "Подтверждённых отчётов",
      cardCities: "Городов охвачено",
      totalVehicles: "Всего записей об автомобилях:",
      totalAccidents: "Всего записей о ДТП:",
    },
    charts: {
      severityTitle: "ДТП по степени тяжести",
      severityDescription: "Распределение зафиксированных происшествий",
      cityTitle: "Автомобили по городам",
      cityDescription: "Количество зарегистрированных автомобилей",
    },
    vehicles: {
      title: "Автомобили",
      countSuffix: "записей в реестре",
      addButton: "Добавить автомобиль",
      searchPlaceholder: "Поиск по VIN, номеру, марке...",
      colPlate: "Госномер",
      colVin: "VIN",
      colVehicle: "Автомобиль",
      colYear: "Год",
      colColor: "Цвет",
      colAccidents: "ДТП",
      colActions: "Действия",
      noResults: "Ничего не найдено",
      editAria: "Редактировать",
      deleteAria: "Удалить",
      confirmDelete: "Удалить автомобиль {plate}? Связанные записи о ДТП также будут удалены.",
      deleteFailed: "Не удалось удалить автомобиль",
      deleteSuccess: "Автомобиль удалён",
      loadFailed: "Не удалось загрузить автомобиль",
    },
    vehicleForm: {
      titleEdit: "Редактировать автомобиль",
      titleAdd: "Добавить автомобиль",
      description: "Данные будут сохранены в реестре Charx",
      fieldVin: "VIN",
      fieldPlate: "Госномер",
      fieldBrand: "Марка",
      fieldModel: "Модель",
      fieldTrim: "Комплектация",
      fieldYear: "Год выпуска",
      fieldColor: "Цвет",
      fieldEngine: "Двигатель",
      fieldTransmission: "Коробка передач",
      fieldFuelType: "Тип топлива",
      fieldMileage: "Пробег (км)",
      fieldOwnerCount: "Кол-во владельцев",
      fieldRegistrationDate: "Дата регистрации",
      fieldRegistrationCity: "Город регистрации",
      cancel: "Отмена",
      save: "Сохранить",
      saving: "Сохранение...",
      savedEdit: "Автомобиль обновлён",
      savedAdd: "Автомобиль добавлен",
      saveFailedFallback: "Не удалось сохранить автомобиль",
      connectionError: "Ошибка соединения",
    },
    accidents: {
      title: "ДТП",
      countSuffix: "записей о происшествиях",
      addButton: "Добавить ДТП",
      searchPlaceholder: "Поиск по городу, номеру, марке...",
      colDate: "Дата",
      colVehicle: "Автомобиль",
      colCity: "Город",
      colSeverity: "Тяжесть",
      colRepair: "Сумма ремонта",
      colStatus: "Статус",
      colActions: "Действия",
      noResults: "Ничего не найдено",
      confirmDelete: "Удалить запись о ДТП?",
      deleteFailed: "Не удалось удалить запись",
      deleteSuccess: "Запись удалена",
    },
    accidentForm: {
      titleEdit: "Редактировать ДТП",
      titleAdd: "Добавить ДТП",
      description: "Свяжите происшествие с автомобилем из реестра",
      fieldVehicle: "Автомобиль",
      fieldDate: "Дата",
      fieldTime: "Время",
      fieldCity: "Город",
      fieldAddress: "Адрес",
      fieldLatitude: "Широта (lat)",
      fieldLongitude: "Долгота (lng)",
      fieldSeverity: "Степень тяжести",
      fieldWeather: "Погода",
      fieldRepairEstimate: "Сумма ремонта (сум)",
      fieldStatus: "Статус",
      fieldInsurance: "Страховая компания",
      fieldDescription: "Описание",
      fieldDamagedParts: "Повреждённые элементы",
      requireDamagedPart: "Укажите хотя бы одну повреждённую деталь",
      cancel: "Отмена",
      save: "Сохранить",
      saving: "Сохранение...",
      savedEdit: "Запись обновлена",
      savedAdd: "ДТП добавлено",
      saveFailedFallback: "Не удалось сохранить запись",
      connectionError: "Ошибка соединения",
    },
  },
  errors: {
    unauthorized: "Не авторизовано",
    vehicleNotFound: "Автомобиль не найден",
    vehicleNotFoundInDb: "Автомобиль не найден в базе данных",
    accidentNotFound: "Запись не найдена",
    invalidQuery: "Некорректный запрос",
    invalidData: "Некорректные данные",
    enterPassword: "Введите пароль",
    wrongPassword: "Неверный пароль",
  },
  damagedParts: {
    front_bumper: "Передний бампер",
    rear_bumper: "Задний бампер",
    hood: "Капот",
    roof: "Крыша",
    trunk: "Крышка багажника",
    left_front_door: "Левая передняя дверь",
    left_rear_door: "Левая задняя дверь",
    right_front_door: "Правая передняя дверь",
    right_rear_door: "Правая задняя дверь",
    left_front_fender: "Левое переднее крыло",
    right_front_fender: "Правое переднее крыло",
    left_rear_fender: "Левое заднее крыло",
    right_rear_fender: "Правое заднее крыло",
    windshield: "Лобовое стекло",
  },
  domain: {
    severity,
    status,
    transmission,
    fuelType,
    cities,
    colors,
    weather,
    streets,
    accidentDescriptions,
    ownerType,
    mileageSource,
    mileageVerdict,
    lienStatus,
    importType,
    auctionResult,
    restrictionType,
    restrictionStatus,
    registrationEventType,
    originCountry,
  },
  history: {
    sectionTitle: "Полная история автомобиля",
    sectionSubtitle: "Данные, собранные из государственных реестров и партнёрских источников",
    ownership: {
      title: "История владельцев",
      ownerLabel: "Владелец №{n}",
      currentBadge: "Текущий владелец",
      fromTo: "{from} — {to}",
      toPresent: "по настоящее время",
    },
    mileage: {
      title: "Проверка пробега",
      verdictConsistentTitle: "Показания одометра согласованы",
      verdictConsistentDescription: "Зафиксированные показания пробега последовательно увеличиваются без аномалий.",
      verdictDiscrepancyTitle: "Обнаружено несоответствие показаний",
      verdictDiscrepancyDescription: "На одном из этапов зафиксировано уменьшение пробега — возможное скручивание одометра. Рекомендуется проверка на СТО.",
      checkpointsTitle: "История показаний",
      currentReading: "Текущее показание",
    },
    taxi: {
      title: "История такси",
      usedTitle: "Использовался как такси",
      usedDescription: "Автомобиль был зарегистрирован в службе такси или каршеринга.",
      notUsedTitle: "Личное использование",
      notUsedDescription: "Записей об использовании в качестве такси или каршеринга не обнаружено.",
      operatorLabel: "Оператор",
      periodLabel: "Период",
    },
    loan: {
      title: "Статус кредита и залога",
      lenderLabel: "Кредитор",
      amountLabel: "Сумма",
      sinceLabel: "С",
      releasedLabel: "Снято",
      noneDescription: "Автомобиль не находится и не находился в залоге у банка или лизинговой компании.",
      activeDescription: "Автомобиль находится в залоге. Перед покупкой рекомендуется уточнить условия снятия обременения.",
      releasedDescription: "Залог был снят — на момент проверки ограничений нет.",
    },
    import: {
      title: "История импорта",
      originLabel: "Страна происхождения",
      typeLabel: "Тип ввоза",
      customsDateLabel: "Дата таможенного оформления",
      declarationLabel: "Номер декларации",
      domesticNote: "Собран на территории Узбекистана — таможенное оформление не применяется.",
    },
    auction: {
      title: "История аукционов",
      noneTitle: "Участий в аукционах не обнаружено",
      noneDescription: "Автомобиль не выставлялся на публичные торги.",
      houseLabel: "Аукционный дом",
      startPriceLabel: "Стартовая цена",
      finalPriceLabel: "Итоговая цена",
      notSoldNote: "Не продано",
    },
    restrictions: {
      title: "Розыск и ограничения",
      cleanTitle: "Ограничений не обнаружено",
      cleanDescription: "Автомобиль не числится в розыске и не имеет действующих ограничений.",
      activeTitle: "Обнаружено действующее ограничение",
      activeDescription: "Рекомендуется уточнить статус перед сделкой.",
      historicalTitle: "Ограничение было снято",
      typeLabel: "Тип",
      dateLabel: "Дата наложения",
      liftedLabel: "Дата снятия",
    },
    registration: {
      title: "История регистрации",
    },
  },
};

export default ru;
