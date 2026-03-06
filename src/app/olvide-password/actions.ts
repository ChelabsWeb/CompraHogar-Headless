"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerRecoverMutation } from "@/lib/customer";

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Por favor, ingresa un correo electrónico válido." };
  }

  try {
    const { body } = await shopifyFetch({
      query: customerRecoverMutation,
      variables: {
        email,
      },
    }) as { body: any };

    const recoverData = body.data?.customerRecover;

    if (recoverData?.customerUserErrors && recoverData.customerUserErrors.length > 0) {
      // Evitar dar demasiada información si el correo no existe por seguridad,
      // pero mostrar errores de validación si existen.
      return { error: recoverData.customerUserErrors[0].message };
    }

    return { 
      success: "Si hay una cuenta asociada a este correo, te hemos enviado las instrucciones para restablecer tu contraseña." 
    };

  } catch (error: any) {
    return { error: "Ocurrió un error al procesar tu solicitud. Intenta nuevamente más tarde." };
  }
}
