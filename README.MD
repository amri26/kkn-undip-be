1. npm i
2. buat file .env
3. isi file .env dengan:
   PORT=2603
   DATABASE_URL="mysql://root:@localhost:3306/kkn_undip?schema=public"

4. npx prisma db push
5. buka phpmyadmin, import sql
6. buka postman, import collection
7. npm run dev
