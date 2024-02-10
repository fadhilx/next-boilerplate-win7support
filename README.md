# nextjs for 12.22.2 (supported non problamatic node version in win7)

include prisma and tailwind, but old

not tested, no warranty

## 1. Install
```
git clone https://github.com/fadhilx/next-boilerplate-win7support myproject
cd myproject
yarn install
```
## 2 Create `.env` file
rename `.env.example` to `.env`

## 3. Migrate prisma(for auth)(optional, read 3.1)
```
npx prisma migrate dev
```

### 3.1. You dont want prisma and my pages?
1. Remove `setup` function in `next.config.js` 
2. Remove all in `/pages` and create ur own (necessary if you dont want prisma)

## 4. Run
```
yarn dev
```

### Finally
Free Palestine! (cause they can be political for ukraine, why not for humanity?)