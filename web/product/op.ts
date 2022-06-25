import {ProductInfo, Products, generateOptionsFromProductInfo} from "./info.js";
import {Session} from "@shopify/shopify-api/dist/auth/session";
import {Product} from "@shopify/shopify-api/dist/rest-resources/2022-04/index.js";

// 使用shopify 的 admin api去新增商品
export class OpImportProduct {
    private readonly session: Session;
    private readonly products: Products;
    private static VENDOR = "Leesen@Tech"

    constructor(sess: Session, prods: Products) {
        this.session = sess;
        this.products = prods;
    }

    // 返回新增加的商品数量
    public async saveProducts(): Promise<number> {
        let _productInfo = null;
        let cnt = 0;
        for (const k in this.products) {
            if (this.products.hasOwnProperty(k)) {
                _productInfo = this.products[k];
                try {
                    cnt += await this.newProductAndSave(_productInfo);
                } catch (e) {
                    console.error(e)
                }
            }
        }
        return cnt;
    }

    private async newProductAndSave(prodInfo: ProductInfo): Promise<number> {
        const shopifyProduct = new Product({session: this.session});
        shopifyProduct.title = prodInfo.title;
        shopifyProduct.body_html = prodInfo.body_html;
        shopifyProduct.vendor = OpImportProduct.VENDOR;
        const images = [];
        for (let img of prodInfo.images || []){
            images.push({src:img})
        }
        shopifyProduct.images = images;
        const opVar = generateOptionsFromProductInfo(prodInfo);
        console.log(opVar)
        shopifyProduct.options = opVar.options;
        shopifyProduct.variants = opVar.variants;
        await shopifyProduct.save();
        // await new Promise(() => setTimeout(() => {
        // }, 500));
        return 1;
    }
}