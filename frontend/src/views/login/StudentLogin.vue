<template>
  <div class="login-page">
    <div class="login-card">
      <h2>学生登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="学号或账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-row">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <el-button @click="fetchCaptcha" :loading="loadingCaptcha">获取验证码</el-button>
            <span class="captcha-text">{{ captchaValue }}</span>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submit">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="footer-links">
        <el-link type="primary" @click="goTeacher">我是老师</el-link>
        <el-link type="primary" @click="goAdmin">我是管理员</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "../../api/request.js";

const router = useRouter();
const formRef = ref();
const form = reactive({
  username: "",
  password: "",
  captcha: "",
  captchaKey: "",
  role: "STUDENT"
});
const captchaValue = ref("");
const loadingCaptcha = ref(false);
const submitting = ref(false);

const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
};

const fetchCaptcha = async () => {
  loadingCaptcha.value = true;
  try {
    form.captchaKey = `${form.role}-${form.username || "guest"}`;
    const res = await request.get("/api/auth/captcha", { params: { key: form.captchaKey } });
    captchaValue.value = res.data;
  } finally {
    loadingCaptcha.value = false;
  }
};

const handleSuccess = (data) => {
  localStorage.setItem("token", data.token || "mock-token");
  localStorage.setItem("role", data.role);
  localStorage.setItem("user", JSON.stringify(data));
  if (data?.id) {
    localStorage.setItem("userId", String(data.id));
  }
  router.replace("/student/courses");
};

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    submitting.value = true;
    try {
      const res = await request.post("/api/auth/login", form);
      handleSuccess(res.data);
    } catch {
      ElMessage.error("登录失败，请检查账号、密码及角色");
    } finally {
      submitting.value = false;
    }
  });
};

const goTeacher = () => router.push("/teacher-login");
const goAdmin = () => router.push("/admin-login");
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.login-card {
  width: 380px;
  background: #fff;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.captcha-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.captcha-text {
  font-weight: bold;
  color: #409eff;
}

.footer-links {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
</style>
