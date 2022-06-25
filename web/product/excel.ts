import {resolve} from "path"
import {Cell, Row} from 'exceljs';
import {ProductInfo, initProductInfo, Products} from "./info.js";
import exceljs from 'exceljs';
const {Workbook} = exceljs;
const __dirname = resolve()



function handleProductCell(prod: ProductInfo, prop: string, value: any) {
    // @ts-ignore
    let p: Array<[any]> = prod[prop];
    if (p) {
        p.push(value)
    } else {
        // @ts-ignore
        prod[prop] = [value]
    }
}

// 把商品信息的解析放在一个类里，封装起来。
// 通过调用public方法即可完成商品信息的解析
export class ParseProductInfo {
    // 待解析商品表单的索引号
    private static readonly PRODUCT_SHEET_INDEX: number = 0;
    private static readonly HANDLE: string = "Handle";
    private static readonly TITLE: string = "Title";
    private static readonly BODY_HTML: string = "Body (HTML)";
    private static readonly IMAGE_SRC: string = "Image Src";
    private static readonly VARIANT_PRICE: string = "Variant Price";
    private static readonly OPTION1_NAME: string = "Option1 Name";
    private static readonly OPTION1_VALUE: string = "Option1 Value";
    private static readonly OPTION2_NAME: string = "Option2 Name";
    private static readonly OPTION2_VALUE: string = "Option2 Value";
    private static readonly OPTION3_NAME: string = "Option3 Name";
    private static readonly OPTION3_VALUE: string = "Option3 Value";
    // 待解析的表头数据
    private static readonly HEADERS: string[] = [
        ParseProductInfo.HANDLE,
        ParseProductInfo.TITLE,
        ParseProductInfo.BODY_HTML,
        ParseProductInfo.IMAGE_SRC,
        ParseProductInfo.VARIANT_PRICE,
        ParseProductInfo.OPTION1_NAME,
        ParseProductInfo.OPTION1_VALUE,
        ParseProductInfo.OPTION2_NAME,
        ParseProductInfo.OPTION2_VALUE,
        ParseProductInfo.OPTION3_NAME,
        ParseProductInfo.OPTION3_VALUE,

    ];
    private fileName: string;
    // 存储解析的结果
    private products: Products;
    // 待解析商品表单的表头行所在索引， 可以避免前面几行不是表头行的情况
    private headerRowIndex: number;
    // 表头对应的列
    private headerCols: { [key: string]: string };
    // handle 所在的列的位置
    private headerHandleColIndex: string;

    constructor(fileName: string) {
        this.fileName = fileName;
        this.products = {};
        this.headerCols = {};
        this.headerRowIndex = -1;
    }


    // 解析excel表格里的商品信息
    public async parse(): Promise<Products> {
        if (this.fileName) {
            const workbook = new Workbook();
            const p = resolve(__dirname, this.fileName);
            const worksheets = await workbook.xlsx.readFile(p);
            if (worksheets.worksheets.length > 0) {
                const worksheet = worksheets.worksheets[ParseProductInfo.PRODUCT_SHEET_INDEX];
                // {includeEmpty: false} 不处理空行
                // 解析单独的商品信息
                worksheet.eachRow({includeEmpty: false}, ((row, rowNumber) => {
                    // 首先解析表头行
                    if (this.headerRowIndex == -1) {
                        this.parseHeaderRow(row, rowNumber);
                        // console.log(this.headerCols)
                    } else {
                        // 然后再解析数据行
                        this.parseDataRow(row, rowNumber);
                    }
                }))
            }
        }
        return this.products;
    }

    private static isValidHeader(txt:string): boolean {
        // 判断是否是表头
        return ParseProductInfo.HEADERS.indexOf(txt) != -1;
    }

    // 解析表头行
    private parseHeaderRow(row: Row, rowNumber: number) {
        let headerCnt: number = 0;
        row.eachCell({includeEmpty: false}, (cell: Cell, colNumber: number) => {
            const txt = cell.text?.trim();
            if (txt && ParseProductInfo.isValidHeader(txt)) {
                // 保存表头所在的列
                this.headerCols[cell.col] = txt;
                ++headerCnt;
                if (txt == ParseProductInfo.HANDLE) this.headerHandleColIndex = cell.col;
            }
        })
        // 如果某行里， 都有这些表头， 那就认为改行是表头行
        if (headerCnt == ParseProductInfo.HEADERS.length) this.headerRowIndex = rowNumber;
        else if (headerCnt > 0) {
            // 否则只解析到部分表头， 那就需要重新初始化已经解析过的表头数据。
            this.headerCols = {};
        }
    }

    // 解析数据行
    private parseDataRow(row: Row, rowNumber: number) {
        if (this.headerRowIndex != -1 && this.headerHandleColIndex) {
            const handle: Cell = row.getCell(this.headerHandleColIndex)
            if (!handle) return;
            const uniqueHandleTxt = handle.text?.trim();
            if (!uniqueHandleTxt) return;
            let prod: ProductInfo = this.products[uniqueHandleTxt];
            if (!prod) {
                prod = initProductInfo();
                prod.handle = uniqueHandleTxt;
                this.products[uniqueHandleTxt] = prod;
            }
            const preOptionCnt = prod.option_values?.length || 0
            // 处理其他的商品属性
            row.eachCell({includeEmpty: false}, (cell: Cell, colNumber: number) => {
                    const headerName = this.headerCols[cell.col]
                    const txt = cell.text?.trim();
                    if (txt) {
                        switch (headerName) {
                            case ParseProductInfo.TITLE:
                                prod.title = txt;
                                break;
                            case ParseProductInfo.BODY_HTML:
                                prod.body_html = txt
                                break;
                            case ParseProductInfo.IMAGE_SRC:
                                handleProductCell(prod, "images", txt);
                                break;
                            case ParseProductInfo.VARIANT_PRICE:
                                handleProductCell(prod, "prices", parseFloat(txt));
                                break;
                            case ParseProductInfo.OPTION1_NAME:
                            case ParseProductInfo.OPTION2_NAME:
                            case ParseProductInfo.OPTION3_NAME:
                                handleProductCell(prod, "option_names", txt);
                                break;
                            case ParseProductInfo.OPTION1_VALUE:
                            case ParseProductInfo.OPTION2_VALUE:
                            case ParseProductInfo.OPTION3_VALUE:
                                handleProductCell(prod, "option_values", txt);
                                break;
                            default:
                                break
                        }
                    }
                }
            );
            const curOpntionCnt = prod.option_values?.length || 0;
            // 只能取 option_values ， 因为 name 可能为空， name为空时， 取上一个
            const diff = curOpntionCnt - preOptionCnt;
            if (diff > 0)
                prod.option_cnt.push(diff)
        }

    }

}