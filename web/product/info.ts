export type Products = { [key: string]: ProductInfo }

export interface ProductInfoOption {
    option_names: string[] | null;
    option_values: string[] | null;
    // 每行商品的有多少个option， 这样便于区分option_names，option_values 在每行有多少个， 从而避免解析错误
    option_cnt: number[];
    prices: number[] | null;
}

export interface ProductInfo extends ProductInfoOption {
    handle: string;
    title: string;
    body_html: string;
    images: string[] | null;
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
        option_names: null,
        option_values: null,
        option_cnt: [],
    };
}


export function generateOptionsFromProductInfo(infoOption: ProductInfoOption): {options:any[],variants:any[] } {
    const options: any[] = [];
    const variants: any[] = [];
    let valueIndex: number = 0;
    if (infoOption.option_names) {
        for (let i = 0; i < infoOption.option_names.length; ++i) {
            // 构造 options 的格式
            /*
            // 类似[
            //   {
            //     "name": "Color",
            //     "values": [
            //       "Blue",
            //       "Black"
            //     ]
            //   },
            //   {
            //     "name": "Size",
            //     "values": [
            //       "155",
            //       "159"
            //     ]
            //   }
            // ];
            */
            const name: string = infoOption.option_names[i];
            const cnt = infoOption.option_cnt[i];
            const endValueIndex = cnt + valueIndex;
            const values: string[] = [];
            let variant:Variant = null;
            if (i == 0) {
                variant = {"price": infoOption.prices[i], option1:null, option2:null, option3:null};
                variants.push(variant);
            } else {
                variant = variants[i];
            }
            while (valueIndex < endValueIndex) {
                const val: string = infoOption.option_values[valueIndex];
                // @ts-ignore
                variant[`option${i + 1}`] = val;
                values.push(val);
                ++valueIndex;
            }

            options.push({name, values})
        }
    }
    return {options, variants};
}