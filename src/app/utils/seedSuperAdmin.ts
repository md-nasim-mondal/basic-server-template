import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("ℹ️ Super Admin already exists.");
      return;
    }

    console.log("🌱 Seeding Super Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    await User.create({
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      isDeleted: false,
      isActive: IsActive.ACTIVE,
      auths: [authProvider],
    });

    console.log("✅ Super Admin created successfully!");
  } catch (error) {
    console.error("❌ Error seeding Super Admin:", error);
  }
};
