prod:
	npm run build && npm start
run:
	PORT=3100 npm run dev

seed:
	npx prisma db seed
