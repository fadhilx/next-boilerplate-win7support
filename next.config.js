const { PrismaClient } = require('@prisma/client')
const prompts = require('prompts')
const bcrypt = require('bcrypt')

let doneBootstrap = false

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

async function setup() {

  const prisma = new PrismaClient()
  console.log("started")
  const user = await prisma.user.findFirst({})

  if (!user && process.env.NODE_ENV === "development") {
    if (!(await prompts({
      name: 'isTrue',
      type: 'confirm',
      message: 'User doesnt exist yet, do you want to create it?',
      initial: true
    })).isTrue) return nextConfig

    console.log("Creating user")
    const answ = await prompts([{
      name: 'username',
      type: 'text',
      message: 'Username:',

    }, {
      name: 'password',
      type: 'password',
      message: 'Password:',
    }])
    if (answ.username && answ.password) {
      const hashedPassword = await bcrypt.hash(answ.password, 10); // 10 is the salt rounds
      const user = await prisma.user.create({
        data: {
          username: answ.username,
          password: hashedPassword
        }
      })
      const { password, ...filtered } = user
      return console.log("User has been created", filtered)
    }
    console.log("User has not been created, username or password missing")
  }
}
module.exports = async () => {
  await setup()
  return nextConfig
}
