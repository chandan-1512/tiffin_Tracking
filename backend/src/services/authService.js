const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(prisma, { name, email, password, role = "OWNER" }) {
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error("Email already registered");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role
    }
  });

  return user;
}

async function login(prisma, { email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { customer: true }
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      customerId: user.customer?.id || null
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      customerId: user.customer?.id || null
    }
  };
}

module.exports = { register, login };
