"use server";

import { cookies } from "next/headers";

export async function setLocation(cp: string, department: string) {
  const cookieStore = await cookies();
  
  // Guardamos la ubicación en una cookie segura
  cookieStore.set("user_location", JSON.stringify({ cp, department }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 días de duración
  });
  
  return { success: true };
}

export async function getLocation() {
  const cookieStore = await cookies();
  const locationCookie = cookieStore.get("user_location");
  
  if (!locationCookie?.value) return null;
  
  try {
    return JSON.parse(locationCookie.value) as { cp: string; department: string };
  } catch (e) {
    return null;
  }
}
