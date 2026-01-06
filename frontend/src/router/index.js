import { createRouter, createWebHistory } from "vue-router";
import StudentLogin from "../views/login/StudentLogin.vue";
import TeacherLogin from "../views/login/TeacherLogin.vue";
import AdminLogin from "../views/login/AdminLogin.vue";
import AdminLayout from "../layout/AdminLayout.vue";
import TeacherManage from "../views/admin/TeacherManage.vue";
import StudentManage from "../views/admin/StudentManage.vue";
import CoursePlan from "../views/admin/CoursePlan.vue";
import TeachingAssignment from "../views/admin/TeachingAssignment.vue";
import TimetableUpload from "../views/admin/TimetableUpload.vue";
import GradeManage from "../views/teacher/GradeManage.vue";
import CourseSelect from "../views/student/CourseSelect.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "studentLogin", component: StudentLogin, meta: { role: "STUDENT" } },
    { path: "/teacher-login", name: "teacherLogin", component: TeacherLogin, meta: { role: "TEACHER" } },
    { path: "/admin-login", name: "adminLogin", component: AdminLogin, meta: { role: "ADMIN" } },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, role: "ADMIN" },
      children: [
        { path: "", redirect: "/admin/teachers" },
        { path: "teachers", component: TeacherManage, meta: { title: "教师管理" } },
        { path: "students", component: StudentManage, meta: { title: "学生管理" } },
        { path: "plans", component: CoursePlan, meta: { title: "培养计划" } },
        { path: "assignments", component: TeachingAssignment, meta: { title: "教学任务分配" } },
        { path: "timetables", component: TimetableUpload, meta: { title: "课表上传" } }
      ]
    },
    {
      path: "/teacher",
      component: AdminLayout,
      meta: { requiresAuth: true, role: "TEACHER" },
      children: [{ path: "grades", component: GradeManage, meta: { title: "成绩管理" } }]
    },
    {
      path: "/student",
      component: AdminLayout,
      meta: { requiresAuth: true, role: "STUDENT" },
      children: [{ path: "courses", component: CourseSelect, meta: { title: "选课与课表" } }]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) {
    next({ path: "/" });
    return;
  }
  if (to.meta.role && to.meta.role !== role) {
    next({ path: "/" });
    return;
  }
  next();
});

export default router;
