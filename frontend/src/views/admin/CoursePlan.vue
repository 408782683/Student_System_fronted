<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>培养计划管理</span>
        <el-button type="primary" @click="openPlanDialog()">新增计划</el-button>
      </div>
    </template>
    <el-form :inline="true" class="filter-form" @submit.prevent>
      <el-form-item label="学期">
        <el-input v-model="filters.term" placeholder="2024-2025-1" />
      </el-form-item>
      <el-form-item label="专业">
        <el-select v-model="filters.majorId" placeholder="请选择专业" filterable>
          <el-option
            v-for="major in majors"
            :key="major.id"
            :label="major.name"
            :value="major.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="load">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="plans" style="width: 100%" v-loading="loading">
      <el-table-column prop="term" label="学期" width="120" />
      <el-table-column prop="majorId" label="专业ID" width="120" />
      <el-table-column prop="courseId" label="课程ID" width="120" />
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="新增培养计划" width="520px">
    <el-form :model="form" label-width="96px" :rules="rules" ref="formRef">
      <el-form-item label="学期" prop="term">
        <el-input v-model="form.term" placeholder="如 2024-2025-1" />
      </el-form-item>
      <el-form-item label="所属学院" prop="collegeId">
        <el-select v-model="selectedCollege" placeholder="请选择学院" filterable>
          <el-option
            v-for="college in colleges"
            :key="college.id"
            :label="college.name"
            :value="college.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="专业" prop="majorId">
        <el-select v-model="form.majorId" placeholder="请选择专业" filterable>
          <el-option
            v-for="major in filteredMajors"
            :key="major.id"
            :label="major.name"
            :value="major.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="form.courseId" placeholder="请选择课程" filterable>
          <el-option
            v-for="course in courses"
            :key="course.id"
            :label="`${course.name} (${course.code})`"
            :value="course.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  fetchPlans,
  savePlan,
  fetchColleges,
  fetchMajors,
  fetchCourses
} from "../../api/admin.js";

const filters = reactive({
  term: "",
  majorId: null
});

const plans = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
  term: "",
  majorId: null,
  courseId: null
});

const colleges = ref([]);
const majors = ref([]);
const courses = ref([]);
const selectedCollege = ref(null);

const rules = {
  term: [{ required: true, message: "请输入学期", trigger: "blur" }],
  majorId: [{ required: true, message: "请选择专业", trigger: "change" }],
  courseId: [{ required: true, message: "请选择课程", trigger: "change" }]
};

const filteredMajors = computed(() =>
  majors.value.filter((m) => !selectedCollege.value || m.collegeId === selectedCollege.value)
);

const loadBase = async () => {
  const [collegeRes, courseRes] = await Promise.all([fetchColleges(), fetchCourses()]);
  colleges.value = collegeRes.data || [];
  courses.value = courseRes.data || [];
  const majorsList = [];
  for (const college of colleges.value) {
    const majorRes = await fetchMajors(college.id);
    majorsList.push(...(majorRes.data || []));
  }
  majors.value = majorsList;
};

const load = async () => {
  if (!filters.term || !filters.majorId) {
    plans.value = [];
    return;
  }
  loading.value = true;
  try {
    const res = await fetchPlans(filters.term, filters.majorId);
    plans.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

const openPlanDialog = () => {
  Object.assign(form, { term: "", majorId: null, courseId: null });
  dialogVisible.value = true;
};

const save = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await savePlan(form);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    filters.term = form.term;
    filters.majorId = form.majorId;
    load();
  });
};

onMounted(async () => {
  await loadBase();
});
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
