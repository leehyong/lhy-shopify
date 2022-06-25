import {expect} from "chai";

import {generateOptionsFromProductInfo} from "../info.js";
import {describe} from "vitest";


describe("product", function () {
    describe("generateOptionsFromProductInfo", function () {
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
            "option_names": [
                "Color"
            ],
            "option_values": [
                "Gold",
                "Silver"
            ],
            "option_cnt": [
                1,
                1
            ]
        };
        const ret = generateOptionsFromProductInfo(product);
        console.log(ret)
        expect(ret.options).to.equal([{
            "name": "Color",
            "values": [
                "Gold",
                "Silver"
            ]
        }]);
        expect(ret.variants).to.equal([{
            "option1": "Gold",
            "price": 69.99
        }, {
            "option1": "Silver",
            "price": 55
        }]);

    })
})