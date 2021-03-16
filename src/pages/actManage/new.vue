<template>
  <div id="coupons-detail">
    <div class="content-header">
      新建活动
      <span class="fallback" @click="FALLBACK" style="cursor: pointer">返回</span>
    </div>
    <div class="coupons-main">
      <a-row style="height: 100%">
        <div class="coupons-common">
          <a-row class="common-row">
            <a-col :span="24">
              <a-form
                class="common-form"
                :form="conponForm"
                :label-col="{ span: 3 }"
                :wrapper-col="{ span: 12 }"
                style="height: 100%; overflow: auto"
                autoComplete="off"
              >
                <!-- ********************************************************************* -->

                <!-- ############ 活动基础信息 ############ -->
                <div class="common-title">
                  <div class="common-title-content">活动基础信息</div>
                </div>
                <!-- 卡券平台 -->
                <a-form-item label="活动主题名称">
                  <a-select
                    v-decorator="[
                      'source',
                      {
                        initialValue: source,
                        rules: [{ required: true, message: '活动主题名称不能为空' }]
                      }
                    ]"
                    @change="sourceSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in sources" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>source:{{ source }}</div> -->
                </a-form-item>
                <!-- 卡券标题 -->
                <a-form-item label="活动名称">
                  <a-input
                    @change="couponTitleChange"
                    v-decorator="[
                      'couponTitle',
                      {
                        initialValue: couponTitle,
                        rules: [
                          { required: true, message: '卡券标题不能为空' },
                          { whitespace: true, message: '卡券标题不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入"
                    allow-clear
                  />
                  <!-- <div>couponTitle: {{ couponTitle }}</div> -->
                </a-form-item>
                <!-- 活动有效期 -->
                <a-form-item label="活动有效期">
                  <a-range-picker
                    v-decorator="[
                      'rangePickerValue',
                      {
                        initialValue: rangePickerValue,
                        rules: [{ type: 'array', required: true, message: '活动有效期不能为空,请选择日期!' }]
                      }
                    ]"
                    :placeholder="['开始时间', '结束时间']"
                    format="YYYY-MM-DD HH:mm:ss"
                    @change="handleRangePicker"
                    :show-time="{
                      defaultValue: [moment(moment().format('HH:mm:ss')), moment('23:59:59', 'HH:mm:ss')]
                    }"
                    :disabled-date="disabledDate"
                  />
                  <!-- <div>validityStartTime:{{ validityStartTime }}</div> -->
                  <!-- <div>validityEndTime:{{ validityEndTime }}</div> -->
                </a-form-item>
                <!-- 活动描述 -->
                <a-form-item label="活动描述">
                  <a-textarea
                    @change="memoChange"
                    v-decorator="[
                      'memo',
                      {
                        initialValue: memo,
                        rules: []
                      }
                    ]"
                    :auto-size="{ minRows: 3, maxRows: 5 }"
                    :maxLength="200"
                    placeholder="请输入使用说明"
                  />
                  <!-- <div>memo:{{ memo }}</div> -->
                </a-form-item>
                <!-- 请上传活动封面 -->
                <a-form-item label="请上传活动封面">
                  <a-spin :spinning="picUploading">
                    <a-upload
                      name="avatar"
                      accept="image/jpeg,image/jpg,image/png"
                      list-type="picture-card"
                      :file-list="fileList"
                      v-decorator="[
                        'couponImage',
                        { initialValue: couponImage, rules: [{ required: true, message: '图片不能为空' }] }
                      ]"
                      :before-upload="() => false"
                      :remove="deleteOssImage"
                      @preview="handlePreview"
                      @change="addPic"
                    >
                      <template v-if="fileList.length < 1">
                        <a-icon type="plus" />
                        <div class="ant-upload-text">
                          上传图片
                        </div>
                      </template>
                    </a-upload>
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
                      <img class="img" alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </a-spin>
                  <span style="margin-top:-20px;color:#999999;font-size:12px;">
                    建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
                  </span>
                </a-form-item>
                <!-- 活动类型 -->
                <a-form-item label="活动类型">
                  <a-select
                    v-decorator="[
                      'couponBusinessType',
                      {
                        initialValue: couponBusinessType,
                        rules: [{ required: true, message: '活动类型不能为空' }]
                      }
                    ]"
                    @change="couponBusinessTypeSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in couponBusinessTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>couponBusinessType:{{ couponBusinessType }}</div> -->
                </a-form-item>

                <!-- ********************************************************************* -->

                <!-- ############ 用户参数 ############ -->
                <div class="common-title">
                  <div class="common-title-content">用户参数</div>
                </div>
                <!-- 会员权益类型 -->
                <a-form-item label="会员权益类型">
                  <a-select
                    v-decorator="[
                      'couponType',
                      {
                        initialValue: couponType,
                        rules: [{ required: true, message: '会员权益类型不能为空' }]
                      }
                    ]"
                    @change="couponTypeSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in couponTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>couponType: {{ couponType }}</div> -->
                </a-form-item>
                <!-- 会员来源+上传指定会员 -->
                <a-radio-group v-model="radioValue" style="padding-left: 50px;">
                  <a-radio :style="radioStyle" :value="1">
                    <span style="padding-right:40px;">会员来源</span>
                    <!-- 会员来源 -->
                    <a-form-item style="display:inline-block;">
                      <a-checkbox-group
                        v-if="radioValue === 1"
                        v-decorator="['checkboxValue', { initialValue: checkboxValue }]"
                        :options="plainOptions"
                        @change="checkboxChange"
                      />
                    </a-form-item>
                  </a-radio>
                  <div v-if="radioValue === 1" :style="radioStyle" style="margin:10px 0;">
                    <span style="padding: 0 40px 0 24px;">会员等级</span>
                    <a-form-item style="display:inline-block;">
                      <a-select
                        style="width:200px;"
                        v-decorator="[
                          'couponBusinessType',
                          {
                            initialValue: couponBusinessType,
                            rules: [{ required: true, message: '卡券业务类型不能为空' }]
                          }
                        ]"
                        @change="couponBusinessTypeSelect"
                      >
                        <a-select-option :value="item.code" v-for="(item, index) in couponBusinessTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <span style="padding: 0 20px;color:#ccc;">------</span>
                    <a-form-item style="display:inline-block;">
                      <a-select
                        style="width:200px;"
                        v-decorator="[
                          'couponType',
                          {
                            initialValue: couponType,
                            rules: [{ required: true, message: '会员权益类型不能为空' }]
                          }
                        ]"
                        @change="couponTypeSelect"
                      >
                        <a-select-option :value="item.code" v-for="(item, index) in couponTypes" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  <a-radio :style="radioStyle" :value="2">
                    <span style="padding-right:40px;">上传指定会员</span>
                    <a-form-item style="display:inline-block;width:100%;">
                      <a-upload
                        v-if="radioValue === 2"
                        v-decorator="['file', { rules: [{ required: true, message: '请选择文件上传!' }] }]"
                        :file-list="fileList1"
                        :remove="handleRemove1"
                        name="file"
                        accept=".xls,.xlsx"
                        :before-upload="uploadBefor"
                      >
                        <a-button>
                          <a-icon type="upload" />
                          上传文件
                        </a-button>
                      </a-upload>
                    </a-form-item>
                  </a-radio>
                  <div
                    v-if="radioValue === 2"
                    style="padding-left: 148px;"
                    :style="{ paddingTop: fileList1.length > 0 ? '40px' : '' }"
                  >
                    <p style="font-size: 12px;color: #c1c1c1;">
                      支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次
                    </p>
                    <p>
                      <a v-show="!downLoadTplExist" @click.prevent="handleNullTpl">暂无模板文件</a>
                      <a v-show="downLoadTplExist" :href="downLoadTplUrl">下载模板文件</a>
                    </p>
                  </div>
                  <div>radioValue: {{ radioValue }}</div>
                  <div>checkboxValue: {{ checkboxValue }}</div>
                </a-radio-group>
                <!-- ********************************************************************* -->

                <!-- ############ 时间参数 ############ -->
                <div class="common-title">
                  <div class="common-title-content">时间参数</div>
                </div>
                <a-form-item label="是否为周期性活动">
                  <a-radio-group
                    style="padding-left:26px;"
                    @change="classificationChange"
                    v-decorator="[
                      'classification',
                      {
                        initialValue: classification,
                        rules: [{ required: true, message: '是否为周期性活动不能为空' }]
                      }
                    ]"
                  >
                    <a-radio :value="1">
                      不是
                    </a-radio>
                    <a-radio :value="2">
                      是
                    </a-radio>
                  </a-radio-group>
                  <div>classification:{{ classification }}</div>
                </a-form-item>

                <div v-if="classification === 2">
                  <!-- 每月活动日+每周活动日 -->
                  <a-radio-group v-model="radioValue1" style="padding-left: 50px;">
                    <a-radio :style="radioStyle" :value="1">
                      <span style="padding-right:40px;">每月活动日</span>
                      <template v-if="radioValue1 === 1">
                        <a-form-item style="display:inline-block;">
                          <a-select
                            style="width:100px;"
                            v-decorator="[
                              'couponBusinessType',
                              {
                                initialValue: couponBusinessType,
                                rules: [{ required: true, message: '卡券业务类型不能为空' }]
                              }
                            ]"
                            @change="couponBusinessTypeSelect"
                          >
                            <a-select-option
                              :value="item.code"
                              v-for="(item, index) in couponBusinessTypes"
                              :key="index"
                            >
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-button style="margin-left:20px;" @click="actModalVisible = true" block>1,2,5,10</a-button>
                      </template>
                    </a-radio>
                    <a-radio :style="radioStyle" :value="2">
                      <span style="padding-right:40px;">每周活动日</span>
                      <template v-if="radioValue1 === 2">
                        <a-form-item style="display:inline-block;">
                          <a-select
                            style="width:100px;"
                            v-decorator="[
                              'couponBusinessType',
                              {
                                initialValue: couponBusinessType,
                                rules: [{ required: true, message: '卡券业务类型不能为空' }]
                              }
                            ]"
                            @change="couponBusinessTypeSelect"
                          >
                            <a-select-option
                              :value="item.code"
                              v-for="(item, index) in couponBusinessTypes"
                              :key="index"
                            >
                              {{ item.name }}
                            </a-select-option>
                          </a-select>
                        </a-form-item>
                        <a-button style="margin-left:20px;" @click="actModalVisible = true" block>
                          周一,周二,周三,周五
                        </a-button>
                      </template>
                    </a-radio>
                    <div>radioValue1: {{ radioValue1 }}</div>
                  </a-radio-group>
                  <!-- 对话框 -->
                  <a-modal
                    v-if="radioValue1 === 1"
                    v-model="actModalVisible"
                    title="每月活动日"
                    @ok="actModalVisible = false"
                    :centered="true"
                    :maskClosable="false"
                  >
                    <a-form-item>
                      <a-checkbox-group
                        v-if="radioValue1 === 1"
                        v-decorator="['checkboxValue', { initialValue: checkboxValue }]"
                        :options="plainOptions"
                        @change="checkboxChange"
                      />
                    </a-form-item>
                    <div>checkboxValue: {{ checkboxValue }}</div>
                  </a-modal>
                  <a-modal
                    v-if="radioValue1 === 2"
                    v-model="actModalVisible"
                    title="每周活动日"
                    @ok="actModalVisible = false"
                    :centered="true"
                    :maskClosable="false"
                  >
                    <a-form-item>
                      <a-checkbox-group
                        v-if="radioValue1 === 2"
                        v-decorator="['checkboxValue', { initialValue: checkboxValue }]"
                        :options="plainOptions"
                        @change="checkboxChange"
                      />
                    </a-form-item>
                    <div>checkboxValue: {{ checkboxValue }}</div>
                  </a-modal>
                </div>

                <!-- ********************************************************************* -->

                <!-- ############ 奖品参数 ############ -->
                <!-- 标题 -->
                <div class="common-title">
                  <div class="common-title-content">奖品参数</div>
                </div>
                <!-- 奖品集合 -->
                <div
                  class="common-award"
                  :class="`award-class${index}`"
                  v-for="(item, index) in awardList"
                  :key="index"
                  @click="awardFormindex = index"
                >
                  <a-form-item label="选择卡券：">
                    <div
                      :class="`common-award-couponSelect ${showRedBorder && 'border-red'}`"
                      @click="handleSelectCoupon"
                    >
                      {{ couponName }}
                    </div>
                    <p v-show="showRedBorder" class="common-award-couponSelectTip">请选择卡券！</p>
                  </a-form-item>
                  <a-form-item label="卡券有效期：">
                    <a-input :placeholder="couponValid" disabled />
                  </a-form-item>
                  <a-form-item label="领取条件设置">
                    <a-select
                      v-decorator="[
                        `couponBusinessType${index}`,
                        {
                          initialValue: item.couponBusinessType,
                          rules: [{ required: true, message: '活动类型不能为空' }]
                        }
                      ]"
                      @change="couponBusinessTypeSelect1"
                    >
                      <a-select-option
                        :value="itemSelect.code"
                        v-for="(itemSelect, indexSelect) in couponBusinessTypes"
                        :key="indexSelect"
                      >
                        {{ itemSelect.name }}
                      </a-select-option>
                    </a-select>
                    <!-- <div>item.couponBusinessType:{{ item.couponBusinessType }}</div> -->
                  </a-form-item>
                  <a-form-item label="发放数量">
                    <a-input
                      @change="couponTitleChange1"
                      v-decorator="[
                        `couponTitle${index}`,
                        {
                          initialValue: item.couponTitle,
                          rules: [
                            { required: true, message: '卡券标题不能为空' },
                            { whitespace: true, message: '卡券标题不能为空' },
                            { max: 20, message: '最多输入20个字符' }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="邦豆兑换值">
                    <a-input
                      @change="couponTitleChange1"
                      v-decorator="[
                        `couponTitle${index}`,
                        {
                          initialValue: item.couponTitle,
                          rules: [
                            { required: true, message: '卡券标题不能为空' },
                            { whitespace: true, message: '卡券标题不能为空' },
                            { max: 20, message: '最多输入20个字符' }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人兑换数量限制">
                    <a-input
                      @change="couponTitleChange1"
                      v-decorator="[
                        `couponTitle${index}`,
                        {
                          initialValue: item.couponTitle,
                          rules: [
                            { required: true, message: '卡券标题不能为空' },
                            { whitespace: true, message: '卡券标题不能为空' },
                            { max: 20, message: '最多输入20个字符' }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每日兑换数量限制">
                    <a-input
                      @change="couponTitleChange1"
                      v-decorator="[
                        `couponTitle${index}`,
                        {
                          initialValue: item.couponTitle,
                          rules: [
                            { required: true, message: '卡券标题不能为空' },
                            { whitespace: true, message: '卡券标题不能为空' },
                            { max: 20, message: '最多输入20个字符' }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人每日兑换数量限制">
                    <a-input
                      @change="couponTitleChange1"
                      v-decorator="[
                        `couponTitle${index}`,
                        {
                          initialValue: item.couponTitle,
                          rules: [
                            { required: true, message: '卡券标题不能为空' },
                            { whitespace: true, message: '卡券标题不能为空' },
                            { max: 20, message: '最多输入20个字符' }
                          ]
                        }
                      ]"
                      placeholder="请输入"
                      allow-clear
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <template v-if="classification === 2">
                    <a-form-item label="可领取时间">
                      <a-select
                        v-decorator="[
                          `couponBusinessType${index}`,
                          {
                            initialValue: item.couponBusinessType,
                            rules: [{ required: true, message: '活动类型不能为空' }]
                          }
                        ]"
                        @change="couponBusinessTypeSelect1"
                      >
                        <a-select-option
                          :value="itemSelect.code"
                          v-for="(itemSelect, indexSelect) in couponBusinessTypes"
                          :key="indexSelect"
                        >
                          {{ itemSelect.name }}
                        </a-select-option>
                      </a-select>
                      <!-- <div>item.couponBusinessType:{{ item.couponBusinessType }}</div> -->
                    </a-form-item>
                    <a-form-item label="可领取时间">
                      <a-select
                        v-decorator="[
                          `couponBusinessType${index}`,
                          {
                            initialValue: item.couponBusinessType,
                            rules: [{ required: true, message: '活动类型不能为空' }]
                          }
                        ]"
                        @change="couponBusinessTypeSelect1"
                      >
                        <a-select-option
                          :value="itemSelect.code"
                          v-for="(itemSelect, indexSelect) in couponBusinessTypes"
                          :key="indexSelect"
                        >
                          {{ itemSelect.name }}
                        </a-select-option>
                      </a-select>
                      <!-- <div>item.couponBusinessType:{{ item.couponBusinessType }}</div> -->
                    </a-form-item>
                  </template>
                  <button class="common-award-btn" v-show="awardList.length > 1" @click="handleDelete(index)">
                    删除
                  </button>
                </div>
                <div style="display:flex;justify-content:center;">
                  <a-button style="width:30%;" type="primary" @click="addAward">添加奖品</a-button>
                </div>

                <!-- ********************************************************************* -->
              </a-form>
              <!-- 提交和取消 -->
              <div class="common-submit-cancle">
                <div class="common-btn common-submit">
                  <a-button
                    style="margin-right: 20px;"
                    :loading="saveLoading"
                    type="primary"
                    @click="handleSubmit(3, 'saveLoading')"
                  >
                    保存
                  </a-button>
                  <!-- <a-button :loading="submitLoading" type="primary" @click="handleSubmit(1, 'submitLoading')">
                    提交
                  </a-button> -->
                </div>
                <div class="common-btn common-cancle">
                  <a-button type="primary" @click="handleCancle">取消</a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-row>
    </div>
    <a-modal
      title="卡券选择"
      :visible="modalVisible"
      @ok="handleOk"
      @cancel="handleModalCancel"
      width="1300px"
      :maskClosable="false"
      :centered="true"
    >
      <FilterForm ref="form" rowCol="3" :formList="this.formList" :onSubmit="this.onSearch" />
      <a-table
        :style="{ marginTop: '20px' }"
        :columns="columns"
        :data-source="tableDataList"
        :pagination="false"
        :loading="tableLoading"
        :scroll="{ y: scrollY }"
        :row-selection="rowSelection"
      >
        <template slot="faceAmountSlot" slot-scope="rowData">
          <div class="editable-row-operations">
            <span v-html="faceAmountStr(rowData)"></span>
          </div>
        </template>
        <!-- <span slot="action" slot-scope="record">
          <a @click="onCheck(record)">查看</a>
        </span> -->
      </a-table>
      <a-pagination
        :total="total"
        :show-total="total => `共 ${total} 条`"
        show-quick-jumper
        show-size-changer
        v-model="current"
        :current="current"
        :pageSize="pageSize"
        :pageSizeOptions="['10', '20', '30', '40', '50', '100']"
        @change="change"
        @showSizeChange="showSizeChange"
        style="margin-top:30px;width:100%;text-align: right;"
      />
    </a-modal>
  </div>
</template>

<script>
import api from '@/api';
import moment from 'moment';
import { debounce } from '@/utils/util';
import { mapActions } from 'vuex';
import { CARD_TYPE_MAP } from '@/constance';
import FilterForm from '@/components/FilterGroup/index.jsx';
import {
  couponsCenterList,
  bangdouList,
  cardList,
  level,
  typeList,
  activityList
} from '@/pages/coupons/release/createForms';

export default {
  name: 'couponsManageNew',
  components: {
    FilterForm
  },
  data() {
    return {
      //分页
      total: 0,
      current: 1,
      pageSize: 10,
      //表格
      tableDataList: [],
      tableLoading: false,
      formList: [
        {
          label: '卡券类型',
          name: 'type',
          type: 'select',
          placeholder: '全部',
          selectOptions: typeList
        },
        {
          label: '卡券标题',
          type: 'input',
          placeholder: '请输入',
          name: 'title'
        },
        {
          label: '卡券业务类型',
          type: 'select',
          placeholder: '全部',
          name: 'activity',
          selectOptions: activityList,
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        }
      ],
      columns: [
        {
          dataIndex: 'id',
          key: 'id',
          title: '卡券ID'
        },
        {
          title: '卡券标题',
          key: 'couponTitle',
          dataIndex: 'couponTitle'
        },
        // {
        //     title: '卡券副标题',
        //     key: 'couponSubhead',
        //     dataIndex: 'couponSubhead'
        // },
        {
          title: '卡券类型',
          key: 'couponType',
          dataIndex: 'couponType',
          customRender: text => typeList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券业务类',
          key: 'activity',
          dataIndex: 'activity',
          customRender: text => activityList.filter(item => item.id == text)[0].name || ''
        },
        {
          title: '卡券面值金额',
          key: 'faceAmountSlot',
          scopedSlots: { customRender: 'faceAmountSlot' }
        },
        {
          title: '操作人员',
          key: 'operator',
          dataIndex: 'operator'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        }
      ],
      //////////新建活动///////////
      modalVisible: false,
      showRedBorder: false,
      couponName: '请选择',
      couponValid: '',
      selectedRows: [],
      scrollY: 300,
      actModalVisible: false,
      awardFormindex: 0,
      awardList: [{ couponTitle: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'), couponBusinessType: '1' }],
      downLoadTplExist: false,
      downLoadTplUrl: '',
      file: '', //会员文件
      fileList1: [],
      plainOptions: ['时代+', '邻里PRO'],
      checkboxValue: [],
      radioValue: 1,
      radioValue1: 1,
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px'
      },
      //////////新建活动///////////
      submitLoading: false,
      saveLoading: false,
      //////////上传图片///////////
      conponForm: this.$form.createForm(this, { name: 'conponForm' }),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      couponImage: '',
      picUploading: false,
      //////////上传图片///////////
      // pcRuleId: '',//没用
      couponTitle: '',
      couponSubhead: '',
      couponType: '1',
      couponTypes: [
        { name: '会员卡券', code: '1' },
        { name: '会员卡券1', code: '2' }
      ],

      voucherAmount: '', //代金券抵扣金额
      satisfyAmount: '', //	折扣券/满减券 满多少金额可用
      fullReductionDiscountAmount: '', //满减券抵扣金额
      discountMaxDeduction: '', //	折扣券 最高抵扣金额
      discountRatio: '0.9', //折扣券 折扣比例
      validityType: 1,
      validityTypes: [
        { name: '固定有效期', code: 1 },
        { name: '相对有效期', code: 3 }
      ],
      rangePickerValue: [], //日期对象清空日期用
      validityStartTime: '', //固定有效期-卡券有效期开始时间
      validityEndTime: '', //	固定有效期-卡券有效期结束时间
      validityDayNums: 1, //相对有效期-卡券有效天数
      takeEffectDayNums: 1, //相对有效期-领取后几天后生效
      source: '1', //卡券平台 10-地产,20-邻里邦,30-邻里商城,40-会员中心,50-收费中心
      sources: [
        { name: '主题1', code: '1' },
        { name: '主题2', code: '2' },
        { name: '主题3', code: '3' },
        { name: '主题4', code: '4' },
        { name: '主题5', code: '5' }
      ],
      couponBusinessType: '1', //卡券业务类型
      couponBusinessTypes: [
        { name: '领券中心', code: '1' },
        { name: '邦豆兑换', code: '2' },
        { name: '会员权益', code: '3' }
      ],
      commercialTenants: '', //购物券-商户id
      merchandises: '', //购物券——商品id
      classification: 1, //	商城订单类型: 1全部/2零售
      cost: '', //成本价
      memo: '' //使用说明
    };
  },
  computed: {
    faceAmountStr() {
      return param => {
        if (param.couponType === 10) {
          return param.faceAmount;
        } else if (param.couponType === 20) {
          return param.faceAmount;
        } else if (param.couponType === 40) {
          return param.discountRatio * 10 + '折';
        } else {
          return '';
        }
      };
    },
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.selectedRows = selectedRows;
        },
        type: 'radio'
      };
    },
    momentStr() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD');
        }
      };
    },
    momentStrHms() {
      return param => {
        if (!param) {
          return '';
        } else {
          return moment(param).format('YYYY-MM-DD HH:mm:ss');
        }
      };
    },
    cardTypeStr() {
      return param => {
        let str = '';
        if (Object.keys(CARD_TYPE_MAP).includes(param)) {
          str = CARD_TYPE_MAP[param];
        }
        return str;
      };
    }
  },
  methods: {
    moment,
    //////////新建活动///////////
    // 查询卡券列表
    onSearch(args) {
      console.log(args);
      const { activity, title, type } = args;
      this.activity = activity || null;
      this.title = title || null;
      this.type = type || null;
      this.current = 1;
      this.getCouponList();
    },
    // 点击弹窗确定
    handleOk(e) {
      // this.confirmLoading = true;
      if (this.selectedRows.length > 0) {
        this.modalVisible = false;
        this.couponName = this.selectedRows[0].couponTitle;
        this.couTypeCode = this.selectedRows[0].couTypeCode;
        this.showRedBorder = false;
        this.id = this.selectedRows[0].id;
        console.log('=======', this.selectedRows);
        if (this.selectedRows[0].validityType == 1) {
          this.couponValid = `${this.selectedRows[0].validityStartTime} - ${this.selectedRows[0].validityEndTime}`;
        } else {
          this.couponValid = `有效天数: ${this.selectedRows[0].validityDayNums}天，${this.selectedRows[0].takeEffectDayNums}天后生效`;
        }
      } else {
        this.$message.error('必须选择一个卡券!');
      }
      // this.confirmLoading = false;
    },
    // 打开弹窗
    handleSelectCoupon() {
      this.modalVisible = true;
    },
    // 关闭弹窗
    handleModalCancel(e) {
      this.modalVisible = false;
    },
    handleDelete(index) {
      this.$delete(this.awardList, index);
    },
    addAward() {
      const tempObj = {
        couponTitle: this.momentStrHms(Date.now()),
        couponBusinessType: '1'
      };
      this.awardList.unshift(tempObj);
    },
    uploadBefor(file) {
      this.file = file;
      this.$set(this.fileList1, 0, file);
      // this.fileList1[0] = file;
      console.log('uploadBefor this.fileList1 :>> ', this.fileList1);
      return false;
    },
    handleRemove1(file) {
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
    },
    // 获取下载模版
    getTplDownload() {
      this.downLoadTplExist = false;
      api.getTplDownload().then(res => {
        console.log('getTplDownload res :>> ', res);
        this.downLoadTplExist = true;
        this.downLoadTplUrl = res.data;
      });
    },
    handleNullTpl() {
      this.$warning({
        title: '提示',
        content: '暂无模板文件, 您可以尝试刷新页面重新加载～'
      });
    },
    change(page) {
      this.current = page;
      this.getCouponList();
    },
    showSizeChange(current, size) {
      this.current = 1;
      this.pageSize = size;
      this.getCouponList();
    },
    // 获取卡券列表
    getCouponList() {
      this.tableLoading = true;
      let args = {
        pageIndex: this.current,
        pageSize: this.pageSize,
        activity: this.activity,
        type: this.type,
        title: this.title,
        status: 99
      };
      api
        .getCouponList(args)
        .then(res => {
          console.log(res);
          this.tableLoading = false;
          this.tableDataList = res.data.records.map((item, index) => {
            return {
              ...item,
              key: index
            };
          });
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    //////////新建活动///////////
    disabledDate(current) {
      return current && current < Date.now() - 86400000;
    },
    checkCostFormat(rule, value, callback) {
      if (value && !/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('成本价格式不正确'));
      } else {
        callback();
      }
    },
    checkAmountFormat(rule, value, callback) {
      if (value && !/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(value)) {
        callback(new Error('金额格式不正确'));
      } else {
        if (value == 0) {
          callback(new Error('金额不能为0'));
        }
        callback();
      }
    },
    checkDiscountFormat(rule, value, callback) {
      if (value && !/^(0(\.\d{1,2})?|1(\.0{1,2})?)$/.test(value)) {
        callback(new Error('折扣格式不正确'));
      } else {
        if (value == 0) {
          callback(new Error('折扣不能为0'));
        } else if (value == 1) {
          callback(new Error('折扣不能为1'));
        }
        callback();
      }
    },
    ...mapActions(['FALLBACK']),
    //////////上传图片///////////
    //{ fileList = [] } = {}是解构赋至拿到参数中的fileList
    addPic({ fileList = [] } = {}) {
      console.log('addPic fileList:>> ', fileList);
      if (fileList.length > 0) {
        const isJpgOrPng = fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png';
        if (!isJpgOrPng) {
          this.$message.error('图片格式错误，请重新上传');
        } else {
          const imgSize = fileList[0].size / 1024 / 1024 < 5;
          if (!imgSize) {
            this.$message.error('图片过大，请重新上传');
          } else {
            this.picUploading = true;
            const formData = new FormData();
            console.log('fileList :>> ', fileList);
            fileList.forEach(file => {
              formData.append('file', file.originFileObj);
            });
            formData.append('programCode', 'sys-member-center');
            console.log('formData.get(file) :>> ', formData.get('file'));
            console.log('formData.get(programCode) :>> ', formData.get('programCode'));

            api
              .updateImage(formData)
              .finally(() => {
                this.picUploading = false;
              })
              .then(res => {
                if (res.code === 200) {
                  console.log(this.fileList);
                  this.conponForm.setFieldsValue({
                    couponImage: res.data
                  });
                  this.$set(this.fileList, 0, {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data ? res.data : ''
                  });
                  this.couponImage = res.data ? res.data : '';
                }
              });
          }
        }
      }
    },
    handleRemove(file) {
      console.log('handleRemove');
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.couponImage = '';
    },
    deleteOssImage() {
      console.log('deleteOssImage');
      const that = this;
      that.$confirm({
        title: '删除图片',
        content: '确定删除图片吗？',
        centered: true,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          const para = {
            filePath: that.fileList[0].url,
            type: 1
          };
          that.picUploading = true;
          api
            .deleteImage(para)
            .finally(() => {
              that.picUploading = false;
            })
            .then(res => {
              if (res.code === 200) {
                that.fileList = [];
                that.couponImage = '';
                that.conponForm.setFieldsValue({
                  couponImage: ''
                });
              }
            });
        }
      });
    },
    handleCancel() {
      debounce(() => {
        this.previewVisible = false;
      });
    },
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await this.getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    //////////上传图片///////////
    handleCancle() {
      this.$router.replace({ path: '/actManage' });
    },
    handleRangePicker(dates, dateStrings) {
      console.log('handleRangePicker dates :>> ', dates);
      console.log('handleRangePicker dateStrings :>> ', dateStrings);
      this.rangePickerValue = dates;
      this.validityStartTime = dateStrings[0];
      this.validityEndTime = dateStrings[1];
    },

    /**
     **判断日期格式为yyyy-mm-dd和正确的日期
     */
    isDateString(str) {
      const reg = /^([1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9])\s(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      if (str === '' || str === undefined || str === null) return false;
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },

    //输入框
    couponTitleChange(e) {
      this.couponTitle = e.target.value;
    },
    couponTitleChange1(e) {
      console.log('couponTitleChange1 this.awardFormindex :>> ', this.awardFormindex);
      console.log('couponTitleChange1 e.target.value :>> ', e.target.value);
      this.$set(this.awardList[this.awardFormindex], 'couponTitle', e.target.value);
    },
    couponSubheadChange(e) {
      this.couponSubhead = e.target.value;
    },
    voucherAmountChange(e) {
      this.voucherAmount = e.target.value;
    },
    satisfyAmountChange(e) {
      this.satisfyAmount = e.target.value;
    },
    discountMaxDeductionChange(e) {
      this.discountMaxDeduction = e.target.value;
    },
    discountRatioChange(e) {
      // console.log('discountRatioChange e.target.value :>> ', e.target.value);
      this.discountRatio = e.target.value.toString();
    },
    fullReductionDiscountAmountChange(e) {
      this.fullReductionDiscountAmount = e.target.value;
    },
    validityDayNumsChange(newVal) {
      this.validityDayNums = newVal;
    },
    takeEffectDayNumsChange(newVal) {
      this.takeEffectDayNums = newVal;
    },
    commercialTenantsChange(e) {
      this.commercialTenants = e.target.value;
    },
    merchandisesChange(e) {
      this.merchandises = e.target.value;
    },
    costChange(e) {
      this.cost = e.target.value;
    },
    memoChange(e) {
      this.memo = e.target.value;
    },

    //单选
    classificationChange(e) {
      this.classification = e.target.value;
    },
    //多选
    checkboxChange(checkedValues) {
      console.log('checkboxChange checkedValues :>> ', checkedValues);
      this.checkboxValue.splice(0, this.checkboxValue.length);
      checkedValues.forEach(element => {
        this.checkboxValue.push(element);
      });
    },

    //下拉
    couponTypeSelect(value) {
      console.log('couponTypeSelect');
      this.couponType = value;
    },
    validityTypeSelect(value) {
      console.log('validityTypeSelect');
      this.validityType = value;
    },
    sourceSelect(value) {
      console.log('sourceSelect');
      this.source = value;
    },
    couponBusinessTypeSelect(value) {
      console.log('couponBusinessTypeSelect value :>> ', value);
      this.couponBusinessType = value;
    },
    couponBusinessTypeSelect1(value) {
      console.log('couponBusinessTypeSelect1 this.awardFormindex :>> ', this.awardFormindex);
      console.log('couponBusinessTypeSelect1 value :>> ', value);
      this.$set(this.awardList[this.awardFormindex], 'couponBusinessType', value);
    },

    //获取详情
    getCouponDetail() {
      const param = {
        couponId: 12355
      };
      api.getCouponDetail(param).then(res => {
        console.log('getCouponDetail res :>> ', res);

        //////////////////mock/////////////////
        res.data = {
          // pcRuleId:136994,//没用
          classification: 1,
          commercialTenants: '123456',
          cost: '',
          couponBusinessType: '4014',
          // couponCode: '',
          // couponId: '',
          couponImage:
            'https://hystxt-oss.oss-cn-shenzhen.aliyuncs.com/oss-frontend/sys-member-center/4402197751161_lalala.png',
          couponSubhead: '',
          couponTitle: '卡券标题',
          couponType: 10,
          // createOperator: '',
          // createTime: null,
          // dateTime: null,
          discountMaxDeduction: '150',
          discountRatio: '0.7',
          fullReductionDiscountAmount: '100',
          memo: 'mock 999',
          merchandises: '123456',
          satisfyAmount: '200',
          source: '10',
          state: 1,
          takeEffectDayNums: 3,
          validityDayNums: 30,
          validityStartTime: '2021-01-11',
          validityEndTime: '2020-01-22',
          validityType: 1,
          voucherAmount: '100'
        };
        //////////////////mock/////////////////

        if (res.code === 200) {
          // this.pcRuleId = res.data.pcRuleId || this.pcRuleId;//没用
          this.classification = res.data.classification || this.classification;
          this.commercialTenants = res.data.commercialTenants || this.commercialTenants;
          this.couponImage = res.data.couponImage || this.couponImage;
          this.discountMaxDeduction = res.data.discountMaxDeduction || this.discountMaxDeduction;
          this.discountRatio = res.data.discountRatio || this.discountRatio;
          this.fullReductionDiscountAmount = res.data.voucherAmount || this.fullReductionDiscountAmount;
          this.merchandises = res.data.merchandises || this.merchandises;
          this.satisfyAmount = res.data.satisfyAmount || this.satisfyAmount;
          this.state = res.data.state || this.state;
          this.takeEffectDayNums = res.data.takeEffectDayNums || this.takeEffectDayNums;
          this.validityDayNums = res.data.validityDayNums || this.validityDayNums;
          ////////////init show/////////
          this.couponTitle = res.data.couponTitle || this.couponTitle;
          this.couponSubhead = res.data.couponSubhead || this.couponSubhead;
          this.couponType = res.data.couponType || this.couponType;
          this.voucherAmount = res.data.voucherAmount || this.voucherAmount;
          this.validityType = res.data.validityType || this.validityType;
          ///////////日期//////////
          this.validityStartTime = this.isDateString(this.momentStrHms(res.data.validityStartTime))
            ? this.momentStrHms(res.data.validityStartTime)
            : ''; //固定有效期-卡券有效期开始时间
          this.validityEndTime = this.isDateString(this.momentStrHms(res.data.validityEndTime))
            ? this.momentStrHms(res.data.validityEndTime)
            : ''; //	固定有效期-卡券有效期结束时间
          if (this.isDateString(this.validityStartTime) && this.isDateString(this.validityEndTime)) {
            this.rangePickerValue = [moment(this.validityStartTime), moment(this.validityEndTime)];
          } else {
            this.rangePickerValue = [];
            this.validityStartTime = '';
            this.validityEndTime = '';
          }
          ///////////日期//////////
          this.source = res.data.source || this.source;
          this.couponBusinessType = res.data.couponBusinessType || this.couponBusinessType;
          this.cost = res.data.cost || this.cost;
          this.memo = res.data.memo || this.memo;
          /////////////init show/////////////
        }
      });
    },

    handleSubmit(state, loadingType) {
      this.conponForm.validateFields((err, values) => {
        console.log('handleSubmit validateFields err :>> ', err);
        //没有错误的情况下
        if (!err) {
          console.log('handleSubmit values :>> ', values);
          this.getCouponCreate(state, loadingType);
        }
      });
    },

    getCouponCreate(state, loadingType) {
      const param = {
        // pcRuleId: this.pcRuleId,//没用
        state: state,
        classification: this.classification,
        commercialTenants: this.commercialTenants,
        cost: this.cost,
        couponBusinessType: this.couponBusinessType,
        // couponCode: '', //没用
        // couponId: this.$route.query.id,//没用
        couponImage: this.couponImage,
        couponSubhead: this.couponSubhead,
        couponTitle: this.couponTitle,
        couponType: this.couponType,
        createOperator: '', //没用
        createTime: '', //没用
        dateTime: '', //没用
        discountMaxDeduction: this.discountMaxDeduction,
        discountRatio: this.discountRatio.toString(),
        fullReductionDiscountAmount: this.fullReductionDiscountAmount,
        memo: this.memo,
        merchandises: this.merchandises,
        satisfyAmount: this.satisfyAmount,
        source: this.source,
        takeEffectDayNums: this.takeEffectDayNums,
        validityDayNums: this.validityDayNums,
        validityEndTime: this.validityEndTime,
        validityStartTime: this.validityStartTime,
        validityType: this.validityType,
        voucherAmount: this.voucherAmount
      };

      console.log('getCouponCreate param :>> ', param);

      this[loadingType] = true;

      api
        .getCouponCreate(param)
        .finally(() => {
          this[loadingType] = false;
        })
        .then(res => {
          console.log('getCouponCreate res :>> ', res);
          if (res.code === 200) {
            console.log('res.data :>> ', res.data);
            this.$router.replace({ path: '/actManage' });
          }
        });
    }
  },
  created() {
    console.log('this.$route :>> ', this.$route);
    this.getTplDownload();
    this.getCouponList();
    // this.getCouponDetail();
  },
  mounted() {},
  watch: {
    modalVisible: function(newVal, oldVal) {
      if (newVal) {
        this.getCouponList();
      }
    },
    fileList: {
      handler(newVal) {
        console.log('watch fileList newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    fileList1: {
      handler(newVal) {
        console.log('watch fileList1 newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },

    awardList: {
      handler(newVal) {
        console.log('watch awardList newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },

    couponImage: {
      handler(newVal) {
        console.log('watch couponImage newVal :>> ', newVal);
        this.couponImage = this.couponImage.replace(/\s+/g, ''); //去除image url空格
        if (newVal) {
          this.$set(this.fileList, 0, { uid: '-1', name: 'image.png', status: 'done', url: newVal });
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    rangePickerValue: {
      handler(newVal) {
        console.log('watch rangePickerValue newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
#coupons-detail {
  height: 100%;

  .content-header {
    .fallback {
      cursor: pointer;
    }
  }
  .coupons-main {
    height: calc(100% - 50px);
    overflow-y: auto;
    .coupons-common {
      background-color: #fff;
      padding-bottom: 50px;

      .common-row {
        padding: 20px 16px 0;
        border-bottom: 1px dashed #ccc;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        align-items: center;

        ::v-deep .ant-form .ant-input-number {
          width: 100%;
        }

        ::v-deep .ant-calendar-picker {
          width: 380px !important;
        }

        .common-form {
          .common-title {
            color: #666;
            padding: 30px 0 20px 14px;
            .common-title-content {
              font-size: 16px;
              height: 16px;
              line-height: 16px;
              padding-left: 8px;
              border-left: 3px solid rgba(33, 33, 206, 0.5);
            }
          }
          .common-title:first-child {
            padding: 10px 0 20px 14px;
          }

          .common-award {
            position: relative;
            border: 1px dashed #ccc;
            padding: 10px;
            margin: 10px 11.5% 20px;
            border-radius: 8px;

            .common-award-couponSelect {
              width: 100%;
              line-height: 32px;
              height: 32px;
              border: 1px solid #bfbfbf;
              color: #bfbfbf;
              padding-left: 10px;
              border-radius: 3px;
            }

            .border-red {
              border-color: #f5222d;
            }

            .common-award-couponSelectTip {
              color: #f5222d;
              margin: 0;
              line-height: 1.5;
              padding-top: 3px;
            }

            .common-award-btn {
              position: absolute;
              bottom: 10px;
              right: 10px;
            }

            ::v-deep .ant-col-3 {
              width: 20%;
            }
          }
        }

        .common-submit-cancle {
          padding: 30px 0 0 150px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          .common-btn {
            margin-right: 30px;

            ::v-deep .ant-btn {
              box-sizing: content-box;
              padding: 2px 15px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: 500;
            }
          }

          .common-cancle {
            ::v-deep .ant-btn {
              color: #666;
              background-color: #fff;
              border-color: #ccc;
            }
          }
        }
      }

      .common-row:last-child {
        border: none;
      }
    }
  }
}
</style>
