run:
	PORT=3100 npm start

run-dev:
	PORT=3100 npm run dev

build:
	npm run build

seed:
	npx prisma db seed

prod:
	npm run build && PORT=3100 npm start

typage:
	npx tsc --noEmit

lint:
	npm run lint

typage_lint: lint typage
