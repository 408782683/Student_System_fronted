import request from "./request.js";

export const changeStudentPassword = (payload) =>
  request.post("/api/student/password", payload);

export const selectCourse = (studentId, courseId, term) =>
  request.post("/api/student/course/select", null, { params: { studentId, courseId, term } });

export const fetchStudentGrades = (studentId) =>
  request.get("/api/student/grades", { params: { studentId } });

export const fetchSelectedCourses = (studentId) =>
  request.get("/api/student/courses", { params: { studentId } });

export const downloadStudentTimetable = (studentId, term) =>
  request.get("/api/student/timetable", { params: { studentId, term } });
