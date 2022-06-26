import {ParseProductInfo} from "../excel";
import {generateOptionsFromProductInfo} from "../info";
import {describe, expect, test} from "vitest";


describe("product", function () {

    test("parse excel ", async function () {
        // excel的解析测试
        const filePath = "asserts/jewelery.xlsx";
        const pi = new ParseProductInfo(filePath)
        const all = await pi.parse();
        // 总共有20个商品
        expect(Object.keys(all).length).to.equal(20);
        expect(all).haveOwnProperty("gemstone");
        const prod = all['gemstone'];
        expect(prod.title).to.equal("Gemstone Necklace");
        expect(prod.option1.name).to.equal("Colour");
        expect(prod.option1.values.length).to.equal(2);
        expect(prod.option1.values[0]).to.equal("Blue");
        expect(prod.option1.values[1]).to.equal("Purple");
        expect(prod.prices.length).to.equal(2);
        expect(prod.prices[0]).to.equal(27.99);
        expect(prod.prices[1]).to.equal(27.99);
    });

    test("generateOptionsFromProductInfo", function () {
        // 测试，从excel解析的数据，能否正确的转换为shopify里的option和variants
        const product = {
            "title": "Anchor Bracelet Mens",
            "handle": "leather-anchor",
            "body_html": "Black leather bracelet with gold or silver anchor for men.",
            "images": [
                "https://burst.shopifycdn.com/photos/anchor-bracelet-mens_925x.jpg",
                "https://burst.shopifycdn.com/photos/anchor-bracelet-for-men_925x.jpg",
                "https://burst.shopifycdn.com/photos/leather-anchor-bracelet-for-men_925x.jpg"
            ],
            "prices": [
                69.99,
                55
            ],
            option1: {name: 'Colour', values: ["black", "red"]},
            option2: {name: "Size", values: ["22", "33"]},
            option3: {name: "Material", values: ["ffa", "fasd"]},
        };
        const ret = generateOptionsFromProductInfo(product);
        expect(ret.options[0].name).to.equal("Colour");
        expect(ret.options[0].values[0]).to.equal("black");
        expect(ret.options[0].values[1]).to.equal("red");
        expect(ret.options[1].name).to.equal("Size");
        expect(ret.options[1].values[0]).to.equal("22");
        expect(ret.options[1].values[1]).to.equal("33");
        expect(ret.options[2].name).to.equal("Material");
        expect(ret.options[2].values[0]).to.equal("ffa");
        expect(ret.options[2].values[1]).to.equal("fasd");
        let variant = ret.variants[0];
        expect(variant.option1).to.equal("black");
        expect(variant.option2).to.equal("22");
        expect(variant.option3).to.equal("ffa");
        expect(variant.price).to.equal(69.99);
        variant = ret.variants[1];
        expect(variant.option1).to.equal("red");
        expect(variant.option2).to.equal("33");
        expect(variant.option3).to.equal("fasd");
        expect(variant.price).to.equal(55);
    })
})