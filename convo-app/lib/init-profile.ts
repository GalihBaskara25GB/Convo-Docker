import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initProfile = async () => {
  
  const user = await currentUser();

  if(!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id
    }
  });

  if (profile) 
    return profile;

  const email = user.emailAddresses[0].emailAddress
  const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : email.split("@")[0]

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: fullName,
      imageUrl: user.imageUrl,
      email: email
    }
  });

  return newProfile;
}