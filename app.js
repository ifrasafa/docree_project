document.addEventListener("DOMContentLoaded", function(){

  let presentStudents = [];
  let submittedStudents = [];
  let submittedCount = 0;
  let deadline = "";
  let attendanceActive = false;
  let timerInterval;
  let parentMessages = [];

  const roleBox = document.getElementById("roleBox");
  const teacherBox = document.getElementById("teacherBox");
  const studentBox = document.getElementById("studentBox");
  const parentBox = document.getElementById("parentBox");

  const className = document.getElementById("className");
  const strength = document.getElementById("strength");

  const total = document.getElementById("total");
  const present = document.getElementById("present");
  const absent = document.getElementById("absent");
  const presentList = document.getElementById("presentList");

  const submittedSpan = document.getElementById("submitted");
  const notSubmitted = document.getElementById("notSubmitted");
  const studentDeadline = document.getElementById("studentDeadline");
  const studentNotice = document.getElementById("studentNotice");

  const parentClass = document.getElementById("parentClass");
  const pTotal = document.getElementById("pTotal");
  const pPresent = document.getElementById("pPresent");
  const pAbsent = document.getElementById("pAbsent");
  const parentPresentList = document.getElementById("parentPresentList");
  const parentReply = document.getElementById("parentReply");
  const parentNotice = document.getElementById("parentNotice");

  const noticeText = document.getElementById("noticeText");
  const replyText = document.getElementById("replyText");

  const studentNameInput = document.getElementById("studentName");
  const attendanceBtn = document.getElementById("attendanceBtn");
  const timerDisplay = document.getElementById("timerDisplay");

  // ROLE SELECTION
  document.getElementById("btnTeacher").addEventListener("click", () => {
    roleBox.classList.add("hidden");
    teacherBox.classList.remove("hidden");
    updateAttendance();
    updateSubmission();
  });

  document.getElementById("btnStudent").addEventListener("click", () => {
    roleBox.classList.add("hidden");
    studentBox.classList.remove("hidden");
  });

  document.getElementById("btnParent").addEventListener("click", () => {
    roleBox.classList.add("hidden");
    parentBox.classList.remove("hidden");
  });

  // BACK BUTTONS
  document.querySelectorAll(".backBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      teacherBox.classList.add("hidden");
      studentBox.classList.add("hidden");
      parentBox.classList.add("hidden");
      roleBox.classList.remove("hidden");
      stopAttendanceTimer();
    });
  });

  // ATTENDANCE TIMER (20 SEC)
  attendanceBtn.addEventListener("click", () => {
    startAttendanceTimer(20);
  });

  function startAttendanceTimer(seconds){
    attendanceActive = true;
    let timeLeft = seconds;
    timerDisplay.innerHTML = `<span class="badge badge-success">Attendance Open: ${timeLeft}s</span>`;
    attendanceBtn.disabled = true;

    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.innerHTML = `<span class="badge badge-success">Attendance Open: ${timeLeft}s</span>`;
      if(timeLeft <= 0){
        stopAttendanceTimer();
      }
    },1000);
  }

  function stopAttendanceTimer(){
    attendanceActive = false;
    clearInterval(timerInterval);
    timerDisplay.innerHTML = `<span class="badge badge-danger">Attendance Closed</span>`;
    attendanceBtn.disabled = false;
  }

  // STUDENT MARK ATTENDANCE
  document.getElementById("btnMarkSelfPresent").addEventListener("click", function(){
    if(!attendanceActive){
      alert("Attendance is not open!");
      return;
    }
    let studentName = studentNameInput.value.trim();
    if(studentName && !presentStudents.includes(studentName)){
      presentStudents.push(studentName);
      updateAttendance();
      alert("Marked present!");
    }
    studentNameInput.value = "";
  });

  // STUDENT SUBMIT WORK
  document.getElementById("btnSubmitWork").addEventListener("click", function(){
    let studentName = studentNameInput.value.trim();
    if(!studentName){
      alert("Enter your name to submit!");
      return;
    }
    if(!submittedStudents.includes(studentName)){
      submittedStudents.push(studentName);
      submittedCount++;
      updateSubmission();
      alert("Work submitted successfully!");
    } else {
      alert("You already submitted.");
    }
  });

  // SET DEADLINE
  document.getElementById("btnSetDeadline").addEventListener("click", function(){
    deadline = document.getElementById("deadline").value;
    studentDeadline.innerText = deadline || "Not Set";
  });

  // POST NOTICE
  document.getElementById("btnPostNotice").addEventListener("click", function(){
    studentNotice.innerText = noticeText.value;
    parentNotice.innerText = noticeText.value;
  });

  // REPLY TO PARENTS
  document.getElementById("btnSendReply").addEventListener("click", function(){
    parentReply.innerText = replyText.value;
    alert("Reply sent to parents");
  });

  // SEND REMINDER
  document.getElementById("btnSendReminder").addEventListener("click", function(){
    alert("Reminder sent to students who haven't submitted!");
  });

  // SEND PARENT MESSAGE
  document.getElementById("btnSendMessage").addEventListener("click", function(){
    let message = document.getElementById("parentMessage").value.trim();
    if(message){
      parentMessages.push(message);
      updateParentMessages();
      document.getElementById("parentMessage").value = "";
      alert("Message sent to teacher!");
    } else {
      alert("Please enter a message.");
    }
  });

  // UPDATE ATTENDANCE IN TEACHER & PARENT
  function updateAttendance(){
    let totalStudents = Number(strength.value || 0);
    total.innerText = totalStudents;
    present.innerText = presentStudents.length;
    absent.innerText = totalStudents - presentStudents.length;

    presentList.innerHTML = "";
    presentStudents.forEach(name => {
      let li = document.createElement("li");
      li.innerHTML = `<span class="badge badge-success">${name}</span>`;
      presentList.appendChild(li);
    });

    // Parent Portal
    parentClass.innerText = className.value;
    pTotal.innerText = totalStudents;
    pPresent.innerText = presentStudents.length;
    pAbsent.innerText = totalStudents - presentStudents.length;

    parentPresentList.innerHTML = "";
    presentStudents.forEach(name => {
      let li = document.createElement("li");
      li.innerHTML = `<span class="badge badge-success">${name}</span>`;
      parentPresentList.appendChild(li);
    });
  }

  // UPDATE SUBMISSION
  function updateSubmission(){
    submittedSpan.innerText = submittedCount;
    notSubmitted.innerText = (Number(strength.value) || 0) - submittedCount;

    // Show submitted names in teacher portal
    presentList.innerHTML = "";
    presentStudents.forEach(name => {
      let li = document.createElement("li");
      let status = submittedStudents.includes(name) ? 
        '<span class="badge badge-success">Submitted</span>' : 
        '<span class="badge badge-danger">Not Submitted</span>';
      li.innerHTML = `${name} - ${status}`;
      presentList.appendChild(li);
    });
  }

  // UPDATE PARENT MESSAGES
  function updateParentMessages(){
    let msgStr = parentMessages.length ? parentMessages.map(msg => `<p class="mb-1 bg-blue-50 p-2 rounded">${msg}</p>`).join("") : "No messages";
    document.getElementById("teacherMessages").innerHTML = msgStr;
  }

});