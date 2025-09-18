# AI Hub
خدمة دردشة خفيفة تربط بين المستخدم ونموذج OpenAI (يمكن إضافة نماذج أخرى لاحقاً). مهيأ للنشر على Vercel ويدعم العمل من الموبايل.

## الخطوات السريعة (من الموبايل)
1. افتح Replit أو StackBlitz وأنشئ مشروع Next.js (TypeScript اختياري).
2. أنشئ الملفات التالية من هذا المستند
3. ضع مفاتيح API في `Environment Variables` أو `.env.local` (في Replit أو Vercel):
   - `OPENAI_API_KEY` = مفتاح OpenAI
4. شغل المشروع وتأكد أنه يعمل محلياً ثم اربطه بمستودع GitHub.
5. ادفع (push) إلى GitHub واربط المستودع بـ Vercel ونشر.

## ملاحظة
- هذا المشروع يستخدم **server-side API route** لحماية مفتاح الـ API.
- لتفعيل Gemini/Claude أضف مسارات API مماثلة في `/app/api` أو `/pages/api`.
