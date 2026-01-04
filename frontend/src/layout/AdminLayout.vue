<template>
  <el-container style="min-height: 100vh">
    <el-aside width="220px" class="sidebar">
      <div class="logo">教务管理</div>
      <el-menu
        :default-active="activePath"
        class="menu"
        router
        background-color="#001529"
        text-color="#bfcbd9"
        active-text-color="#ffd04b"
      >
        <template v-if="role === 'ADMIN'">
          <el-menu-item index="/admin/teachers">教师管理</el-menu-item>
          <el-menu-item index="/admin/students">学生管理</el-menu-item>
          <el-menu-item index="/admin/plans">培养计划</el-menu-item>
          <el-menu-item index="/admin/assignments">教学任务分配</el-menu-item>
          <el-menu-item index="/admin/timetables">课表上传</el-menu-item>
        </template>
        <template v-else-if="role === 'TEACHER'">
          <el-menu-item index="/teacher/grades">成绩管理</el-menu-item>
        </template>
        <template v-else-if="role === 'STUDENT'">
          <el-menu-item index="/student/courses">选课与课表</el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="page-title">{{ currentTitle }}</div>
        <div class="user-info">
          <span>{{ userInfo.name || userInfo.username }}</span>
          <el-tag size="small" type="success" class="role-tag">{{ role }}</el-tag>
          <el-button link type="primary" @click="goHome">返回首页</el-button>
          <el-button link type="danger" @click="logout">退出</el-button>
        </div>
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";

const route = useRoute();
const router = useRouter();
const role = localStorage.getItem("role") || "STUDENT";
const userInfo = JSON.parse(localStorage.getItem("user") || "{}");

const activePath = computed(() => route.path);
const currentTitle = computed(() => route.meta.title || "仪表盘");

const logout = () => {
  ElMessageBox.confirm("确认退出登录？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    localStorage.clear();
    router.replace("/");
  });
};

const goHome = () => {
  router.replace("/");
};
</script>

<style scoped>
.sidebar {
  background: #001529;
  color: #fff;
  min-height: 100vh;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu {
  border-right: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-tag {
  text-transform: lowercase;
}

.content {
  padding: 20px;
  background: #f5f6f7;
}
</style>
