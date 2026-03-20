import { shopifyFetch } from "./shopify";

// ==========================================
// CUSTOMER AUTHENTICATION OPERATIONS
// ==========================================

export const customerCreateMutation = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAccessTokenCreateMutation = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const getCustomerQuery = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice {
              amount
              currencyCode
            }
            subtotalPrice {
              amount
              currencyCode
            }
            totalShippingPrice {
              amount
              currencyCode
            }
            shippingAddress {
              address1
              address2
              city
              province
              country
              zip
            }
            lineItems(first: 50) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
            successfulFulfillments {
              trackingInfo {
                number
                url
              }
            }
          }
        }
      }
      addresses(first: 10) {
        edges {
          node {
            id
            address1
            address2
            city
            company
            country
            firstName
            lastName
            phone
            province
            zip
          }
        }
      }
      defaultAddress {
        id
        address1
        address2
        city
        province
        country
        zip
      }
    }
  }
`;

// ==========================================
// CUSTOMER TYPES
// ==========================================

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price?: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText?: string;
    } | null;
  } | null;
}

export interface FulfillmentTrackingInfo {
  number?: string;
  url?: string;
}

export interface Fulfillment {
  trackingInfo: FulfillmentTrackingInfo[];
}

export interface Order {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  subtotalPrice?: {
    amount: string;
    currencyCode: string;
  };
  totalShippingPrice?: {
    amount: string;
    currencyCode: string;
  };
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
  };
  lineItems: {
    edges: {
      node: OrderLineItem;
    }[];
  };
  successfulFulfillments: Fulfillment[];
}

export interface CustomerUserError {
  code: string;
  field: string[];
  message: string;
}

export interface CustomerUpdateInput {
  acceptsMarketing?: boolean;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
}

export interface MailingAddressInput {
  address1?: string;
  address2?: string;
  city?: string;
  company?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  province?: string;
  zip?: string;
}

export interface CustomerAddress {
  id: string;
  address1: string;
  address2: string;
  city: string;
  company: string;
  country: string;
  firstName: string;
  lastName: string;
  phone: string;
  province: string;
  zip: string;
}

export interface CustomerUpdateResponse {
  data: {
    customerUpdate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        email: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

export interface CustomerAddressCreateResponse {
  data: {
    customerAddressCreate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

export interface CustomerAddressUpdateResponse {
  data: {
    customerAddressUpdate: {
      customerAddress: CustomerAddress | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

export interface CustomerAddressDeleteResponse {
  data: {
    customerAddressDelete: {
      deletedCustomerAddressId: string | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

// ==========================================
// CUSTOMER UPDATE & ADDRESS MUTATIONS
// ==========================================

export const customerUpdateMutation = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        phone
        email
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAddressCreateMutation = `
  mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
    customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        company
        country
        firstName
        lastName
        phone
        province
        zip
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAddressUpdateMutation = `
  mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
    customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
      customerAddress {
        id
        address1
        address2
        city
        company
        country
        firstName
        lastName
        phone
        province
        zip
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerAddressDeleteMutation = `
  mutation customerAddressDelete($customerAccessToken: String!, $id: ID!) {
    customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
      deletedCustomerAddressId
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const customerRecoverMutation = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export interface CustomerResetInput {
  resetToken: string;
  password?: string;
}

export interface CustomerResetResponse {
  data: {
    customerReset: {
      customer: {
        id: string;
        email: string;
      } | null;
      customerAccessToken: {
        accessToken: string;
        expiresAt: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

export const customerResetMutation = `
  mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        id
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// ==========================================
// DEFAULT ADDRESS UPDATE MUTATION
// ==========================================

export interface CustomerDefaultAddressUpdateResponse {
  data: {
    customerDefaultAddressUpdate: {
      customer: {
        id: string;
      } | null;
      customerUserErrors: CustomerUserError[];
    };
  };
}

export const customerDefaultAddressUpdateMutation = `
  mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

// ==========================================
// PRODUCT QUERIES (for favorites/wishlist)
// ==========================================

export const getProductsByIdsQuery = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;
