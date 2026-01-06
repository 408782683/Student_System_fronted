import request from "./request.js";

export const changeTeacherPassword = (payload) =>
  request.post("/api/teacher/password", payload);

export const fetchAssignments = (teacherId, term) =>
  request.get("/api/teacher/assignments", { params: { teacherId, term } });

export const fetchGrades = (teacherId, term) =>
  request.get("/api/teacher/grades", { params: { teacherId, term } });

export const submitGrade = (payload) => request.post("/api/teacher/grade", payload);

export const downloadTimetable = (teacherId, term) =>
  request.get("/api/teacher/timetable", { params: { teacherId, term } });

export const exportRoster = (classId, term) =>
  request.get("/api/teacher/roster/export", {
    params: { classId, term },
    responseType: "blob"
  });
