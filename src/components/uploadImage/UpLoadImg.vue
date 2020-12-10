<template>
    <div class="upload">
        <a-upload
            name="file"
            list-type="picture"
            :file-list="imgList"
            :customRequest="onChangeImg"
            :before-upload="beforeUpload"
            :remove="onRemove"
            @preview="onPreview"
            :disabled="disabled"
            :multiple="true"
            >
            <div class="upload-wrap">
                <div class="icon"><a-icon :type="loading ? 'loading' : 'upload'" /></div>
                <div class="up-text">上传图片</div>
            </div>
        </a-upload>

        <!-- 预览图片弹框 -->
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img class="img" alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
import api from "@/api";

export default {
    name:"UpLoadImg",
    props: {
        fileList:{ // 图片列表
            type: Array,
            default: () => []
        },
        disabled:{ // 是否禁用
            type: Boolean,
            default: false
        }
    },
    watch:{
        fileList: {
            handler(newVal) {
                this.imgList = JSON.parse(JSON.stringify(newVal))
            },
            deep: true,
            immediate: true, //立即执行
        }
    },
    data() {
        return {
            loading: false,
            previewVisible: false,
            previewImage: undefined,
            imgList: []
        };
    },
    methods: {
        // 上传
        onChangeImg(info){
            console.log(info)
            const formData = new FormData();
                formData.append("file", info.file);
                this.loading = true
                api.uploadRectificationrecord(formData).then(res => {
                    console.log(res)
                    this.loading = false
                    if(res.code){
                        if (this.fileList.length >= 9) {
                            this.$message.warning("上传图片不能超过九张");
                        } else {
                            this.imgList.push({
                                uid: res.data.documentId,
                                name: res.data.fileName,
                                thumbUrl: res.data.url,
                                ...res.data
                            })
                        }
                        this.$emit('onChange',{data: this.imgList})
                    }
                }).catch(() => {
                    this.loading = false;
                    this.$message.warning("服务异常，请稍后重试");
                })
        },

        beforeUpload(file) {
            this.$emit('click')
            const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png"
            if (!isJpgOrPng) {
                this.$message.error("图片格式只能为jpeg、jpg、png!");
            }
            const isLt2M = file.size / 1024 / 1024 < 5;
            if (!isLt2M) {
                this.$message.error("图片大小不能超过5MB!");
            }
            return isJpgOrPng && isLt2M;
        },

        // 预览
        onPreview(file){
            // console.log(file)
            this.previewImage = file.thumbUrl
            this.previewVisible = true
        },
        onRemove(info){
            // console.log(info)
            let obj = info.file ? info.file.response : info // 去除包含url路径的数组
            let removeImg = obj.documentId // 删除的图片
            let newArr = this.imgList.filter(e => e.documentId != removeImg) // 过滤点删除的图片
            this.imgList = newArr
            this.$emit('onChange',{data: this.imgList})
        },
    }
};
</script>

<style lang="less" scoped>
    ::v-deep .ant-upload{
        width: 100% !important;
        height: 100px;
    }
    .upload-wrap{
        width:100%;
        height: 100%;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        background: rgb(241, 241, 241);
        border:1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        box-sizing: border-box;
        &:hover{
            color: rgb(24, 144, 255);
            border:1px dashed rgb(24, 144, 255);
            transition: all .9s;
            background:rgb(248, 248, 248);
        }
        .icon{
            width: 100%;
            text-align: center;
            font-size: 25px;
        }
        .up-text{
            font-size: 14px;
            width: 100%;
            text-align: center;
        }
    }
</style>
