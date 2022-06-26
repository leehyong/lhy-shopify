export type Products = { [key: string]: ProductInfo }

// 单个商品的 Option
export interface Option {
    // 名字， 名字只有一个
    name: string,
    // 同一个名字对应的 value有多个， 如color: reb,black,blue
    values: string[]|null
}

// 商品的Option及价格信息
export interface ProductInfoOption {
    option1: Option;
    option2: Option;
    option3: Option;
    // 价格，可以有许多个，与最大的Option的属性values的长度等长
    prices: number[] | null;
}
// 商品信息
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

export function initProductInfo(): ProductInfo {
    // 初始化产品的默认信息
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
    //把excel解析的数据，转换为shopify里的option和variants
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