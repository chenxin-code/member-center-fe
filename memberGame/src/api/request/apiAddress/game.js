import axios from "axios";
import { fetchMethod } from "../http.js";
import { urlGameCenter } from "./urlAddress";

const game = {
  // 获取活动详情
  getActivityInfo: urlGameCenter + "client/api/v1/game/getActivityInfo", //取消售后单
  //中奖滚动播报
  getDrawLotterBroadcastList:
    urlGameCenter + "client/api/v1/game/getDrawLotterBroadcastList", //取消售后单
  //会员中奖结果列表
  getMemberDrawLotterList:
    urlGameCenter + "client/api/v1/game/getMemberDrawLotterList", //取消售后单
  //获取会员玩游戏剩余的次数
  getMemberPlayActivityNum:
    urlGameCenter + "client/api/v1/game/getMemberPlayActivityNum", //取消售后单
  memberPlayActivityGame:
    urlGameCenter + "client/api/v1/game/memberPlayActivityGame" //会员参加游戏
};

export default {
  //活动详情
  getActivityInfo(params) {
    return fetchMethod("POST", `${game.getActivityInfo}`, params);
  },
  //活动详情
  getDrawLotterBroadcastList(params) {
    return fetchMethod("POST", `${game.getDrawLotterBroadcastList}`, params);
  },
  //中奖记录
  getMemberDrawLotterList(params) {
    return fetchMethod("POST", `${game.getMemberDrawLotterList}`, params);
  },
  //获取会员玩游戏剩余的次数
  getMemberPlayActivityNum(params) {
    return fetchMethod("POST", `${game.getMemberPlayActivityNum}`, params);
  },
  //会员参加游戏
  memberPlayActivityGame(params) {
    return fetchMethod("POST", `${game.memberPlayActivityGame}`, params);
  }
};
