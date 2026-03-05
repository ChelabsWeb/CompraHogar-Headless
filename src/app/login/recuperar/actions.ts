"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerRecoverMutation } from "@/lib/customer";

export type RecoverActionState = {
  success: boolean;
  message?: string;
  error?: string;
};

export async function customerRecoverAction(
  prevState: RecoverActionState,
  formData: FormData
): Promise<RecoverActionState> {
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return { success: false, error: "Por favor, proporciona un correo electrónico válido." };
  }

  try {
    const { body } = await shopifyFetch({
      query: customerRecoverMutation,
      variables: { email },
    });

    const userErrors = body.data?.customerRecover?.customerUserErrors;

    if (userErrors && userErrors.length > 0) {
      return { success: false, error: userErrors[0].message };
    }

    // Success simulation (Shopify handles success/no-action quietly for security)
    return { 
      success: true, 
      message: "Si hay una cuenta asociada a ese correo, te hemos enviado un enlace para restablecer tu contraseña." 
    };
    
  } catch (error) {
    console.error("Error en customerRecoverAction:", error);
    return { 
      success: false, 
      error: "Ocurrió un error inesperado al intentar solicitar el restablecimiento. Intenta más tarde." 
    };
  }
}
