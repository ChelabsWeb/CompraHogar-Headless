"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import {
  customerUpdateMutation,
  customerAddressCreateMutation,
  customerAddressUpdateMutation,
  customerAddressDeleteMutation,
  customerDefaultAddressUpdateMutation,
  type CustomerUpdateInput,
  type MailingAddressInput,
  type CustomerUpdateResponse,
  type CustomerAddressCreateResponse,
  type CustomerAddressUpdateResponse,
  type CustomerAddressDeleteResponse,
  type CustomerDefaultAddressUpdateResponse
} from "@/lib/customer";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  redirect("/login");
}

export async function updateCustomerProfile(customerData: CustomerUpdateInput) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerUpdateMutation,
    variables: {
      customerAccessToken: token,
      customer: customerData
    }
  }) as { body: CustomerUpdateResponse };

  return body.data.customerUpdate;
}

export async function createCustomerAddress(address: MailingAddressInput) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerAddressCreateMutation,
    variables: {
      customerAccessToken: token,
      address
    }
  }) as { body: CustomerAddressCreateResponse };

  return body.data.customerAddressCreate;
}

export async function updateCustomerAddress(addressId: string, addressData: MailingAddressInput) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerAddressUpdateMutation,
    variables: {
      customerAccessToken: token,
      id: addressId,
      address: addressData
    }
  }) as { body: CustomerAddressUpdateResponse };

  return body.data.customerAddressUpdate;
}

export async function deleteCustomerAddress(addressId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerAddressDeleteMutation,
    variables: {
      customerAccessToken: token,
      id: addressId
    }
  }) as { body: CustomerAddressDeleteResponse };

  return body.data.customerAddressDelete;
}

export async function setDefaultAddress(addressId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;

  if (!token) {
    throw new Error("No estás autenticado");
  }

  const { body } = await shopifyFetch({
    query: customerDefaultAddressUpdateMutation,
    variables: {
      customerAccessToken: token,
      addressId
    }
  }) as { body: CustomerDefaultAddressUpdateResponse };

  return body.data.customerDefaultAddressUpdate;
}
