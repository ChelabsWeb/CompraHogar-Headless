"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { customerResetMutation, type CustomerResetResponse } from "@/lib/customer";

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const customerId = formData.get("id") as string;
  const token = formData.get("token") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!customerId || !token || !password) {
    return { error: "Faltan datos requeridos." };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  if (password.length < 5) {
    return { error: "La contraseña debe tener al menos 5 caracteres." };
  }

  // Shopify Storefront API expects a Global ID for the customer
  const globalId = `gid://shopify/Customer/${customerId}`;

  try {
    const { body } = await shopifyFetch({
      query: customerResetMutation,
      variables: {
        id: globalId,
        input: {
          resetToken: token,
          password: password,
        },
      },
    }) as { body: CustomerResetResponse };

    const resetData = body.data?.customerReset;

    if (resetData?.customerUserErrors && resetData.customerUserErrors.length > 0) {
      return { error: resetData.customerUserErrors[0].message };
    }

    if (resetData?.customerAccessToken?.accessToken) {
      // Login successful, set the cookie
      const cookieStore = await cookies();
      cookieStore.set({
        name: "customerAccessToken",
        value: resetData.customerAccessToken.accessToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    } else {
      return { error: "No se pudo iniciar sesión tras restablecer la contraseña." };
    }
  } catch (error: any) {
    return { error: "Ocurrió un error al procesar la solicitud." };
  }

  // Redirect to account page after successful reset and login
  redirect("/cuenta");
}
