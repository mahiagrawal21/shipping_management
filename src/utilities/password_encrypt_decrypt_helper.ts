import bcrypt from 'bcrypt';

const saltRounds = 10;

async function encryptPassword(rawUserInputPassword: string): Promise<string | null> {
  try {
    const hashedPass = await bcrypt.hash(rawUserInputPassword, saltRounds);
    return hashedPass;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function decryptPassword(
  rawUserInputPassword: string,
  hashedPassword: string
): Promise<boolean | null> {
  try {
    const compare = await bcrypt.compare(rawUserInputPassword, hashedPassword);
    return compare;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { encryptPassword, decryptPassword };
