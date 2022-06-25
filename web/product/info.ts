export type Products = { [key: string]: ProductInfo }

export interface ProductInfoOption {
    option1: Option;
    option2: Option;
    option3: Option;
    prices: number[] | null;
}

export interface Option {
    name: string,
    values: string[]|null
}

export interface ProductInfo {
    handle: string;
    title: string;
    body_html: string;
    images: string[] | null;
    prices: number[] | null;
    option1: Option;
    option2: Option;
    option3: Option;
}


interface Variant {
    option1: string | null,
    option2: string | null,
    option3: string | null,
    price: number,

}

export function initProductInfo(): ProductInfo {
    return {
        title: "",
        handle: "",
        body_html: "",
        images: null,
        prices: null,
        option1: {name: null, values: []},
        option2: {name: null, values: []},
        option3: {name: null, values: []},
    };
}


export function generateOptionsFromProductInfo(infoOption: ProductInfoOption): { options: any[], variants: any[] } {
    const options: any[] = [];
    const variants: any[] = [];
    if (infoOption.option1.name) {
        options.push(infoOption.option1)
    }
    if (infoOption.option2.name) {
        options.push(infoOption.option2)
    }
    if (infoOption.option3.name) {
        options.push(infoOption.option3)
    }
    for (let i = 0; i < infoOption.prices.length; ++i) {
        const variant: any = {};
        const values1: string = infoOption.option1.values[i];
        const values2: string = infoOption.option2.values[i];
        const values3: string = infoOption.option3.values[i];
        variant["price"] = infoOption.prices[i];
        if (values1) {
            variant['option1'] = values1;
        }
        if (values2) {
            variant['option2'] = values2;
        }
        if (values3) {
            variant['option3'] = values3;
        }
        variants.push(variant);
    }
    return {options, variants};
}