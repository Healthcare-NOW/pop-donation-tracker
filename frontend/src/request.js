import { camelizeKeys } from 'humps';

export const getRequest = (url) => fetch(url)
    .then(response => response.json())
    .then(data => camelizeKeys(data));

