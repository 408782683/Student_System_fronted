<template>
  <div class="grid">
    <el-card>
      <template #header>
        <div class="header">
          <span>选课</span>
          <el-input v-model="term" placeholder="学期" style="width: 180px" />
        </div>
      </template>
      <el-form :inline="true" @submit.prevent>
        <el-form-item label="课程ID">
          <el-input-number v-model="courseId" :min="1" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="select">选课</el-button>
        </el-form-item>
      </el-form>

      <el-divider>已选课程</el-divider>
      <el-table :data="selectedCourses" v-loading="loadingCourses">
        <el-table-column prop="courseId" label="课程ID" width="120" />
        <el-table-column prop="term" label="学期" width="120" />
      </el-table>
    </el-card>

    <el-card>
      <template #header><span>成绩与课表</span></template>
      <el-button type="primary" @click="loadGrades">查看成绩</el-button>
      <el-table :data="grades" style="margin-top: 8px" v-loading="loadingGrades">
        <el-table-column prop="courseId" label="课程ID" width="120" />
        <el-table-column prop="term" label="学期" width="120" />
        <el-table-column prop="score" label="分数" width="100" />
      </el-table>

      <el-divider>课表下载</el-divider>
      <el-input v-model="term" placeholder="学期" style="width: 180px; margin-bottom: 8px" />
      <el-button @click="downloadTimetableFile">下载课表</el-button>
    </el-card>

    <el-card>
      <template #header><span>密码管理</span></template>
      <el-form :model="passwordForm" label-width="120px" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePassword">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  selectCourse,
  fetchSelectedCourses,
  fetchStudentGrades,
  downloadStudentTimetable,
  changeStudentPassword
} from "../../api/student.js";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const studentId = user.id;
const term = ref("2024-2025-1");
const courseId = ref(null);
const selectedCourses = ref([]);
const grades = ref([]);
const loadingCourses = ref(false);
const loadingGrades = ref(false);

const passwordFormRef = ref();
const passwordForm = reactive({
  username: user.username,
  oldPassword: "",
  newPassword: ""
});

const passwordRules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }]
};

const loadSelectedCourses = async () => {
  loadingCourses.value = true;
  try {
    const res = await fetchSelectedCourses(studentId);
    selectedCourses.value = res.data || [];
  } finally {
    loadingCourses.value = false;
  }
};

const select = async () => {
  if (!term.value || !courseId.value) {
    ElMessage.warning("请填写学期和课程ID");
    return;
  }
  await selectCourse(studentId, courseId.value, term.value);
  ElMessage.success("选课成功");
  loadSelectedCourses();
};

const loadGrades = async () => {
  loadingGrades.value = true;
  try {
    const res = await fetchStudentGrades(studentId);
    grades.value = res.data || [];
  } finally {
    loadingGrades.value = false;
  }
};

const downloadTimetableFile = async () => {
  if (!term.value) {
    ElMessage.warning("请先填写学期");
    return;
  }
  await downloadStudentTimetable(studentId, term.value);
  ElMessage.success("课表下载请求已发送（示例）");
};

const changePassword = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) return;
    await changeStudentPassword(passwordForm);
    ElMessage.success("密码修改成功");
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
  });
};

onMounted(() => {
  loadSelectedCourses();
  loadGrades();
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
