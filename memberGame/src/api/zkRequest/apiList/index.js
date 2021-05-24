import axios from "axios";
import { fetchMethod } from "../http.js";
import qs from "qs";
const classification = {
  productList: "/api/product/list", // 取消售后单
  getCategoryList: "/api/product/getCategory", // 获取商品分类接口
  getProductDetail: "/api/product", // 获取商品详情
  addSaleAddress: "/api/user/addAddress", // 新增收货人地址信息
  updateSaleAddress: "/api/user/updateAddress", // 修改收货人地址
  getAddressList: "/api/user/getAddressList", // 根据条件查询收货地址
};

export default {
  //商品列表
  productList(params) {
    return fetchMethod(
      "POST",
      classification.productList,
      qs.stringify(params)
    );
  },
  //商品详情
  productDetail(params) {
    return fetchMethod(
      "POST",
      classification.getCategoryDetail,
      qs.stringify(params)
    );
  },
  //分类列表
  getCategoryList(params) {
    return fetchMethod(
      "POST",
      classification.getCategoryList,
      qs.stringify(params)
    );
  },

  //商品详情
  getProductDetail(params) {
    return fetchMethod(
      "POST",
      classification.getProductDetail,
      qs.stringify(params)
    );
  },

  //新增收货联系人地址信息
  addSaleAddress(params) {
    return fetchMethod(
      "POST",
      classification.addSaleAddress,
      qs.stringify(params)
    )
  },

  //修改收货人联系地址
  updateSaleAddress(params) {
    return fetchMethod(
      "POST",
      classification.updateSaleAddress,
      qs.stringify(params)
    )
  },

  //根据条件查询收货地址
  getAddressList(params) {
    return fetchMethod(
      "POST",
      classification.getAddressList,
      qs.stringify(params)
    );
  },
  //删除收货地址
  deleteAddress(params) {
    return fetchMethod(
      "POST",
      classification.deleteAddress,
      qs.stringify(params)
    );
  },
};
