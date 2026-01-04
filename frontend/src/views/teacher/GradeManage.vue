<template>
  <div class="grid">
    <el-card>
      <template #header>
        <div class="header">
          <span>教学任务</span>
          <div>
            <el-input v-model="term" placeholder="学期" style="width: 180px" />
            <el-button type="primary" @click="loadAssignments">查询</el-button>
          </div>
        </div>
      </template>
      <el-table :data="assignments" v-loading="loadingAssignments">
        <el-table-column prop="termPlanId" label="计划ID" width="100" />
        <el-table-column prop="courseType" label="课程类型" width="120" />
        <el-table-column prop="remarks" label="备注" />
      </el-table>
    </el-card>

    <el-card>
      <template #header>
        <div class="header">
          <span>成绩录入</span>
          <div>
            <el-input v-model="gradeForm.term" placeholder="学期" style="width: 180px" />
            <el-button type="primary" @click="loadGrades">查询成绩</el-button>
          </div>
        </div>
      </template>
      <el-form :model="gradeForm" label-width="100px" :rules="gradeRules" ref="gradeFormRef">
        <el-form-item label="学生ID" prop="studentId">
          <el-input-number v-model="gradeForm.studentId" :min="1" />
        </el-form-item>
        <el-form-item label="课程ID" prop="courseId">
          <el-input-number v-model="gradeForm.courseId" :min="1" />
        </el-form-item>
        <el-form-item label="学期" prop="term">
          <el-input v-model="gradeForm.term" placeholder="2024-2025-1" />
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input-number v-model="gradeForm.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGrade" :loading="submitting">提交成绩</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="grades" style="margin-top: 12px" v-loading="loadingGrades">
        <el-table-column prop="studentId" label="学生ID" width="120" />
        <el-table-column prop="courseId" label="课程ID" width="120" />
        <el-table-column prop="term" label="学期" width="120" />
        <el-table-column prop="score" label="分数" width="100" />
      </el-table>
    </el-card>

    <el-card>
      <template #header><span>课表与密码</span></template>
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

      <el-divider>课表下载</el-divider>
      <el-input v-model="term" placeholder="输入学期" style="width: 180px; margin-bottom: 8px" />
      <div>
        <el-button @click="downloadTimetableFile" type="primary">下载课表</el-button>
        <el-button @click="exportRosterFile">导出点名册</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {
  changeTeacherPassword,
  fetchAssignments,
  fetchGrades,
  submitGrade as submitGradeApi,
  downloadTimetable,
  exportRoster
} from "../../api/teacher.js";

const user = JSON.parse(localStorage.getItem("user") || "{}");
const teacherId = user.id;
const term = ref("");

const assignments = ref([]);
const grades = ref([]);
const loadingAssignments = ref(false);
const loadingGrades = ref(false);
const submitting = ref(false);

const gradeFormRef = ref();
const gradeForm = reactive({
  studentId: null,
  courseId: null,
  term: "",
  score: null
});

const gradeRules = {
  studentId: [{ required: true, message: "请输入学生ID", trigger: "blur" }],
  courseId: [{ required: true, message: "请输入课程ID", trigger: "blur" }],
  term: [{ required: true, message: "请输入学期", trigger: "blur" }],
  score: [{ required: true, message: "请输入分数", trigger: "blur" }]
};

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

const loadAssignments = async () => {
  if (!term.value) return;
  loadingAssignments.value = true;
  try {
    const res = await fetchAssignments(teacherId, term.value);
    assignments.value = res.data || [];
  } finally {
    loadingAssignments.value = false;
  }
};

const loadGrades = async () => {
  if (!term.value) return;
  loadingGrades.value = true;
  try {
    const res = await fetchGrades(teacherId, term.value);
    grades.value = res.data || [];
  } finally {
    loadingGrades.value = false;
  }
};

const submitGrade = () => {
  gradeFormRef.value.validate(async (valid) => {
    if (!valid) return;
    submitting.value = true;
    try {
      await submitGradeApi({ ...gradeForm });
      ElMessage.success("成绩提交成功");
      loadGrades();
    } finally {
      submitting.value = false;
    }
  });
};

const changePassword = () => {
  passwordFormRef.value.validate(async (valid) => {
    if (!valid) return;
    await changeTeacherPassword(passwordForm);
    ElMessage.success("密码修改成功");
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
  });
};

const downloadTimetableFile = async () => {
  if (!term.value) {
    ElMessage.warning("请先填写学期");
    return;
  }
  await downloadTimetable(teacherId, term.value);
  ElMessage.success("课表下载请求已发送（示例）");
};

const exportRosterFile = async () => {
  if (!term.value) {
    ElMessage.warning("请先填写学期");
    return;
  }
  await exportRoster(1, term.value);
  ElMessage.success("点名册导出请求已发送（示例）");
};

onMounted(() => {
  term.value = "2024-2025-1";
  loadAssignments();
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
