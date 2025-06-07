run:
	PORT=3100 npm run dev

seed:
	npx prisma db seed

prod:
	npm run build && npm start

typage:
	npx tsc --noEmit

lint:
	npm run lint

typage_lint: lint typage
