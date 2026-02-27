import { graphql, HttpResponse } from 'msw'; 

export const handlers = [ 
  graphql.query('getCollections', () => { 
    return HttpResponse.json({ data: { collections: { edges: [] } } }); 
  }) 
];