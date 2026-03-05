export const getProductsQuery = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const getProductByHandleQuery = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      descriptionHtml
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      options {
        id
        name
        values
      }
      material: metafield(namespace: "custom", key: "material") {
        value
        type
      }
      instruccionesLavado: metafield(namespace: "custom", key: "instrucciones_de_cuidado") {
        value
        type
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const getProductRecommendationsQuery = `
  query productRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        url
        altText
        width
        height
      }
    }
  }
`;

export const getCollectionsQuery = `
  query getCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const getCollectionWithProductsQuery = `
  query getCollectionWithProducts(
    $handle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $cursor: String
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
      }
      products(
        first: $first
        filters: $filters
        sortKey: $sortKey
        reverse: $reverse
        after: $cursor
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            title
            handle
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
          }
        }
      }
    }
  }
`;

// ==========================================
// CART OPERATIONS
// ==========================================

const cartFragment = `
  fragment cartDetails on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
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
              product {
                title
                handle
                productType
              }
            }
          }
        }
      }
    }
  }
`;

export const getCartQuery = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...cartDetails
    }
  }
  ${cartFragment}
`;

export const createCartMutation = `
  mutation createCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...cartDetails
      }
    }
  }
  ${cartFragment}
`;

export const addToCartMutation = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cartDetails
      }
    }
  }
  ${cartFragment}
`;

export const updateCartMutation = `
  mutation updateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cartDetails
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cartDetails
      }
    }
  }
  ${cartFragment}
`;

// ==========================================
// SEARCH OPERATIONS
// ==========================================

export const predictiveSearchQuery = `
  query predictiveSearch($query: String!, $limit: Int!) {
    predictiveSearch(query: $query, limit: $limit) {
      products {
        id
        title
        handle
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export const updateCartBuyerIdentityMutation = `
  mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...cartDetails
        buyerIdentity {
          email
          phone
          customer {
            id
            firstName
            lastName
            email
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
  ${cartFragment}
`;
