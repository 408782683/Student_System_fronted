<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>学生管理</span>
        <el-button type="primary" @click="openDialog()">新增学生</el-button>
      </div>
    </template>
    <el-table :data="students" style="width: 100%" v-loading="loading">
      <el-table-column prop="studentNo" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="gender" label="性别" width="80" />
      <el-table-column prop="phone" label="电话" width="140" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="enrollmentDate" label="入学日期" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除该学生吗？" @confirm="remove(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="学生信息" width="520px">
    <el-form :model="form" label-width="96px" :rules="rules" ref="formRef">
      <el-form-item label="学号" prop="studentNo">
        <el-input v-model="form.studentNo" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="所属班级" prop="classId">
        <el-select v-model="form.classId" placeholder="请选择班级" filterable>
          <el-option
            v-for="clazz in clazzes"
            :key="clazz.id"
            :label="clazz.name"
            :value="clazz.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入学日期" prop="enrollmentDate">
        <el-date-picker v-model="form.enrollmentDate" type="date" style="width: 100%" />
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
import {
  fetchStudents,
  saveStudent,
  deleteStudent,
  fetchClazzes,
  fetchMajors,
  fetchColleges
} from "../../api/admin.js";

const students = ref([]);
const clazzes = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
  id: null,
  studentNo: "",
  name: "",
  gender: "",
  phone: "",
  email: "",
  classId: null,
  photoUrl: "",
  enrollmentDate: ""
});

const rules = {
  studentNo: [{ required: true, message: "请输入学号", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  classId: [{ required: true, message: "请选择班级", trigger: "change" }],
  enrollmentDate: [{ required: true, message: "请选择入学日期", trigger: "change" }]
};

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchStudents();
    students.value = res.data || [];
    await preloadClazzes();
  } finally {
    loading.value = false;
  }
};

const preloadClazzes = async () => {
  const colleges = await fetchColleges();
  const allClazzes = [];
  for (const college of colleges.data || []) {
    const majors = await fetchMajors(college.id);
    for (const major of majors.data || []) {
      const clazzRes = await fetchClazzes(major.id);
      allClazzes.push(...(clazzRes.data || []));
    }
  }
  clazzes.value = allClazzes;
};

const openDialog = (row) => {
  Object.assign(form, {
    id: row?.id || null,
    studentNo: row?.studentNo || "",
    name: row?.name || "",
    gender: row?.gender || "",
    phone: row?.phone || "",
    email: row?.email || "",
    classId: row?.classId || null,
    photoUrl: row?.photoUrl || "",
    enrollmentDate: row?.enrollmentDate || ""
  });
  dialogVisible.value = true;
};

const save = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await saveStudent(form);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    load();
  });
};

const remove = async (id) => {
  await deleteStudent(id);
  ElMessage.success("删除成功");
  load();
};

onMounted(load);
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
