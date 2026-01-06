<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>教学任务分配</span>
        <el-button type="primary" @click="openDialog()">新增任务</el-button>
      </div>
    </template>
    <el-form :inline="true" class="filter-form" @submit.prevent>
      <el-form-item label="学期">
        <el-input v-model="filters.term" placeholder="2024-2025-1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="assignments" style="width: 100%" v-loading="loading">
      <el-table-column prop="termPlanId" label="培养计划ID" width="140" />
      <el-table-column prop="teacherId" label="教师ID" width="120" />
      <el-table-column prop="courseType" label="课程类型" width="140" />
      <el-table-column prop="remarks" label="备注" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新增教学任务" width="520px">
    <el-form :model="form" label-width="96px" :rules="rules" ref="formRef">
      <el-form-item label="培养计划ID" prop="termPlanId">
        <el-input-number v-model="form.termPlanId" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="教师ID" prop="teacherId">
        <el-input-number v-model="form.teacherId" :min="1" style="width: 100%" />
      </el-form-item>
      <el-form-item label="课程类型" prop="courseType">
        <el-select v-model="form.courseType" placeholder="请选择">
          <el-option label="基础课" value="基础课" />
          <el-option label="专业课" value="专业课" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { fetchAssignments, saveAssignment } from "../../api/admin.js";

const filters = reactive({
  term: ""
});
const assignments = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
  termPlanId: null,
  teacherId: null,
  courseType: "基础课",
  remarks: ""
});

const rules = {
  termPlanId: [{ required: true, message: "请输入培养计划ID", trigger: "blur" }],
  teacherId: [{ required: true, message: "请输入教师ID", trigger: "blur" }],
  courseType: [{ required: true, message: "请选择课程类型", trigger: "change" }]
};

const load = async () => {
  if (!filters.term) {
    assignments.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await fetchAssignments(filters.term);
    assignments.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

const openDialog = () => {
  Object.assign(form, {
    termPlanId: null,
    teacherId: null,
    courseType: "基础课",
    remarks: ""
  });
  dialogVisible.value = true;
};

const save = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await saveAssignment(form);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    load();
  });
};

onMounted(load);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.filter-form {
  margin-bottom: 12px;
}
</style>
