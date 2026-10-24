export const hasRent = (v?: string | null): v is string => !!v && !/not provided/i.test(v);
