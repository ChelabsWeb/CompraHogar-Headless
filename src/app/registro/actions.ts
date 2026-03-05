"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerCreateMutation, customerAccessTokenCreateMutation } from "@/lib/customer";
import { cookies } from "next/headers";

export async function registerCustomer(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !firstName || !lastName) {
    return { error: "Por favor completa todos los campos." };
  }

  try {
    // 1. Create the customer account
    const { body: createBody } = await shopifyFetch({
      query: customerCreateMutation,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password,
          acceptsMarketing: true, 
        },
      },
    });

    const createData = createBody.data?.customerCreate;

    if (createData?.customerUserErrors?.length > 0) {
      return { error: createData.customerUserErrors[0].message };
    }

    if (!createData?.customer?.id) {
       return { error: "No se pudo crear la cuenta." };
    }

    // 2. Automatically log the user in
    const { body: loginBody } = await shopifyFetch({
      query: customerAccessTokenCreateMutation,
      variables: {
        input: {
          email,
          password,
        },
      },
    });

    const loginData = loginBody.data?.customerAccessTokenCreate;
    
    if (loginData?.customerUserErrors?.length > 0) {
        // Created successfully but failed to auto-login.
        // User will likely just need to go to /login
        return { success: true, warning: 'Cuenta creada exitosamente, por favor inicia sesión.' };
    }

    const accessToken = loginData?.customerAccessToken?.accessToken;

    if (accessToken) {
      const cookieStore = await cookies();
      cookieStore.set("customerAccessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return { success: true };
    }

    return { success: true, warning: 'Cuenta creada exitosamente. Redirigiendo a inicio de sesión...' };

  } catch (error) {
    console.error("Error al registrarse:", error);
    return { error: "Ha ocurrido un error inesperado. Inténtalo de nuevo." };
  }
}
