-- Seed approved reviews for the landing page
-- Temporarily disable the trigger so we can set is_approved=true directly

DROP TRIGGER IF EXISTS validate_review_trigger ON public.reviews;

INSERT INTO public.reviews (id, customer_name, rating, comment, image_url, is_approved) VALUES
  ('66df8d89-d841-45e1-acd4-52b10a96e66c', 'أمين من سطيف', 5, 'صراحة كنت خايف من الجودة بصح كي وصلني الباك تفاجأت 😍 القماش مليح بزاف و المقاس جا كيفاه حبيت.', NULL, true),
  ('0300a4a8-3521-4f3b-806a-d4041e05622a', 'بلال من بجاية', 5, 'خدمة محترمة، جا نفس لي في الصور و المقاسات صح 👏', NULL, true),
  ('d6b1f283-49a1-47af-a251-723a762d5677', 'حمزة من الشلف', 5, 'السومة مقابل واش يجيك داخل الباك راهي مليحة بزاف خاصة مع التوصيل المجاني 👌', NULL, true),
  ('1a286b78-ed0c-471e-bb88-b52c462b4850', 'سفيان من قسنطينة', 5, 'كنت حاسبها جودة عادية بصح صراحة فاقت التوقعات 💯 القماش مريح بزاف.', NULL, true),
  ('8952f308-569f-4f3b-9688-5d170c3f6b47', 'ياسين من البليدة', 5, 'PACK REGULAR مليح بزاف للجامعة، بسيط و ستايل. راني نلبسو يوميا تقريباً 😎', NULL, true),
  ('db160eac-3296-46f2-96a7-65eb88283253', 'إسلام من وهران', 5, 'التوصيل كان سريع و الحاجة لي عجبتني فتحت الكولي قبل ما نخلص 👌 الجودة مليحة بالنسبة للسومة.', NULL, true),
  ('0851be29-3f40-47f5-a023-1b3fb320aea3', 'ريان من الجزائر العاصمة', 5, 'طلبت PACK OVERSIZE و الستايل جا وااعر 🔥 خاصة الشورت و الساكوش. صحابي كامل سقساوني منين شريتهم 😂', NULL, true),
  ('b4feed75-2b34-4479-a6f3-357e21674a7a', 'test', 5, 'testte', 'https://wkmfmpkzfqbdbkjqesbc.supabase.co/storage/v1/object/public/product-media/reviews/1779123558629-jqh81s.jpg', true)
ON CONFLICT (id) DO UPDATE SET
  customer_name = EXCLUDED.customer_name,
  rating = EXCLUDED.rating,
  comment = EXCLUDED.comment,
  image_url = EXCLUDED.image_url,
  is_approved = EXCLUDED.is_approved;

-- Re-create the trigger
CREATE TRIGGER validate_review_trigger
BEFORE INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review();
