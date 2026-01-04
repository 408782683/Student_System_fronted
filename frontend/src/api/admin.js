import request from "./request.js";

export const fetchStudents = () => request.get("/api/admin/students");
export const saveStudent = (payload) => request.post("/api/admin/student", payload);
export const deleteStudent = (id) => request.delete(`/api/admin/student/${id}`);

export const fetchTeachers = () => request.get("/api/admin/teachers");
export const saveTeacher = (payload) => request.post("/api/admin/teacher", payload);
export const deleteTeacher = (id) => request.delete(`/api/admin/teacher/${id}`);

export const fetchColleges = () => request.get("/api/admin/colleges");
export const fetchMajors = (collegeId) =>
  request.get("/api/admin/majors", { params: { collegeId } });
export const fetchClazzes = (majorId) =>
  request.get("/api/admin/clazzes", { params: { majorId } });

export const saveCollege = (payload) => request.post("/api/admin/college", payload);
export const saveMajor = (payload) => request.post("/api/admin/major", payload);
export const saveClazz = (payload) => request.post("/api/admin/clazz", payload);

export const fetchCourses = () => request.get("/api/admin/courses");
export const saveCourse = (payload) => request.post("/api/admin/course", payload);

export const fetchPlans = (term, majorId) =>
  request.get("/api/admin/plans", { params: { term, majorId } });
export const savePlan = (payload) => request.post("/api/admin/plan", payload);

export const fetchAssignments = (term) =>
  request.get("/api/admin/assignments", { params: { term } });
export const saveAssignment = (payload) => request.post("/api/admin/assignment", payload);

export const uploadTimetable = (params, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.post("/api/admin/timetable", formData, { params });
};
export const fetchTimetables = (ownerType, ownerId, term) =>
  request.get("/api/admin/timetables", { params: { ownerType, ownerId, term } });
