// Demo content shown until Supabase env vars are configured, so the site
// never looks empty during setup. Services are carried over
// from the clinic's existing site. Offers/doctors/reviews are clearly
// marked as examples — replace or delete them from /admin once connected.

export const fallbackServiceCategories = [
  { slug: "dentistry", name_ar: "طب الأسنان", name_en: "Dentistry" },
  { slug: "dermatology", name_ar: "الأمراض الجلدية", name_en: "Dermatology" },
];

export const fallbackServices = [
  {
    id: "svc-orthodontics",
    slug: "orthodontics",
    category: "dentistry",
    name_ar: "تقويم الأسنان",
    name_en: "Orthodontics",
    excerpt_ar: "ابتسامة متناسقة مع تقويم الأسنان!",
    excerpt_en: "A harmonious smile with braces!",
    description_ar:
      "نقدم أحدث أنواع تقويم الأسنان المعدني والشفاف لتصحيح اصطفاف الأسنان والفكين، بإشراف أطباء متخصصين ومتابعة دورية حتى تحصل على ابتسامة متناسقة وصحية.",
    description_en:
      "We offer the latest metal and clear orthodontic options to correct teeth and jaw alignment, under specialist supervision with regular follow-ups for a healthy, harmonious smile.",
    icon: "smile",
  },
  {
    id: "svc-ortho-metal",
    slug: "metal-braces",
    category: "dentistry",
    parent_service_id: "svc-orthodontics",
    name_ar: "التقويم المعدني",
    name_en: "Metal Braces",
    excerpt_ar: "التقويم المعدني التقليدي الفعال في تصحيح اصطفاف الأسنان.",
    excerpt_en: "The classic, highly effective metal braces for aligning teeth.",
    description_ar:
      "التقويم المعدني هو الخيار الأكثر انتشاراً وفعالية لتصحيح ازدحام الأسنان ومشاكل الإطباق، ويتميز بقوة تحمله وتكلفته المناسبة مع متابعة دورية من الطبيب المختص.",
    description_en:
      "Metal braces are the most widely used and effective option for correcting crowded teeth and bite problems, offering durability and affordability with regular specialist follow-ups.",
    icon: "smile",
  },
  {
    id: "svc-ortho-clear",
    slug: "clear-aligners",
    category: "dentistry",
    parent_service_id: "svc-orthodontics",
    name_ar: "التقويم الشفاف",
    name_en: "Clear Aligners",
    excerpt_ar: "تقويم غير مرئي لابتسامة مثالية دون أسلاك واضحة.",
    excerpt_en: "Invisible aligners for a perfect smile with no visible wires.",
    description_ar:
      "التقويم الشفاف هو أحدث تقنيات تقويم الأسنان، حيث يتم استخدام قوالب شفافة قابلة للإزالة تعمل على تحريك الأسنان تدريجياً دون ظهور أسلاك معدنية، مما يتيح لك راحة أكبر ومظهراً جمالياً طوال فترة العلاج.",
    description_en:
      "Clear aligners are the latest orthodontic technology using removable transparent trays that gradually move your teeth with no visible metal wires, offering greater comfort and a discreet look throughout treatment.",
    icon: "sparkle",
  },
  {
    id: "svc-ortho-lingual",
    slug: "lingual-braces",
    category: "dentistry",
    parent_service_id: "svc-orthodontics",
    name_ar: "التقويم اللساني",
    name_en: "Lingual Braces",
    excerpt_ar: "تقويم مثبت خلف الأسنان بمظهر مخفي تماماً.",
    excerpt_en: "Braces fixed behind the teeth, completely hidden from view.",
    description_ar:
      "التقويم اللساني (الداخلي) يتم تثبيته على السطح الخلفي للأسنان، فيكون مخفياً تماماً عن الأنظار مع تحقيق نتائج ممتازة، وهو مثالي لمن يبحث عن علاج فعال دون التأثير على المظهر.",
    description_en:
      "Lingual (inner) braces are fixed to the back surface of the teeth, staying completely hidden while delivering excellent results - ideal for anyone seeking effective treatment without affecting appearance.",
    icon: "stethoscope",
  },
  {
    id: "svc-gum",
    slug: "gum-treatment",
    category: "dentistry",
    name_ar: "علاج وتجميل اللثة",
    name_en: "Gum Treatment & Beautification",
    excerpt_ar: "لثتك الصحية سر ابتسامتك الجميلة!",
    excerpt_en: "Healthy gums are the secret to your beautiful smile!",
    description_ar:
      "علاج التهابات اللثة وتجميل خط اللثة باستخدام أحدث التقنيات لضمان لثة صحية تدعم ابتسامتك.",
    description_en:
      "Treatment of gum inflammation and gumline contouring using the latest techniques for healthy gums that support your smile.",
    icon: "heart-pulse",
  },
  {
    id: "svc-cosmetic",
    slug: "cosmetic-dentistry",
    category: "dentistry",
    name_ar: "طب الأسنان وطب الأسنان التجميلي",
    name_en: "Dentistry & Cosmetic Dentistry",
    excerpt_ar: "ابتسامة صحية وجميلة تبدأ من هنا!",
    excerpt_en: "A healthy, beautiful smile starts here!",
    description_ar:
      "خدمات شاملة لطب الأسنان العام والتجميلي، من الحشوات وتبييض الأسنان إلى الفينير، لتحصل على الابتسامة التي تستحقها.",
    description_en:
      "Comprehensive general and cosmetic dentistry, from fillings and whitening to veneers, for the smile you deserve.",
    icon: "sparkles",
  },
  {
    id: "svc-pediatric",
    slug: "pediatric-dentistry",
    category: "dentistry",
    name_ar: "طب أسنان الأطفال",
    name_en: "Pediatric Dentistry",
    excerpt_ar: "ابتسامة طفلك تبدأ بعناية أسنان مبكرة!",
    excerpt_en: "Your child's smile starts with early dental care!",
    description_ar:
      "بيئة مريحة وودودة للأطفال مع أطباء متخصصين في طب أسنان الأطفال للوقاية والعلاج المبكر.",
    description_en:
      "A friendly, comfortable environment for children with specialists in pediatric dentistry for prevention and early treatment.",
    icon: "baby",
  },
  {
    id: "svc-rootcanal",
    slug: "root-canal",
    category: "dentistry",
    name_ar: "علاج جذور الأسنان",
    name_en: "Root Canal Treatment",
    excerpt_ar: "علاج جذور الأسنان لاستعادة الراحة والصحة!",
    excerpt_en: "Root canal treatment to restore comfort and health!",
    description_ar:
      "علاج قنوات الجذور بأحدث الأجهزة لتخفيف الألم والحفاظ على السن الطبيعي قدر الإمكان.",
    description_en:
      "Root canal treatment with modern equipment to relieve pain and preserve the natural tooth wherever possible.",
    icon: "activity",
  },
  {
    id: "svc-implants",
    slug: "dental-implants",
    category: "dentistry",
    name_ar: "جراحة وزراعة الأسنان",
    name_en: "Dental Surgery & Implants",
    excerpt_ar: "ابتسامة جديدة تبدأ بزراعة الأسنان!",
    excerpt_en: "A new smile begins with dental implants!",
    description_ar:
      "استعادة الابتسامة والمظهر الطبيعي بثبات قوي ودائم، مع حماية صحة عظام الفك وعناية سهلة كالأسنان الطبيعية.",
    description_en:
      "Restore your smile and natural appearance with strong, durable stability, protecting jaw bone health with easy, natural-tooth-like care.",
    icon: "shield-plus",
  },
  {
    id: "svc-skincare",
    slug: "skin-care",
    category: "dermatology",
    name_ar: "العناية بالبشرة",
    name_en: "Skin Care",
    excerpt_ar: "عناية متكاملة بالبشرة للحصول على أفضل النتائج!",
    excerpt_en: "Integrated skin care for the best results!",
    description_ar: "برامج عناية متكاملة بالبشرة مصممة حسب نوع بشرتك لتحقيق نتائج صحية ومشرقة.",
    description_en: "Integrated skin care programs tailored to your skin type for healthy, glowing results.",
    icon: "sun",
  },
  {
    id: "svc-acne",
    slug: "acne-treatment",
    category: "dermatology",
    name_ar: "علاج حب الشباب",
    name_en: "Acne Treatment",
    excerpt_ar: "خطط علاجية مخصصة لبشرة نقية.",
    excerpt_en: "Personalized treatment plans for clear skin.",
    description_ar: "تشخيص ومعالجة حب الشباب بأحدث البروتوكولات الطبية والتجميلية.",
    description_en: "Diagnosis and treatment of acne using the latest medical and cosmetic protocols.",
    icon: "droplet",
  },
  {
    id: "svc-rejuvenation",
    slug: "skin-rejuvenation",
    category: "dermatology",
    name_ar: "تجديد البشرة",
    name_en: "Skin Rejuvenation",
    excerpt_ar: "إشراقة متجددة لبشرتك.",
    excerpt_en: "Renewed radiance for your skin.",
    description_ar: "تقنيات حديثة لتجديد خلايا البشرة وتحسين ملمسها ونضارتها.",
    description_en: "Modern techniques to renew skin cells and improve texture and freshness.",
    icon: "sparkle",
  },
  {
    id: "svc-otherskin",
    slug: "other-skin-conditions",
    category: "dermatology",
    name_ar: "أمراض جلدية أخرى",
    name_en: "Other Skin Conditions",
    excerpt_ar: "تشخيص ومتابعة دقيقة لكافة المشاكل الجلدية.",
    excerpt_en: "Careful diagnosis and follow-up for all skin concerns.",
    description_ar: "تشخيص ومتابعة الحالات الجلدية المختلفة على يد أطباء جلدية متخصصين.",
    description_en: "Diagnosis and follow-up of various skin conditions by specialist dermatologists.",
    icon: "stethoscope",
  },
];

export const fallbackOffers = [
  {
    id: "offer-example-1",
    slug: "example-offer",
    active: true,
    title_ar: "عرض تجريبي — عدّله من لوحة التحكم",
    title_en: "Example Offer — edit me from the control panel",
    description_ar: "هذا نص عرض تجريبي لتوضيح شكل بطاقة العروض. استبدله بعرضك الحقيقي من لوحة التحكم.",
    description_en: "This is placeholder offer copy to show how the offer card looks. Replace it with a real offer from the admin panel.",
    badge_ar: "عرض تجريبي",
    badge_en: "Sample",
  },
];

export const fallbackDoctors = [
  {
    id: "doctor-example-1",
    slug: "doctor-example",
    active: true,
    name_ar: "د. اسم الطبيب",
    name_en: "Dr. Doctor Name",
    specialty_ar: "أضف التخصص من لوحة التحكم",
    specialty_en: "Add specialty from the control panel",
    bio_ar: "هذه بيانات تجريبية لعرض تصميم بطاقة الطبيب. أضف بيانات أطبائك الحقيقيين من لوحة التحكم.",
    bio_en: "This is placeholder data to preview the doctor card design. Add your real doctors from the admin panel.",
    photo_url: null,
  },
];

// No fabricated reviews are seeded — reviews should come from real Google
// Maps feedback (via the Places API integration) or be entered honestly
// through /admin/reviews.
export const fallbackTestimonials = [];

export const fallbackFaqs = [
  {
    id: "faq-booking",
    question_ar: "كيف أحجز موعداً؟",
    question_en: "How do I book an appointment?",
    answer_ar:
      "اختر الخدمة أو العرض أو الطبيب الذي تحتاجه من موقعنا واضغط زر الحجز — سيفتح واتساب برسالة جاهزة باسم الخدمة. سيرد عليك فريقنا بسرعة لتأكيد موعدك.",
    answer_en:
      "Choose the service, offer, or doctor you need on our website and tap the book button — it opens WhatsApp with a message already prepared for you. Our team replies quickly to confirm your appointment time.",
    sort_order: 1,
    active: true,
  },
  {
    id: "faq-hours",
    question_ar: "متى تكون العيادة مفتوحة؟",
    question_en: "When is the clinic open?",
    answer_ar:
      "نستقبلكم يومياً. أرسل لنا رسالة على واتساب لمعرفة أوقات العمل الأحدث واختيار الوقت المناسب لك.",
    answer_en:
      "We're open every day. Send us a message on WhatsApp for the most up-to-date opening hours and to find a time that suits you.",
    sort_order: 2,
    active: true,
  },
  {
    id: "faq-location",
    question_ar: "أين تقع العيادة؟",
    question_en: "Where is the clinic located?",
    answer_ar:
      "نقع في حفر الباطن بالمملكة العربية السعودية. استخدم زر «الموقع على الخرائط» في صفحة التواصل لفتح موقعنا في خرائط جوجل.",
    answer_en:
      "We are located in Hafr Al-Batin, Saudi Arabia. Use the Get Directions button on our contact page to open our location in Google Maps.",
    sort_order: 3,
    active: true,
  },
];

export const fallbackBeforeAfter = [
  {
    id: "ba-teeth-whitening",
    related_service_slug: "cosmetic-dentistry",
    title_ar: "تبييض الأسنان",
    title_en: "Teeth whitening",
    description_ar: "نتائج تبييض احترافية بجلسة واحدة في عيادتنا.",
    description_en: "Professional whitening results in a single visit.",
    before_image: "/images/svc-smile.jpg",
    after_image: "/images/svc-smile.jpg",
    sort_order: 1,
    active: true,
  },
  {
    id: "ba-skin-treatment",
    related_service_slug: "skin-care",
    title_ar: "علاج مشاكل البشرة",
    title_en: "Skin treatment",
    description_ar: "بشرة أوضح وأكثر إشراقاً بخطة علاجية مخصصة لك.",
    description_en: "Clearer, brighter skin with a plan tailored to you.",
    before_image: "/images/derma-skin.jpg",
    after_image: "/images/derma-skin.jpg",
    sort_order: 2,
    active: true,
  },
];

export const fallbackSettings = {
  clinic_name_ar: "عيادات الأسرة",
  clinic_name_en: "Alusra Clinics",
  phone: "+966137233900",
  whatsapp_number: "966137233900",
  email: "info@alusraclinics.com",
  address_ar: "حفر الباطن، المملكة العربية السعودية",
  address_en: "Hafr Al-Batin, Saudi Arabia",
  working_hours_ar: "يومياً من 9 صباحاً حتى 12 منتصف الليل",
  working_hours_en: "Daily 9:00 AM – 12:00 AM",
  maps_url: "https://maps.app.goo.gl/wzZbx4qzUbNtn6p56?g_st=iw",
  instagram_url: "https://www.instagram.com/alusraclinics",
  snapchat_url: "https://www.snapchat.com/add/alusraclinics",
  x_url: "https://x.com/alusraclinics",
  facebook_url: "https://www.facebook.com/alusraclinics",
  tiktok_url: "",
  youtube_url: "",
  telegram_url: "",
  linkedin_url: "",
  threads_url: "",
  google_place_id: "",
  about_title_ar: "نبذة عن عيادات الأسرة",
  about_title_en: "About Alusra Clinics",
  about_text_ar:
    "عيادات الأسرة هي عيادات أسنان وجلدية تأسست منذ أكثر من عشرين عاماً. تضم فريقاً متميزاً من الأطباء المتخصصين في طب الأسنان والجلدية، يسعون لتقديم خدمات عصرية وعلاجية بمهنية عالية لضيوفنا الكرام. نستخدم أحدث التقنيات والأدوات المتطورة لضمان رضاكم وراحتكم، ونؤمن بأهمية خلق بيئة مريحة وداعمة — هدفنا مساعدتكم على تحقيق الابتسامة المثالية والبشرة المشرقة.",
  about_text_en:
    "Alusra Clinics are dental and dermatology clinics established more than twenty years ago. Our distinguished team of specialists provides a comprehensive range of modern, professional treatments for our valued guests. We use the latest technologies and tools to ensure your comfort and satisfaction, and we believe in creating a welcoming, supportive environment — our goal is helping you achieve the perfect smile and radiant skin.",
  about_images: [
    "/images/alusra-clinics.jpeg",
    "/images/clinic-interior.jpg",
    "/images/smile-woman.jpg",
  ],
  contact_images: ["/images/alusra-clinics.jpeg"],
};
