<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>课表上传与下载</span>
      </div>
    </template>

    <el-form :inline="true" class="filter-form" @submit.prevent>
      <el-form-item label="所属类型">
        <el-select v-model="filters.ownerType" placeholder="教师或专业">
          <el-option label="教师" value="TEACHER" />
          <el-option label="专业" value="MAJOR" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属ID">
        <el-input-number v-model="filters.ownerId" :min="1" />
      </el-form-item>
      <el-form-item label="学期">
        <el-input v-model="filters.term" placeholder="2024-2025-1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
      </el-form-item>
    </el-form>

    <el-upload
      drag
      :auto-upload="false"
      :on-change="onFileChange"
      accept=".pdf,.xlsx,.xls"
      style="margin-bottom: 16px"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽或点击上传课表（PDF / Excel）</div>
      <template #tip>
        <div class="el-upload__tip">选择文件后点击“上传课表”完成提交</div>
      </template>
    </el-upload>
    <el-button type="primary" :loading="uploading" @click="upload">上传课表</el-button>

    <el-divider>已上传课表</el-divider>
    <el-table :data="timetables" style="width: 100%" v-loading="loading">
      <el-table-column prop="term" label="学期" width="120" />
      <el-table-column prop="ownerType" label="类型" width="120" />
      <el-table-column prop="ownerId" label="ID" width="120" />
      <el-table-column prop="fileName" label="文件名" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-link type="primary" :href="row.fileUrl" target="_blank">下载</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { fetchTimetables, uploadTimetable } from "../../api/admin.js";

const filters = reactive({
  ownerType: "TEACHER",
  ownerId: null,
  term: ""
});

const timetables = ref([]);
const file = ref(null);
const uploading = ref(false);
const loading = ref(false);

const onFileChange = (uploadFile) => {
  file.value = uploadFile.raw;
};

const load = async () => {
  if (!filters.ownerType || !filters.term) return;
  loading.value = true;
  try {
    const res = await fetchTimetables(filters.ownerType, filters.ownerId, filters.term);
    timetables.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

const upload = async () => {
  if (!file.value) {
    ElMessage.warning("请先选择文件");
    return;
  }
  if (!filters.ownerType || !filters.term || !filters.ownerId) {
    ElMessage.warning("请完善所属类型、ID和学期");
    return;
  }
  uploading.value = true;
  try {
    await uploadTimetable(filters, file.value);
    ElMessage.success("上传成功");
    file.value = null;
    load();
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.filter-form {
  margin-bottom: 12px;
}
</style>
