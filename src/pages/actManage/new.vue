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
                <!-- 活动主题名称 -->
                <a-form-item label="活动主题名称">
                  <a-select
                    v-decorator="[
                      'activityThemeId',
                      {
                        initialValue: activityThemeId,
                        rules: [{ required: true, message: '活动主题名称不能为空' }]
                      }
                    ]"
                    @change="themeIdSelect"
                  >
                    <a-select-option :value="item.code" v-for="(item, index) in activityThemeIds" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>活动主题名称 activityThemeId: {{ activityThemeId }}</div> -->
                </a-form-item>
                <!-- 活动名称 -->
                <a-form-item label="活动名称">
                  <a-input
                    @change="activityNameChange"
                    v-decorator="[
                      'activityName',
                      {
                        initialValue: activityName,
                        rules: [
                          { required: true, message: '活动名称不能为空' },
                          { whitespace: true, message: '活动名称不能为空' },
                          { max: 20, message: '最多输入20个字符' }
                        ]
                      }
                    ]"
                    placeholder="请输入活动名称"
                  />
                  <!-- <div>活动名称 activityName: {{ activityName }}</div> -->
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
                    format="YYYY-MM-DD"
                    @change="handleRangePicker"
                    :disabled-date="disabledDate"
                  />
                  <!-- <div>活动有效期 validityStartTime: {{ validityStartTime }}</div>
                  <div>活动有效期 validityEndTime: {{ validityEndTime }}</div> -->
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
                    placeholder="请输入备注信息, 最多200个字符"
                  />
                  <!-- <div>活动描述 memo: {{ memo }}</div> -->
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
                        'activityCover',
                        { initialValue: activityCover, rules: [{ required: true, message: '图片不能为空' }] }
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
                    <a-modal :visible="previewVisible" :footer="null" @cancel="handlePreviewCancel">
                      <img class="img" alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                  </a-spin>
                  <span style="margin-top:-20px;color:#999999;font-size:12px;">
                    建议上传尺寸为：1080*2338，格式为jpg、png，大小不超过5MB。
                  </span>
                  <!-- <div>活动封面 activityCover: {{ activityCover }}</div> -->
                </a-form-item>
                <!-- 活动类型 -->
                <a-form-item label="活动类型">
                  <a-select
                    v-decorator="[
                      'typeId',
                      {
                        initialValue: typeId,
                        rules: [{ required: true, message: '活动类型不能为空' }]
                      }
                    ]"
                    @change="typeIdSelect"
                  >
                    <a-select-option :value="item.id" v-for="(item, index) in typeIds" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>活动类型 typeId: {{ typeId }}</div> -->
                </a-form-item>

                <!-- ********************************************************************* -->

                <!-- ############ 用户参数 ############ -->
                <div class="common-title">
                  <div class="common-title-content">用户参数</div>
                </div>
                <!-- 会员权益类型 -->
                <a-form-item label="会员权益类型" v-if="typeId === 2">
                  <a-select
                    v-decorator="[
                      'rightsType',
                      {
                        initialValue: rightsType,
                        rules: [{ required: true, message: '会员权益类型不能为空' }]
                      }
                    ]"
                    @change="rightsTypeSelect"
                  >
                    <a-select-option :value="item.id" v-for="(item, index) in rightsTypes" :key="index">
                      {{ item.name }}
                    </a-select-option>
                  </a-select>
                  <!-- <div>会员权益类型 rightsType: {{ rightsType }}</div> -->
                </a-form-item>
                <!-- 会员来源+上传指定会员 -->
                <a-radio-group v-model="scopeType" style="padding-left: 50px;">
                  <a-radio :style="radioStyle" :value="0">
                    <span style="padding-right:40px;">会员来源</span>
                    <!-- 会员来源 -->
                    <a-form-item style="display:inline-block;">
                      <a-checkbox-group
                        v-if="scopeType === 0"
                        v-decorator="[
                          'clientId',
                          { initialValue: clientId, rules: [{ required: true, message: '会员来源不能为空' }] }
                        ]"
                        :options="clientIds"
                        @change="clientIdChange"
                      />
                    </a-form-item>
                  </a-radio>
                  <div v-if="scopeType === 0" :style="radioStyle" style="margin:25px 0">
                    <span style="padding: 0 40px 0 24px;">会员等级</span>
                    <!-- 会员等级 -->
                    <a-form-item style="display:inline-block;">
                      <a-select
                        style="width:200px;"
                        v-decorator="[
                          'startLevelId',
                          {
                            initialValue: startLevelId,
                            rules: [{ required: true, message: '会员等级不能为空' }]
                          }
                        ]"
                        @change="startLevelIdSelect"
                      >
                        <a-select-option :value="item.id" v-for="(item, index) in levelIds" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                    <span style="padding: 0 20px;color:#ccc;">------</span>
                    <a-form-item style="display:inline-block;">
                      <a-select
                        style="width:200px;"
                        v-decorator="[
                          'endLevelId',
                          {
                            initialValue: endLevelId,
                            rules: [{ required: true, message: '会员等级不能为空' }]
                          }
                        ]"
                        @change="endLevelIdSelect"
                      >
                        <a-select-option :value="item.id" v-for="(item, index) in levelIds" :key="index">
                          {{ item.name }}
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </div>
                  <a-radio :style="radioStyle" :value="1">
                    <span style="padding-right:40px;">上传指定会员</span>
                    <!-- { required: true, message: '请选择文件上传!' }, -->
                    <!-- 上传指定会员 -->
                    <a-form-item style="display:inline-block;width:100%;">
                      <a-upload
                        v-if="scopeType === 1"
                        v-decorator="[
                          'file',
                          {
                            initialValue: file,
                            rules: [
                              {
                                validator: (rule, value, callback) =>
                                  validatorFn1(rule, value, callback, '请选择文件上传!')
                              }
                            ]
                          }
                        ]"
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
                  <div v-if="scopeType === 1" style="padding:40px 0 0 148px;">
                    <p style="font-size: 12px;color: #c1c1c1;">
                      支持扩展名：.xlsx，支持批量上传会员手机号或会员UUID，重复会员计算一次
                    </p>
                    <p>
                      <a v-show="!downLoadTplExist" @click.prevent="handleNullTpl">暂无会员信息模板</a>
                      <a v-show="downLoadTplExist" :href="downLoadTplUrl">下载会员信息模板</a>
                    </p>
                  </div>
                  <!-- <div>单选 scopeType: {{ scopeType }}</div>
                  <div>会员来源 clientId.join(): {{ clientId.join() }}</div>
                  <div>开始等级 startLevelId: {{ startLevelId }}</div>
                  <div>结束等级 endLevelId: {{ endLevelId }}</div> -->
                </a-radio-group>
                <!-- ********************************************************************* -->

                <!-- ############ 时间参数 ############ -->
                <div class="common-title">
                  <div class="common-title-content">时间参数</div>
                </div>
                <div class="common-time">
                  <a-form-item label="是否为周期性活动">
                    <a-radio-group
                      style="padding-left:26px;"
                      @change="isPeriodicChange"
                      v-decorator="[
                        'isPeriodic',
                        {
                          initialValue: isPeriodic,
                          rules: [{ required: true, message: '是否为周期性活动不能为空' }]
                        }
                      ]"
                    >
                      <a-radio :value="0">
                        不是
                      </a-radio>
                      <a-radio :value="1">
                        是
                      </a-radio>
                    </a-radio-group>
                    <!-- <div>是否为周期性活动 isPeriodic:{{ isPeriodic }}</div> -->
                  </a-form-item>

                  <div v-if="isPeriodic === 1">
                    <!-- 每月活动日+每周活动日 -->
                    <a-radio-group v-model="actRadioValue" style="padding-left: 50px;">
                      <a-radio :style="radioStyle" :value="1">
                        <span style="padding-right:40px;">每月活动日</span>
                        <template v-if="actRadioValue === 1">
                          <a-form-item style="display:inline-block;">
                            <a-select
                              style="width:100px;"
                              v-decorator="[
                                'isIncluded1',
                                {
                                  initialValue: isIncluded1,
                                  rules: [{ validator: this.checkMonthlyDay, trigger: ['blur'] }]
                                }
                              ]"
                              @change="isIncluded1Select"
                            >
                              <a-select-option :value="item.id" v-for="(item, index) in isIncludeds" :key="index">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-button
                            style="margin-left:20px;margin-top:4px;width:500px;"
                            @click="showMonthlyDayModal"
                            block
                          >
                            {{ monthlyDayStr(monthlyDay) || '请选择每月活动日' }}
                          </a-button>
                        </template>
                      </a-radio>
                      <a-radio :style="radioStyle" :value="2">
                        <span style="padding-right:40px;">每周活动日</span>
                        <template v-if="actRadioValue === 2">
                          <a-form-item style="display:inline-block;">
                            <a-select
                              style="width:100px;"
                              v-decorator="[
                                'isIncluded2',
                                {
                                  initialValue: isIncluded2,
                                  rules: [{ validator: this.checkWeeklyDay, trigger: ['blur'] }]
                                }
                              ]"
                              @change="isIncluded2Select"
                            >
                              <a-select-option :value="item.id" v-for="(item, index) in isIncludeds" :key="index">
                                {{ item.name }}
                              </a-select-option>
                            </a-select>
                          </a-form-item>
                          <a-button
                            style="margin-left:20px;margin-top:4px;width:500px;"
                            @click="showWeeklyDayModal"
                            block
                          >
                            {{ weeklyDayStr(weeklyDay) || '请选择每周活动日' }}
                          </a-button>
                        </template>
                      </a-radio>
                      <!-- <div>actRadioValue: {{ actRadioValue }}</div>
                      <div>isIncluded1: {{ isIncluded1 }}</div>
                      <div>isIncluded2: {{ isIncluded2 }}</div>
                      <div>每月活动日 monthlyDay: {{ monthlyDay }}</div>
                      <div>每周活动日 weeklyDay: {{ weeklyDay }}</div> -->
                    </a-radio-group>
                    <!-- 对话框 -->
                    <a-modal
                      v-if="actRadioValue === 1"
                      v-model="actModalVisible"
                      title="每月活动日"
                      @ok="monthlyDayModal"
                      :centered="true"
                      :maskClosable="false"
                    >
                      <a-form-item>
                        <a-checkbox-group
                          v-decorator="[
                            'monthlyDay',
                            { initialValue: monthlyDay, rules: [{ required: true, message: '每月活动日不能为空' }] }
                          ]"
                          :options="monthlyDays"
                          @change="monthlyDayChange"
                        />
                      </a-form-item>
                    </a-modal>
                    <a-modal
                      v-if="actRadioValue === 2"
                      v-model="actModalVisible"
                      title="每周活动日"
                      @ok="weeklyDayModal"
                      :centered="true"
                      :maskClosable="false"
                    >
                      <a-form-item>
                        <a-checkbox-group
                          v-decorator="[
                            'weeklyDay',
                            { initialValue: weeklyDay, rules: [{ required: true, message: '每周活动日不能为空' }] }
                          ]"
                          :options="weeklyDays"
                          @change="weeklyDayChange"
                        />
                      </a-form-item>
                    </a-modal>
                  </div>
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
                  :class="`common-award-${index}`"
                  v-for="(item, index) in activityAwards"
                  :key="item.keyIndex"
                  @click="awardFormindex = index"
                >
                  <a-form-item label="选择卡券">
                    <div
                      :class="`common-award-couponSelect ${item.showRedBorder && 'border-red'}`"
                      @click="handleSelectCoupon(item)"
                    >
                      {{ item.couponName }}
                    </div>
                    <p v-show="item.showRedBorder" class="common-award-couponSelectTip">请选择卡券！</p>
                  </a-form-item>
                  <a-form-item label="卡券有效期">
                    <a-input :placeholder="item.couponValid" disabled />
                  </a-form-item>
                  <a-form-item label="领取条件设置">
                    <a-select
                      v-decorator="[
                        `condition-${index}`,
                        {
                          initialValue: item.condition,
                          rules: [{ required: true, message: '领取条件设置不能为空' }]
                        }
                      ]"
                      @change="conditionSelect"
                    >
                      <a-select-option
                        :value="itemSelect.id"
                        v-for="(itemSelect, indexSelect) in conditions"
                        :key="indexSelect"
                      >
                        {{ itemSelect.name }}
                      </a-select-option>
                    </a-select>
                    <!-- <div>item.condition:{{ item.condition }}</div> -->
                  </a-form-item>
                  <a-form-item label="发放数量">
                    <a-input-number
                      @change="issuedCountChange"
                      v-decorator="[
                        `issuedCount-${index}`,
                        {
                          initialValue: item.issuedCount,
                          rules: [
                            { required: true, message: '请输入发放数量' },
                            { pattern: /^[1-9]\d*$/, message: '请输入发放数量' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn0(rule, value, callback, '每人兑换数量限制, 1-5000')
                            }
                          ]
                        }
                      ]"
                      placeholder="请输入发放数量"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="邦豆兑换值" v-if="(typeId === 2 || typeId === 3) && item.condition === 3">
                    <a-input-number
                      @change="integrealCountChange"
                      v-decorator="[
                        `integrealCount-${index}`,
                        {
                          initialValue: item.integrealCount,
                          rules: [
                            { required: true, message: '请输入邦豆兑换值!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入邦豆兑换值!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人兑换数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="请输入邦豆兑换值"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人领取数量限制" v-if="item.condition === 1">
                    <a-input-number
                      @change="perPersonLimitChange"
                      v-decorator="[
                        `perPersonLimit-${index}`,
                        {
                          initialValue: item.perPersonLimit,
                          rules: [
                            { required: true, message: '请输入每人领取数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每人领取数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人领取数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人兑换数量限制" v-if="item.condition === 3">
                    <a-input-number
                      @change="perPersonLimitChange"
                      v-decorator="[
                        `perPersonLimit-${index}`,
                        {
                          initialValue: item.perPersonLimit,
                          rules: [
                            { required: true, message: '请输入每人兑换数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每人兑换数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人兑换数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每日领取数量限制" v-if="item.condition === 1">
                    <a-input-number
                      @change="perDayLimitChange"
                      v-decorator="[
                        `perDayLimit-${index}`,
                        {
                          initialValue: item.perDayLimit,
                          rules: [
                            { required: true, message: '请输入每日领取数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每日领取数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人每日领取数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每日兑换数量限制" v-if="item.condition === 3">
                    <a-input-number
                      @change="perDayLimitChange"
                      v-decorator="[
                        `perDayLimit-${index}`,
                        {
                          initialValue: item.perDayLimit,
                          rules: [
                            { required: true, message: '请输入每日兑换数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每日兑换数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人每日兑换数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人每日领取数量限制" v-if="item.condition === 1">
                    <a-input-number
                      @change="perPersonDayLimitChange"
                      v-decorator="[
                        `perPersonDayLimit-${index}`,
                        {
                          initialValue: item.perPersonDayLimit,
                          rules: [
                            { required: true, message: '请输入每人每日领取数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每人每日领取数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人每日领取数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <a-form-item label="每人每日兑换数量限制" v-if="item.condition === 3">
                    <a-input-number
                      @change="perPersonDayLimitChange"
                      v-decorator="[
                        `perPersonDayLimit-${index}`,
                        {
                          initialValue: item.perPersonDayLimit,
                          rules: [
                            { required: true, message: '请输入每人每日兑换数量限制!' },
                            { pattern: /^[1-9]\d*$/, message: '请输入每人每日兑换数量限制!' },
                            {
                              validator: (rule, value, callback) =>
                                validatorFn(rule, value, callback, '每人每日兑换数量限制, 1-999999999')
                            }
                          ]
                        }
                      ]"
                      placeholder="1-999999999"
                    />
                    <!-- <div>item.couponTitle: {{ item.couponTitle }}</div> -->
                  </a-form-item>
                  <template v-if="isPeriodic === 1 && typeId === 2">
                    <a-form-item label="可领取时间" v-if="actRadioValue === 1">
                      <a-select
                        placeholder="请输入发放数量"
                        v-decorator="[
                          `monthGetDay-${index}`,
                          {
                            initialValue: item.monthGetDay
                          }
                        ]"
                        @change="monthGetDaySelect"
                      >
                        <a-select-option :value="itemSelect.id" v-for="itemSelect in monthGetDays" :key="itemSelect.id">
                          {{ itemSelect.name }}
                        </a-select-option>
                      </a-select>
                      <!-- <div>item.monthGetDay:{{ item.monthGetDay }}</div> -->
                    </a-form-item>
                    <a-form-item label="可领取时间" v-if="actRadioValue === 2">
                      <a-select
                        placeholder="请输入发放数量"
                        v-decorator="[
                          `weekGetDay-${index}`,
                          {
                            initialValue: item.weekGetDay
                          }
                        ]"
                        @change="weekGetDaySelect"
                      >
                        <a-select-option :value="itemSelect.id" v-for="itemSelect in weekGetDays" :key="itemSelect.id">
                          {{ itemSelect.name }}
                        </a-select-option>
                      </a-select>
                      <!-- <div>item.weekGetDay:{{ item.weekGetDay }}</div> -->
                    </a-form-item>
                  </template>
                  <button class="common-award-btn" v-show="activityAwards.length > 1" @click="handleDelete(index)">
                    删除
                  </button>
                </div>
                <!-- <div>奖品参数activityAwards: {{ activityAwards }}</div> -->
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
                    @click="handleSubmit('saveLoading')"
                  >
                    保存
                  </a-button>
                </div>
                <div class="common-btn common-cancle">
                  <a-button type="primary" @click="handleCancel">取消</a-button>
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
      @ok="handleModalOk"
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
import FilterForm from '@/components/FilterGroup/index.jsx';
import {
  couponsCenterList,
  bangdouList,
  cardList,
  level,
  typeList,
  activityList
} from '@/pages/coupons/release/createForms';

const validatorFn = (rule, value, callback, message) => {
  if (parseInt(value, 10) < 1 || parseInt(value, 10) > 999999999) {
    callback(message);
  } else {
    callback();
  }
};

const validatorFn0 = (rule, value, callback, message) => {
  if (parseInt(value, 10) < 1 || parseInt(value, 10) > 5000) {
    callback(message);
  } else {
    callback();
  }
};

const validatorFn1 = (rule, value, callback, message) => {
  console.log('validatorFn1 value :>> ', value);
  if (!value) {
    callback(message);
  } else {
    if (value.fileList.length === 0) {
      callback(message);
    } else {
      callback();
    }
  }
};

export default {
  name: 'couponsManageNew',
  components: {
    FilterForm
  },
  data() {
    return {
      handleItem: null, //中转
      ////////// 新建活动 start ///////////
      //表格分页
      total: 0,
      current: 1,
      pageSize: 10,
      //表格数据和Loading
      tableDataList: [],
      tableLoading: false,
      //表头筛选和表格内容
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
      modalVisible: false,
      showRedBorder: false,
      couponName: '请选择',
      couponValid: '',
      selectedRows: [],
      scrollY: 300,
      actModalVisible: false,
      awardFormindex: '',
      activityAwards: [
        {
          keyIndex: `${Date.now()}-0`,
          couponCode: '',
          couponId: '',
          condition: '',
          startTime: '',
          expirationTime: '',
          issuedCount: '',
          integrealCount: '',
          perPersonLimit: '',
          perDayLimit: '',
          perPersonDayLimit: '',
          monthGetDay: '',
          weekGetDay: '',
          couponName: '请选择',
          couponValid: '',
          showRedBorder: false
        }
      ],
      downLoadTplExist: false,
      downLoadTplUrl: '',
      file: null, //会员文件
      fileList1: [],
      checkboxValue: [],
      plainOptions: [
        { label: '周一', value: 1 },
        { label: '周二', value: 2 }
      ],
      actRadioValue: 1,
      radioStyle: {
        display: 'block',
        height: '40px',
        lineHeight: '40px'
      },
      // 表单数据
      activityThemeId: '', //活动主题名称
      activityThemeIds: [{ name: '请选择', code: '' }], //活动主题名称列表
      activityName: '', // 活动名称
      validityStartTime: '', //活动有效期-开始时间
      validityEndTime: '', //	活动有效期-结束时间
      memo: '', //活动描述
      activityCover: '', //活动封面
      typeId: 1, //活动类型id
      typeIds: [
        { name: '领券中心', id: 1 },
        { name: '会员权益', id: 2 },
        { name: '邦豆兑换', id: 3 }
      ], //活动类型列表
      rightsType: 1,
      rightsTypes: [
        { name: '会员卡劵', id: 1 }
        // { name: '会员卡劵2', id: 2 } //需要注释
      ],
      clientId: [],
      clientIds: [
        { label: '邻里邦Pro', value: 'sys_linlibang' },
        { label: '地产Pro', value: 'sys_dichan' }
      ],
      startLevelId: 1,
      endLevelId: 1,
      levelIds: [
        { name: '邻里会员V1', id: 1 },
        { name: '邻里会员V2', id: 2 },
        { name: '邻里会员V3', id: 3 },
        { name: '邻里会员V4', id: 4 },
        { name: '邻里会员V5', id: 5 }
      ],
      isPeriodic: 0,
      isIncluded1: 1,
      isIncluded2: 1,
      isIncludeds: [
        { name: '包含', id: 1 }
        // { name: '不包含', id: 2 } //需要注释
      ],
      monthlyDay: [],
      weeklyDay: [],
      monthlyDays: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
      ],
      weeklyDays: [
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周日', value: '7' }
      ],
      monthGetDays: [
        { name: '不限制', id: '' },
        { name: '1日', id: '1' },
        { name: '2日', id: '2' },
        { name: '3日', id: '3' },
        { name: '4日', id: '4' },
        { name: '5日', id: '5' },
        { name: '6日', id: '6' },
        { name: '7日', id: '7' },
        { name: '8日', id: '8' },
        { name: '9日', id: '9' },
        { name: '10日', id: '10' },
        { name: '11日', id: '11' },
        { name: '12日', id: '12' },
        { name: '13日', id: '13' },
        { name: '14日', id: '14' },
        { name: '15日', id: '15' },
        { name: '16日', id: '16' },
        { name: '17日', id: '17' },
        { name: '18日', id: '18' },
        { name: '19日', id: '19' },
        { name: '20日', id: '20' },
        { name: '21日', id: '21' },
        { name: '22日', id: '22' },
        { name: '23日', id: '23' },
        { name: '24日', id: '24' },
        { name: '25日', id: '25' },
        { name: '26日', id: '26' },
        { name: '27日', id: '27' },
        { name: '28日', id: '28' },
        { name: '29日', id: '29' },
        { name: '30日', id: '30' },
        { name: '31日', id: '31' }
      ],
      weekGetDays: [
        { name: '不限制', id: '' },
        { name: '周一', id: '1' },
        { name: '周二', id: '2' },
        { name: '周三', id: '3' },
        { name: '周四', id: '4' },
        { name: '周五', id: '5' },
        { name: '周六', id: '6' },
        { name: '周日', id: '7' }
      ],
      conditions: [],
      scopeType: 0,
      ////////// 新建活动 end ///////////
      saveLoading: false,
      ////////// 上传图片 start ///////////
      conponForm: this.$form.createForm(this, { name: 'conponForm' }),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      picUploading: false,
      ////////// 上传图片 end ///////////
      rangePickerValue: [] //日期对象清空日期用
    };
  },
  computed: {
    monthlyDayStr() {
      return param => {
        return param.join();
      };
    },
    weeklyDayStr() {
      return param => {
        let tempArr = [];
        this.weeklyDays.forEach(element => {
          param.forEach(item => {
            if (item === element.value) {
              tempArr.push(element.label);
            }
          });
        });
        return tempArr.join();
      };
    },
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
    }
  },
  methods: {
    validatorFn,
    validatorFn0,
    validatorFn1,
    moment,
    checkMonthlyDay(rule, value, callback) {
      if (this.monthlyDay.length === 0) {
        this.actModalVisible = true;
        callback(new Error('每月活动日不能为空'));
      } else {
        callback();
      }
    },
    checkWeeklyDay(rule, value, callback) {
      if (this.weeklyDay.length === 0) {
        this.actModalVisible = true;
        callback(new Error('每周活动日不能为空'));
      } else {
        callback();
      }
    },
    ////////// 新建活动:start ///////////
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
    monthlyDayModal() {
      if (this.monthlyDay.length === 0) {
        this.$message.error('每月活动日不能为空!');
        return;
      }
      this.conponForm.validateFields((err, values) => {
        console.log('monthlyDayModal validateFields err :>> ', err);
        //没有错误的情况下
      });
      this.actModalVisible = false;
    },
    weeklyDayModal() {
      if (this.weeklyDay.length === 0) {
        this.$message.error('每周活动日不能为空!');
        return;
      }
      this.conponForm.validateFields((err, values) => {
        console.log('weeklyDayModal validateFields err :>> ', err);
        //没有错误的情况下
      });
      this.actModalVisible = false;
    },
    showMonthlyDayModal() {
      this.actModalVisible = true;
    },
    showWeeklyDayModal() {
      this.actModalVisible = true;
    },
    // 打开弹窗
    handleSelectCoupon(item) {
      console.log('item :>> ', item);
      this.handleItem = item;
      this.modalVisible = true;
    },
    // 关闭弹窗
    handleModalCancel() {
      this.handleItem = null;
      this.modalVisible = false;
    },
    // 点击弹窗确定
    handleModalOk() {
      console.log('handleModalOk this.handleItem :>> ', this.handleItem);
      console.log('this.selectedRows[0] :>> ', this.selectedRows[0]);
      if (this.selectedRows.length > 0) {
        this.modalVisible = false;
        this.handleItem.couponCode = this.selectedRows[0].couTypeCode;
        this.handleItem.couponId = this.selectedRows[0].id;
        this.handleItem.startTime = this.selectedRows[0].validityStartTime;
        this.handleItem.expirationTime = this.selectedRows[0].validityEndTime;
        this.handleItem.showRedBorder = false;
        this.handleItem.couponName = this.selectedRows[0].couponTitle;
        console.log('=======', this.selectedRows);
        if (this.selectedRows[0].validityType == 1) {
          this.handleItem.couponValid = `${this.selectedRows[0].validityStartTime} - ${this.selectedRows[0].validityEndTime}`;
        } else {
          this.handleItem.couponValid = `有效天数: ${this.selectedRows[0].validityDayNums}天，${this.selectedRows[0].takeEffectDayNums}天后生效`;
        }
      } else {
        this.$message.error('必须选择一个卡券!');
      }
      this.handleItem = null;
    },
    handleDelete(index) {
      this.$delete(this.activityAwards, index);
    },
    uploadBefor(file) {
      this.file = file;
      this.$set(this.fileList1, 0, file);
      // this.fileList1[0] = file;
      console.log('uploadBefor this.fileList1 :>> ', this.fileList1);
      console.log('uploadBefor this.file :>> ', this.file);
      return false;
    },
    handleRemove1(file) {
      console.log('file :>> ', file);
      // return;
      const index = this.fileList1.indexOf(file);
      const newFileList = this.fileList1.slice();
      newFileList.splice(index, 1);
      this.fileList1 = newFileList;
      this.file = null;
      console.log('newFileList :>> ', newFileList);
      console.log('this.file :>> ', this.file);
    },
    // 获取下载模版
    getTplDownload() {
      this.downLoadTplExist = false;
      return api.getTplDownload().then(res => {
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
    getActThemeList() {
      return api
        .getActThemeList({
          pageSize: 99,
          pageIndex: 1,
          isEnable: 0
        })
        .then(res => {
          console.log('getActThemeList res :>> ', res);
          if (res.code === 200) {
            this.activityThemeIds.splice(1, this.activityThemeIds.length);
            res.data.records.forEach(element => {
              let tempObj = {};
              tempObj.name = element.themeName;
              tempObj.code = element.id;
              this.activityThemeIds.push(tempObj);
            });
            this.activityThemeId = this.activityThemeIds[0].code;
            console.log('getActThemeList this.activityThemeIds :>> ', this.activityThemeIds);
          }
        });
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
      return api
        .getCouponList(args)
        .finally(() => {
          this.tableLoading = false;
        })
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
        });
    },
    ////////// 新建活动:end ///////////
    disabledDate(currentParam) {
      return currentParam && currentParam < Date.now() - 86400000;
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
                    activityCover: res.data
                  });
                  this.$set(this.fileList, 0, {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: res.data ? res.data : ''
                  });
                  this.activityCover = res.data ? res.data : '';
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
      this.activityCover = '';
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
                that.activityCover = '';
                that.conponForm.setFieldsValue({
                  activityCover: ''
                });
              }
            });
        }
      });
    },
    handlePreviewCancel() {
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
    handleCancel() {
      this.$router.replace({ path: '/actManage' });
    },
    handleRangePicker(dates, dateStrings) {
      console.log('handleRangePicker dates :>> ', dates);
      console.log('handleRangePicker dateStrings :>> ', dateStrings);
      this.rangePickerValue = dates;
      this.validityStartTime = dateStrings[0];
      this.validityEndTime = dateStrings[1];
    },
    //输入框
    activityNameChange(e) {
      this.activityName = e.target.value;
    },
    perPersonDayLimitChange(value) {
      console.log('perPersonDayLimitChange this.awardFormindex :>> ', this.awardFormindex);
      console.log('perPersonDayLimitChange valuevalue :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'perPersonDayLimit', value);
    },
    perDayLimitChange(value) {
      console.log('perDayLimitChange this.awardFormindex :>> ', this.awardFormindex);
      console.log('perDayLimitChange value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'perDayLimit', value);
    },
    perPersonLimitChange(value) {
      console.log('perPersonLimitChange this.awardFormindex :>> ', this.awardFormindex);
      console.log('perPersonLimitChange value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'perPersonLimit', value);
    },
    integrealCountChange(value) {
      console.log('integrealCountChange this.awardFormindex :>> ', this.awardFormindex);
      console.log('integrealCountChange value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'integrealCount', value);
    },
    issuedCountChange(value) {
      console.log('issuedCountChange this.awardFormindex :>> ', this.awardFormindex);
      console.log('issuedCountChange value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'issuedCount', value);
    },
    memoChange(e) {
      this.memo = e.target.value;
    },

    //单选
    isPeriodicChange(e) {
      this.isPeriodic = e.target.value;
    },
    //多选
    checkboxChange(checkedValues) {
      console.log('checkboxChange checkedValues :>> ', checkedValues);
      this.checkboxValue.splice(0, this.checkboxValue.length);
      checkedValues.forEach(element => {
        this.checkboxValue.push(element);
      });
    },
    monthlyDayChange(checkedValues) {
      console.log('monthlyDayChange checkedValues :>> ', checkedValues);
      this.monthlyDay.splice(0, this.monthlyDay.length);
      checkedValues.forEach(element => {
        this.monthlyDay.push(element);
      });
    },
    weeklyDayChange(checkedValues) {
      console.log('weeklyDayChange checkedValues :>> ', checkedValues);
      this.weeklyDay.splice(0, this.weeklyDay.length);
      checkedValues.forEach(element => {
        this.weeklyDay.push(element);
      });
    },
    clientIdChange(checkedValues) {
      console.log('clientIdChange checkedValues :>> ', checkedValues);
      this.clientId.splice(0, this.clientId.length);
      checkedValues.forEach(element => {
        this.clientId.push(element);
      });
    },

    //下拉
    rightsTypeSelect(value) {
      console.log('rightsTypeSelect');
      this.rightsType = value;
    },
    themeIdSelect(value) {
      console.log('themeIdSelect value :>> ', value);
      this.activityThemeId = value;
    },
    typeIdSelect(value) {
      console.log('typeIdSelect value :>> ', value);
      this.typeId = value;
    },
    startLevelIdSelect(value) {
      console.log('startLevelIdSelect value :>> ', value);
      this.startLevelId = value;
    },
    endLevelIdSelect(value) {
      console.log('endLevelIdSelect value :>> ', value);
      this.endLevelId = value;
    },
    isIncluded1Select(value) {
      console.log('isIncluded1Select value :>> ', value);
      this.isIncluded1 = value;
    },
    isIncluded2Select(value) {
      console.log('isIncluded2Select value :>> ', value);
      this.isIncluded2 = value;
    },
    conditionSelect(value) {
      console.log('conditionSelect this.awardFormindex :>> ', this.awardFormindex);
      console.log('conditionSelect value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'condition', value);
    },
    monthGetDaySelect(value) {
      console.log('monthGetDaySelect this.awardFormindex :>> ', this.awardFormindex);
      console.log('monthGetDaySelect value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'monthGetDay', value);
    },
    weekGetDaySelect(value) {
      console.log('weekGetDaySelect this.awardFormindex :>> ', this.awardFormindex);
      console.log('weekGetDaySelect value :>> ', value);
      this.$set(this.activityAwards[this.awardFormindex], 'weekGetDay', value);
    },

    addAward() {
      if (this.activityAwards.length >= 10){
        this.$warning({
          title: '提示',
          content: '最多可以添加10个奖品～'
        });
        return;
      }
      const tempObj = {
        keyIndex: `${Date.now()}-${this.activityAwards.length}`,
        couponCode: '',
        couponId: '',
        condition: '',
        startTime: '',
        expirationTime: '',
        issuedCount: '',
        integrealCount: '',
        perPersonLimit: '',
        perDayLimit: '',
        perPersonDayLimit: '',
        monthGetDay: '',
        weekGetDay: '',
        couponName: '请选择',
        couponValid: '',
        showRedBorder: false
      };

      if (this.typeId === 1) {
        tempObj.condition = 1;
      } else if (this.typeId === 3) {
        tempObj.condition = 3;
      } else if (this.typeId === 2) {
        tempObj.condition = 1;
      }

      this.activityAwards.push(tempObj);
    },
    handleSubmit(loadingType) {
      let showRedBorderNull = true;

      this.activityAwards.forEach(element => {
        if (!element.couponCode) {
          element.showRedBorder = true;
        }
      });

      for (let index = 0; index < this.activityAwards.length; index++) {
        const element = this.activityAwards[index];
        if (!element.couponCode) {
          showRedBorderNull = false;
          break;
        }
      }

      console.log('handleSubmit showRedBorderNull :>> ', showRedBorderNull);

      this.conponForm.validateFields((err, values) => {
        console.log('handleSubmit validateFields err :>> ', err);
        //没有错误的情况下
        if (!err && showRedBorderNull) {
          console.log('handleSubmit values :>> ', values);
          // return;
          this.getActCreate(loadingType);
        }
      });
    },

    getActCreate(loadingType) {
      // for (let index = 0; index < this.activityAwards.length; index++) {
      //   const element = this.activityAwards[index];
      //   if (!element.integrealCount) {
      //     element.integrealCount = 1;
      //   }
      // }

      const param = {
        file: this.file,
        activityThemeId: this.activityThemeId,
        activityName: this.activityName,
        startTime: this.validityStartTime,
        endTime: this.validityEndTime,
        memo: this.memo,
        activityCover: this.activityCover,
        typeId: this.typeId,
        rightsType: this.rightsType,
        scopeType: this.scopeType,
        clientId: this.clientId.join(),
        startLevelId: this.startLevelId,
        endLevelId: this.endLevelId,
        isPeriodic: this.isPeriodic,
        monthlyDay: this.monthlyDay.join(),
        weeklyDay: this.weeklyDay.join(),
        activityAwards: JSON.stringify(this.activityAwards)
      };

      console.log('getActCreate param :>> ', param);
      // return;

      const paramFormData = Object.keys(param).reduce((pre, key) => {
        pre.append([key], param[key]);
        return pre;
      }, new FormData());

      //第二种
      for (let [a, b] of paramFormData.entries()) {
        console.log('getActCreate: ', a, ' || ', b);
      }

      this[loadingType] = true;
      // return;
      api
        .getActCreate(paramFormData)
        .finally(() => {
          this[loadingType] = false;
        })
        .then(res => {
          console.log('getActCreate res :>> ', res);
          if (res.code === 200) {
            console.log('res.data :>> ', res.data);
            this.$router.replace({ path: '/actManage' });
          }
        });
    },
    async initData() {
      await this.getCouponList();
      await this.getTplDownload();
      await this.getActThemeList();
      // await this.getActDetail();
    }
  },
  created() {
    console.log('this.$route :>> ', this.$route);
    this.initData();
  },
  mounted() {},
  watch: {
    actRadioValue: {
      handler(newVal) {
        console.log('watch actRadioValue newVal :>> ', newVal);
        if (newVal === 1) {
          this.weeklyDay = [];
        }
        if (newVal === 2) {
          this.monthlyDay = [];
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    scopeType: {
      handler(newVal) {
        console.log('watch scopeType newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    typeId: {
      handler(newVal) {
        console.log('watch typeId newVal :>> ', newVal);
        if (newVal === 2) {
          this.conditions = [
            { name: '手动领取', id: 1 },
            { name: '邦豆兑换', id: 3 }
          ];
        } else if (newVal === 1) {
          this.conditions = [{ name: '手动领取', id: 1 }];
        } else if (newVal === 3) {
          this.conditions = [{ name: '邦豆兑换', id: 3 }];
        }
        //重置遍历中的condition
        // this.$nextTick(() => {
        this.activityAwards.forEach((element, index) => {
          const tempKey = `condition-${index}`;
          if (newVal === 2) {
            element.condition = 1;
            this.conponForm.setFieldsValue({
              [tempKey]: 1
            });
          } else if (newVal === 1) {
            element.condition = 1;
            this.conponForm.setFieldsValue({
              [tempKey]: 1
            });
          } else if (newVal === 3) {
            element.condition = 3;
            this.conponForm.setFieldsValue({
              [tempKey]: 3
            });
          }
        });
        // });
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    startLevelId: {
      handler(newVal) {
        console.log('watch startLevelId newVal :>> ', newVal);
        if (this.startLevelId > this.endLevelId) {
          this.endLevelId = this.startLevelId;
          this.conponForm.setFieldsValue({
            endLevelId: this.startLevelId
          });
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    endLevelId: {
      handler(newVal) {
        console.log('watch endLevelId newVal :>> ', newVal);
        if (this.endLevelId < this.startLevelId) {
          this.startLevelId = this.endLevelId;
          this.conponForm.setFieldsValue({
            startLevelId: this.endLevelId
          });
        }
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
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
    activityAwards: {
      handler(newVal) {
        console.log('watch activityAwards newVal :>> ', newVal);
      },
      immediate: true, //刷新加载立马触发一次handler
      deep: true
    },
    activityCover: {
      handler(newVal) {
        console.log('watch activityCover newVal :>> ', newVal);
        this.activityCover = this.activityCover.replace(/\s+/g, ''); //去除image url空格
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
.ant-modal-root {
  ::v-deep .ant-col-12 {
    width: 100% !important;
  }
}
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
