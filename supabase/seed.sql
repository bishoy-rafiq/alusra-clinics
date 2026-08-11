-- ============================================================================
-- Alusra Clinics — seed data
-- Run AFTER schema.sql. Safe to re-run (upserts on slug).
-- Services content is carried over from the clinic's existing site.
-- Offers & doctors are placeholders — edit or delete them from /admin.
-- ============================================================================

insert into service_categories (slug, name_ar, name_en, sort_order) values
  ('dentistry', 'طب الأسنان', 'Dentistry', 1),
  ('dermatology', 'الأمراض الجلدية', 'Dermatology', 2)
on conflict (slug) do update set name_ar = excluded.name_ar, name_en = excluded.name_en;

insert into services (slug, category, name_ar, name_en, excerpt_ar, excerpt_en, description_ar, description_en, icon, sort_order) values
('orthodontics', 'dentistry', 'تقويم الأسنان', 'Orthodontics',
  'ابتسامة متناسقة مع تقويم الأسنان!', 'A harmonious smile with braces!',
  'نقدم أحدث أنواع تقويم الأسنان المعدني والشفاف لتصحيح اصطفاف الأسنان والفكين، بإشراف أطباء متخصصين ومتابعة دورية حتى تحصل على ابتسامة متناسقة وصحية.',
  'We offer the latest metal and clear orthodontic options to correct teeth and jaw alignment, under specialist supervision with regular follow-ups for a healthy, harmonious smile.',
  'smile', 1),
('gum-treatment', 'dentistry', 'علاج وتجميل اللثة', 'Gum Treatment & Beautification',
  'لثتك الصحية سر ابتسامتك الجميلة!', 'Healthy gums are the secret to your beautiful smile!',
  'علاج التهابات اللثة وتجميل خط اللثة باستخدام أحدث التقنيات لضمان لثة صحية تدعم ابتسامتك.',
  'Treatment of gum inflammation and gumline contouring using the latest techniques for healthy gums that support your smile.',
  'heart-pulse', 2),
('cosmetic-dentistry', 'dentistry', 'طب الأسنان وطب الأسنان التجميلي', 'Dentistry & Cosmetic Dentistry',
  'ابتسامة صحية وجميلة تبدأ من هنا!', 'A healthy, beautiful smile starts here!',
  'خدمات شاملة لطب الأسنان العام والتجميلي، من الحشوات وتبييض الأسنان إلى الفينير، لتحصل على الابتسامة التي تستحقها.',
  'Comprehensive general and cosmetic dentistry, from fillings and whitening to veneers, for the smile you deserve.',
  'sparkles', 3),
('pediatric-dentistry', 'dentistry', 'طب أسنان الأطفال', 'Pediatric Dentistry',
  'ابتسامة طفلك تبدأ بعناية أسنان مبكرة!', 'Your child''s smile starts with early dental care!',
  'بيئة مريحة وودودة للأطفال مع أطباء متخصصين في طب أسنان الأطفال للوقاية والعلاج المبكر.',
  'A friendly, comfortable environment for children with specialists in pediatric dentistry for prevention and early treatment.',
  'baby', 4),
('root-canal', 'dentistry', 'علاج جذور الأسنان', 'Root Canal Treatment',
  'علاج جذور الأسنان لاستعادة الراحة والصحة!', 'Root canal treatment to restore comfort and health!',
  'علاج قنوات الجذور بأحدث الأجهزة لتخفيف الألم والحفاظ على السن الطبيعي قدر الإمكان.',
  'Root canal treatment with modern equipment to relieve pain and preserve the natural tooth wherever possible.',
  'activity', 5),
('dental-implants', 'dentistry', 'جراحة وزراعة الأسنان', 'Dental Surgery & Implants',
  'ابتسامة جديدة تبدأ بزراعة الأسنان!', 'A new smile begins with dental implants!',
  'استعادة الابتسامة والمظهر الطبيعي بثبات قوي ودائم، مع حماية صحة عظام الفك وعناية سهلة كالأسنان الطبيعية.',
  'Restore your smile and natural appearance with strong, durable stability, protecting jaw bone health with easy, natural-tooth-like care.',
  'shield-plus', 6),
('skin-care', 'dermatology', 'العناية بالبشرة', 'Skin Care',
  'عناية متكاملة بالبشرة للحصول على أفضل النتائج!', 'Integrated skin care for the best results!',
  'برامج عناية متكاملة بالبشرة مصممة حسب نوع بشرتك لتحقيق نتائج صحية ومشرقة.',
  'Integrated skin care programs tailored to your skin type for healthy, glowing results.',
  'sun', 7),
('acne-treatment', 'dermatology', 'علاج حب الشباب', 'Acne Treatment',
  'خطط علاجية مخصصة لبشرة نقية.', 'Personalized treatment plans for clear skin.',
  'تشخيص ومعالجة حب الشباب بأحدث البروتوكولات الطبية والتجميلية.',
  'Diagnosis and treatment of acne using the latest medical and cosmetic protocols.',
  'droplet', 8),
('skin-rejuvenation', 'dermatology', 'تجديد البشرة', 'Skin Rejuvenation',
  'إشراقة متجددة لبشرتك.', 'Renewed radiance for your skin.',
  'تقنيات حديثة لتجديد خلايا البشرة وتحسين ملمسها ونضارتها.',
  'Modern techniques to renew skin cells and improve texture and freshness.',
  'sparkle', 9),
('other-skin-conditions', 'dermatology', 'أمراض جلدية أخرى', 'Other Skin Conditions',
  'تشخيص ومتابعة دقيقة لكافة المشاكل الجلدية.', 'Careful diagnosis and follow-up for all skin concerns.',
  'تشخيص ومتابعة الحالات الجلدية المختلفة على يد أطباء جلدية متخصصين.',
  'Diagnosis and follow-up of various skin conditions by specialist dermatologists.',
  'stethoscope', 10)
on conflict (slug) do update set
  name_ar = excluded.name_ar, name_en = excluded.name_en,
  excerpt_ar = excluded.excerpt_ar, excerpt_en = excluded.excerpt_en,
  description_ar = excluded.description_ar, description_en = excluded.description_en;

-- Placeholder example — replace/delete from /admin/offers
insert into offers (slug, title_ar, title_en, description_ar, description_en, badge_ar, badge_en, active) values
('example-offer', 'عرض تجريبي — عدّله من لوحة التحكم', 'Example Offer — edit me from the control panel',
 'هذا نص عرض تجريبي لتوضيح شكل بطاقة العروض. استبدله بعرضك الحقيقي من لوحة التحكم.',
 'This is placeholder offer copy to show how the offer card looks. Replace it with a real offer from the admin panel.',
 'عرض تجريبي', 'Sample', true)
on conflict (slug) do nothing;

-- Placeholder example — replace/delete from /admin/doctors
insert into doctors (slug, name_ar, name_en, specialty_ar, specialty_en, bio_ar, bio_en, active) values
('doctor-example', 'د. اسم الطبيب', 'Dr. Doctor Name',
 'أضف التخصص من لوحة التحكم', 'Add specialty from the control panel',
 'هذه بيانات تجريبية لعرض تصميم بطاقة الطبيب. أضف بيانات أطبائك الحقيقيين من لوحة التحكم.',
 'This is placeholder data to preview the doctor card design. Add your real doctors from the admin panel.',
 true)
on conflict (slug) do nothing;

update site_settings set
  clinic_name_ar = 'عيادات الأسرة',
  clinic_name_en = 'Alusra Clinics',
  phone = '+966137233900',
  whatsapp_number = '966137233900',
  email = 'info@alusraclinics.com',
  address_ar = 'حفر الباطن، المملكة العربية السعودية',
  address_en = 'Hafr Al-Batin, Saudi Arabia',
  maps_url = 'https://maps.app.goo.gl/wzZbx4qzUbNtn6p56?g_st=iw',
  instagram_url = 'https://www.instagram.com/alusraclinics',
  snapchat_url = 'https://www.snapchat.com/add/alusraclinics',
  x_url = 'https://x.com/alusraclinics',
  facebook_url = 'https://www.facebook.com/alusraclinics',
  about_title_ar = 'نبذة عن عيادات الأسرة',
  about_title_en = 'About Alusra Clinics',
  about_text_ar = 'عيادات الأسرة هي عيادات أسنان وجلدية تأسست منذ أكثر من عشرين عاماً. تضم فريقاً متميزاً من الأطباء المتخصصين في طب الأسنان والجلدية، يسعون لتقديم خدمات عصرية وعلاجية بمهنية عالية لضيوفنا الكرام. نستخدم أحدث التقنيات والأدوات المتطورة لضمان رضاكم وراحتكم، ونؤمن بأهمية خلق بيئة مريحة وداعمة — هدفنا مساعدتكم على تحقيق الابتسامة المثالية والبشرة المشرقة.',
  about_text_en = 'Alusra Clinics are dental and dermatology clinics established more than twenty years ago. Our distinguished team of specialists provides a comprehensive range of modern, professional treatments for our valued guests. We use the latest technologies and tools to ensure your comfort and satisfaction, and we believe in creating a welcoming, supportive environment — our goal is helping you achieve the perfect smile and radiant skin.'
where id = 1;

-- before/after sample cases (edit or delete from /admin once you upload real photos)
insert into before_after_cases (title_ar, title_en, description_ar, description_en, related_service_id, before_image, after_image, sort_order, active) values
  ('تبييض الأسنان', 'Teeth whitening', 'نتائج تبييض احترافية بجلسة واحدة في عيادتنا.', 'Professional whitening results in a single visit.', (select id from services where slug = 'cosmetic-dentistry'), '/images/svc-smile.jpg', '/images/svc-smile.jpg', 1, true),
  ('علاج مشاكل البشرة', 'Skin treatment', 'بشرة أوضح وأكثر إشراقاً بخطة علاجية مخصصة لك.', 'Clearer, brighter skin with a plan tailored to you.', (select id from services where slug = 'skin-care'), '/images/derma-skin.jpg', '/images/derma-skin.jpg', 2, true)
on conflict do nothing;
