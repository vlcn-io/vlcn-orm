// Proof of concept:
// https://www.typescriptlang.org/play?#code/C4TwDgpgBACg9gGwJYGMRQLxQEQBUDucAYgIYrZQA+OAwnAHbBnACSAtmHAE7DYDcAKAGhIUAIIIEcfBAAmAHlwAaKLjBQIAD2AR6sgM6xEqEAD5MqqADIoAbwFRHUTsjQAuOw6feA2gGkoJHpVMABdD2AuAFcIQW8AXwFE4XBoeFckOUVzLFxrT28XEw97b18AoKNXEFCAfgjo2K9HROSRNIALBmgsUqckWQ96KLYAIwguOKdhtg99SKCAc0F4wQEAMyj6FGAkBkCObmA6RmZ9AAoo-QmPCSkZBRgu+ggVbBOmHfZOHmxTAEoCk4UAx9IgIAA6KSLc4AciQhx4UBBpx2+ghGNh-xWQk2212+2AhFIKEu1y4t0k0iyT26bwIxDIf0BfUcKLBCEh0LhACZ1iQsTiNlsdntglISLJaS9zgMhiNxlx-h50qhMo9nhBzKyoFwIMAolxgrYBioZh5sAB2ACsNoAbDaAMwABgAnNgVEV3HZ4qskriRQTgigOhAUABrO7UhTKVS4DpLDTaXQGKpqrK4UwqXCqtBJnR6Qy5sznZpQYAJ+iLDy4eNLJRlr0gGvFhvK8RUh6KOtV7PF8zULayCDrIJyIGOJDrKDnCtLCFNnxN0KYDBYSIxFll7x6g1G8uVxZQEiGKNd2uHvvGNCmKYtIQ7-WG+hC9nAZyaiwSqWa84ARh5R1sSEAB6ECoEILhZAEBEfmOBhPmAC4wE1YDhGJMhzhQ7o0LfZFQwjccsBDMNI07OQsM1FRYQ+ZhviOQUYOnc4SMI2Qt28WCjlotEWII8M5GA5IwNUOAoE5Eh9zYbhoBIUY4Cid8K2gBASCrKISEWV5kVccNj3kgA3aBKmwABRTQSA4Tl9AobgcAAdQ6EhgFhQwADkIHwbAIQEESAHllK4fAkGuFQtPfeZJJ0WQoFGdA9WkgzE2U65kTgNg2F0JDjz0A9oEghAYpCqAQAUrhnFUkBFi4BS9B8xwgA

/*
type Policy = "TwoFac" | "ContactImport";

type Allowed<T, Tp extends Policy> = T & {
    policy: {
        [K in Tp]: true;
    }
}

type Policied<T> = T & {
    policy: {
        [K in Policy]?: true;
    }
}

type Phone = {
    id: number;
    num: string;
};

function importContacts(user: Allowed<Phone, "ContactImport">) {
    console.log('import contacts...');
}

function twoFac(user: Allowed<Phone, "TwoFac">) {
    console.log('2fa');
}

function loadPhone(id: number): Policied<Phone> {
    return {id, num: "7575675309", policy: {}};
}

function checkAllowed<T, TThing extends Policied<T>, TPolicy extends Policy>(
    thing: TThing,
    policy: TPolicy,
): Allowed<TThing, TPolicy> | undefined {
    if (thing.policy[policy] === true) {
        return thing as Allowed<TThing, TPolicy>;
    }

    return;
}

const phone = loadPhone(123);

// word
importContacts(phone);

twoFac(phone);

const checked = checkAllowed(phone, 'ContactImport');
if (checked) {
    importContacts(checked);
}
*/
