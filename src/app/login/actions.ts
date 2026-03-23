"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerAccessTokenCreateMutation } from "@/lib/customer";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

export async function loginCustomer(formData: FormData) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  const { success: allowed } = rateLimit(`login:${ip}`, 5, 60000);
  if (!allowed) {
    return { error: "Demasiados intentos. Esperá un minuto antes de volver a intentar." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor completa todos los campos." };
  }

  let safeRedirect: string | null = null;

  try {
    const { body } = await shopifyFetch({
      query: customerAccessTokenCreateMutation,
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    const data = body.data?.customerAccessTokenCreate;

    if (data?.customerUserErrors?.length > 0) {
      return { error: data.customerUserErrors[0].message };
    }

    const accessToken = data?.customerAccessToken?.accessToken;

    if (accessToken) {
      // Store token in HTTP-only cookie
      const cookieStore = await cookies();
      cookieStore.set("customerAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Expire cookie slightly before Shopify token expires (usually 30 days)
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      const redirectTo = formData.get("redirect") as string | null;
      // Open redirect protection: must start with / and not contain //
      safeRedirect =
        redirectTo && redirectTo.startsWith("/") && !redirectTo.includes("//")
          ? redirectTo
          : "/cuenta/perfil";
    } else {
      return { error: "Credenciales inválidas. Por favor intenta de nuevo." };
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: "Ha ocurrido un error inesperado al iniciar sesión." };
  }

  // redirect() must be called outside try/catch because it throws internally
  redirect(safeRedirect!);
}
