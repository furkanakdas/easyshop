import bcrypt from "bcryptjs"


// Hashleme
export async function hashPassword(password:string) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword =await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Karşılaştırma
export async function comparePasswords(plainPassword:string, hashedPassword:string) {
  const isMatch = bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}


