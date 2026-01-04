<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>教师管理</span>
        <el-button type="primary" @click="openDialog()">新增教师</el-button>
      </div>
    </template>
    <el-table :data="teachers" style="width: 100%" v-loading="loading">
      <el-table-column prop="teacherNo" label="工号" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="title" label="职称" width="120" />
      <el-table-column prop="phone" label="电话" width="140" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="hiredDate" label="入职日期" width="140" />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-popconfirm title="确定删除该教师吗？" @confirm="remove(row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="教师信息" width="520px">
    <el-form :model="form" label-width="96px" :rules="rules" ref="formRef">
      <el-form-item label="工号" prop="teacherNo">
        <el-input v-model="form.teacherNo" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="职称" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="入职日期" prop="hiredDate">
        <el-date-picker v-model="form.hiredDate" type="date" style="width: 100%" />
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
import { fetchTeachers, saveTeacher, deleteTeacher } from "../../api/admin.js";

const teachers = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const formRef = ref();
const form = reactive({
  id: null,
  teacherNo: "",
  name: "",
  title: "",
  phone: "",
  email: "",
  hiredDate: "",
  collegeId: null,
  photoUrl: ""
});

const rules = {
  teacherNo: [{ required: true, message: "请输入工号", trigger: "blur" }],
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  hiredDate: [{ required: true, message: "请选择入职日期", trigger: "change" }]
};

const load = async () => {
  loading.value = true;
  try {
    const res = await fetchTeachers();
    teachers.value = res.data || [];
  } finally {
    loading.value = false;
  }
};

const openDialog = (row) => {
  Object.assign(form, {
    id: row?.id || null,
    teacherNo: row?.teacherNo || "",
    name: row?.name || "",
    title: row?.title || "",
    phone: row?.phone || "",
    email: row?.email || "",
    hiredDate: row?.hiredDate || "",
    collegeId: row?.collegeId || null,
    photoUrl: row?.photoUrl || ""
  });
  dialogVisible.value = true;
};

const save = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    await saveTeacher(form);
    ElMessage.success("保存成功");
    dialogVisible.value = false;
    load();
  });
};

const remove = async (id) => {
  await deleteTeacher(id);
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
