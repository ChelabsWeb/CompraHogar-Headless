"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerAccessTokenCreateMutation } from "@/lib/customer";
import { cookies } from "next/headers";

export async function loginCustomer(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor completa todos los campos." };
  }

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
      return { success: true };
    }

    return { error: "Credenciales inválidas. Por favor intenta de nuevo." };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: "Ha ocurrido un error inesperado al iniciar sesión." };
  }
}
