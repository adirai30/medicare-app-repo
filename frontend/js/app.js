const API_BASE_URL = "http://localhost:5000/api";

const doctors = [
  {id:1,name:"Dr. Rahul Sharma",specialty:"Cardiology",experience:"12 years",rating:"4.9",hospital:"MediCare City Hospital",initials:"RS"},
  {id:2,name:"Dr. Ananya Mehta",specialty:"Neurology",experience:"10 years",rating:"4.8",hospital:"MediCare City Hospital",initials:"AM"},
  {id:3,name:"Dr. Arjun Kapoor",specialty:"Orthopedics",experience:"14 years",rating:"4.9",hospital:"PrimeCare Medical Center",initials:"AK"},
  {id:4,name:"Dr. Priya Nair",specialty:"Pediatrics",experience:"9 years",rating:"4.8",hospital:"MediCare Children's Hospital",initials:"PN"},
  {id:5,name:"Dr. Kavya Singh",specialty:"Dermatology",experience:"8 years",rating:"4.7",hospital:"PrimeCare Medical Center",initials:"KS"},
  {id:6,name:"Dr. Vikram Bhat",specialty:"General Medicine",experience:"15 years",rating:"4.9",hospital:"CityLife Hospital",initials:"VB"},
  {id:7,name:"Dr. Neha Verma",specialty:"Cardiology",experience:"11 years",rating:"4.8",hospital:"CityLife Hospital",initials:"NV"},
  {id:8,name:"Dr. Rohan Malhotra",specialty:"Neurology",experience:"13 years",rating:"4.8",hospital:"PrimeCare Medical Center",initials:"RM"}
];

const hospitals = [
  {id:1,name:"MediCare City Hospital",location:"Gurugram, Haryana",rating:"4.8",tags:["Multi-specialty","24/7 Emergency"],icon:"🏥"},
  {id:2,name:"PrimeCare Medical Center",location:"New Delhi",rating:"4.7",tags:["Specialist Care","Diagnostics"],icon:"🏨"},
  {id:3,name:"CityLife Hospital",location:"Noida, Uttar Pradesh",rating:"4.8",tags:["Multi-specialty","Lab Services"],icon:"🏥"}
];

const $ = (s) => document.querySelector(s);

async function loadDoctorsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/doctors`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.doctors)) {
      doctors.length = 0;

      data.doctors.forEach(doctor => {
        doctors.push({
          ...doctor,
          rating: String(doctor.rating),
          initials: doctor.name
            .split(" ")
            .filter(Boolean)
            .map(word => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        });
      });

      renderDoctors(doctors);
      populateBookingOptions();
    }

  } catch (error) {
    console.error("Failed to load doctors from backend:", error);
  }
}

async function loadHospitalsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/hospitals`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.hospitals)) {
      hospitals.length = 0;

      data.hospitals.forEach(hospital => {
        hospitals.push({
          ...hospital,
          rating: String(hospital.rating),
          tags: hospital.tags || ["Multi-specialty", "24/7 Emergency"],
          icon: hospital.icon || "🏥"
        });
      });

      renderHospitals(hospitals);
      populateBookingOptions();
    }

  } catch (error) {
    console.error("Failed to load hospitals from backend:", error);
  }
}

const $$ = (s) => [...document.querySelectorAll(s)];

let currentDoctorFilter = "all";
let bookingStep = 1;

function renderDoctors(list = doctors) {
  const grid = $("#doctorGrid");
  const empty = $("#doctorEmpty");
  grid.innerHTML = list.map(d => `
    <article class="doctor-card">
      <div class="doctor-top">
        <div class="doctor-photo">${d.initials}</div>
        <div>
          <h3>${d.name}</h3>
          <span class="specialty">${d.specialty}</span>
        </div>
      </div>
      <div class="doctor-body">
        <div class="doctor-meta"><span>★ ${d.rating}</span><span>${d.experience}</span></div>
        <div class="small-muted" style="margin-bottom:12px">📍 ${d.hospital}</div>
        <div class="card-actions">
          <button class="btn btn-outline" data-action="doctor-details" data-id="${d.id}">Details</button>
          <button class="btn btn-primary" data-action="doctor-book" data-id="${d.id}">Book</button>
        </div>
      </div>
    </article>`).join("");
  empty.classList.toggle("hidden", list.length !== 0);
}

function renderHospitals(list = hospitals) {
  $("#hospitalGrid").innerHTML = list.map(h => `
    <article class="hospital-card">
      <div class="hospital-visual">${h.icon}</div>
      <div class="hospital-body">
        <h3>${h.name}</h3>
        <p>📍 ${h.location} &nbsp; • &nbsp; ★ ${h.rating}</p>
        <div class="hospital-tags">${h.tags.map(t => `<span>${t}</span>`).join("")}</div>
        <div class="card-actions">
          <button class="btn btn-outline" data-action="hospital-details" data-id="${h.id}">View details</button>
          <button class="btn btn-primary" data-action="book-hospital" data-id="${h.id}">Book</button>
        </div>
      </div>
    </article>`).join("");
}

function openModal(id) {
  const modal = $("#" + id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $$(".modal.open").forEach(m => {m.classList.remove("open");m.setAttribute("aria-hidden","true");});
  document.body.style.overflow = "";
}

function populateBookingOptions(prefillDoctorId=null, prefillHospital=null) {
  $("#bookingHospital").innerHTML = `<option value="">Select hospital</option>` + hospitals.map(h => `<option ${prefillHospital===h.name?"selected":""}>${h.name}</option>`).join("");
  $("#bookingDoctor").innerHTML = `<option value="">Select doctor</option>` + doctors.map(d => `<option value="${d.id}" ${prefillDoctorId===d.id?"selected":""}>${d.name} — ${d.specialty}</option>`).join("");
}

function setBookingStep(step) {
  bookingStep = step;
  $$(".booking-step").forEach(s => s.classList.toggle("active", Number(s.dataset.step) === step));
  $$(".progress-step").forEach((s,i) => s.classList.toggle("active", i < step));
  if(step === 3) updateBookingSummary();
}

function openBooking(prefillDoctorId=null, prefillHospital=null, prefillTime=null) {
  populateBookingOptions(prefillDoctorId, prefillHospital);
  $("#bookingDepartment").value = prefillDoctorId ? doctors.find(d=>d.id===prefillDoctorId)?.specialty || "" : "";
  if(!$("#bookingDate").value){
    const date = new Date();
    date.setDate(date.getDate()+1);
    $("#bookingDate").value = date.toISOString().split("T")[0];
  }
  if(prefillTime) $("#bookingTime").value = prefillTime;
  setBookingStep(1);
  openModal("appointmentModal");
}

function updateBookingSummary(){
  const hospital = $("#bookingHospital").value || "Not selected";
  const doctorId = Number($("#bookingDoctor").value);
  const doctor = doctors.find(d=>d.id===doctorId);
  const department = $("#bookingDepartment").value || "Not selected";
  const date = $("#bookingDate").value ? new Date($("#bookingDate").value+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "Not selected";
  const time = $("#bookingTime").value || "Not selected";
  $("#bookingSummary").innerHTML = `<h4>Appointment summary</h4>
    <p><strong>Hospital:</strong> ${hospital}</p>
    <p><strong>Department:</strong> ${department}</p>
    <p><strong>Doctor:</strong> ${doctor ? doctor.name : "Not selected"}</p>
    <p><strong>Date & time:</strong> ${date} • ${time}</p>`;
}

function getAppointments(){
  try{return JSON.parse(localStorage.getItem("medicareAppointments") || "[]")}catch{return []}

}

async function loadAppointmentsFromAPI() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/appointments`
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.appointments)) {
      const appointments = data.appointments.map(appointment => ({
        id: appointment.id,
        patient: appointment.patientName,
        phone: appointment.phone,
        hospital: appointment.hospital,
        department: appointment.department,
        doctor: appointment.doctor,
        date: new Date(
          appointment.date + "T00:00:00"
        ).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }),
        time: appointment.time,
        reason: appointment.reason,
        status: appointment.status
      }));

      localStorage.setItem(
        "medicareAppointments",
        JSON.stringify(appointments)
      );

      renderLatestAppointment();
    }

  } catch (error) {
    console.error(
      "Failed to load appointments from backend:",
      error
    );
  }
}

function saveAppointment(appt){
  const list = getAppointments();
  list.unshift(appt);
  localStorage.setItem("medicareAppointments", JSON.stringify(list.slice(0,10)));
  renderLatestAppointment();
}
function renderLatestAppointment(){
  const list = getAppointments();
  const el = $("#latestAppointment");
  if(!list.length){
    el.innerHTML = `<div class="no-appointment"><span>📅</span><strong>No appointment booked yet</strong><p>Your confirmed appointment will appear here.</p><button class="btn btn-primary btn-small" data-action="book-appointment">Book now</button></div>`;
    return;
  }
  const a = list[0];
  el.innerHTML = `<div class="current-appt">
    <div class="appt-line"><span>Appointment ID</span><strong class="appt-id">${a.id}</strong></div>
    <div class="appt-line"><span>Patient</span><strong>${a.patient}</strong></div>
    <div class="appt-line"><span>Doctor</span><strong>${a.doctor}</strong></div>
    <div class="appt-line"><span>Hospital</span><strong>${a.hospital}</strong></div>
    <div class="appt-line"><span>Date</span><strong>${a.date} • ${a.time}</strong></div>
    <div class="appt-actions"><button class="btn btn-outline" data-action="download-appointment">Download</button><button class="btn btn-primary" data-action="cancel-latest">Cancel</button></div>
  </div>`;
}

function showSuccess(appt){
  $("#genericContent").innerHTML = `<div class="success-view">
    <div class="success-icon">✓</div>
    <h2>Appointment confirmed</h2>
    <p>Your appointment has been saved successfully in this demo.</p>
    <div class="success-details">
      <div><span>Appointment ID</span><strong>${appt.id}</strong></div>
      <div><span>Patient</span><strong>${appt.patient}</strong></div>
      <div><span>Doctor</span><strong>${appt.doctor}</strong></div>
      <div><span>Hospital</span><strong>${appt.hospital}</strong></div>
      <div><span>Date</span><strong>${appt.date}</strong></div>
      <div><span>Time</span><strong>${appt.time}</strong></div>
    </div>
    <div class="hero-actions" style="justify-content:center">
      <button class="btn btn-outline" data-action="download-appointment">Download details</button>
      <button class="btn btn-primary" data-action="close-modal">Done</button>
    </div>
  </div>`;
  openModal("genericModal");
}

function showGeneric(title, body){
  $("#genericContent").innerHTML = `<span class="eyebrow">MediCare</span><h2>${title}</h2><div>${body}</div>`;
  openModal("genericModal");
}

function showDoctorDetails(id){
  const d = doctors.find(x=>x.id===id);
  showGeneric(d.name, `<p class="small-muted">${d.specialty} • ${d.experience} experience • ★ ${d.rating}</p>
    <div class="summary-box"><p><strong>Hospital:</strong> ${d.hospital}</p><p><strong>Consultation:</strong> In-person appointment</p><p><strong>Availability:</strong> Monday–Saturday</p></div>
    <button class="btn btn-primary full" data-action="doctor-book" data-id="${d.id}">Book appointment</button>`);
}
function showHospitalDetails(id){
  const h = hospitals.find(x=>x.id===id);
  showGeneric(h.name, `<p class="small-muted">📍 ${h.location} • ★ ${h.rating}</p>
    <div class="summary-box"><p><strong>Services:</strong> ${h.tags.join(", ")}</p><p><strong>Emergency:</strong> 24/7 emergency support</p><p><strong>Appointments:</strong> Online OPD booking available</p></div>
    <button class="btn btn-primary full" data-action="book-hospital" data-id="${h.id}">Book appointment</button>`);
}

function showDashboard(){
  const list = getAppointments();
  const a = list[0];
  showGeneric("Patient Dashboard", `
    <p class="small-muted">Welcome to your MediCare patient portal.</p>
    <div class="dashboard-grid">
      <div class="dash-card"><h4>Appointments</h4><div class="dash-stat">${list.length}</div><span class="small-muted">Saved demo bookings</span></div>
      <div class="dash-card"><h4>Profile</h4><div class="dash-stat">✓</div><span class="small-muted">Patient portal active</span></div>
    </div>
    ${a ? `<div class="summary-box" style="margin-top:15px"><h4>Latest appointment</h4><p><strong>${a.doctor}</strong> — ${a.specialty}</p><p>${a.hospital}</p><p>${a.date} • ${a.time}</p><p class="appt-id">${a.id}</p></div>` : `<div class="summary-box" style="margin-top:15px"><h4>No appointments</h4><p>Book your first appointment to see it here.</p></div>`}
    <button class="btn btn-primary full" data-action="book-appointment">Book an appointment</button>`);
}

function openLogin(){
  showGeneric("Patient Login", `
    <form id="loginForm">
      <label class="booking-step active">Email or mobile<input id="loginId" required placeholder="name@example.com"></label>
      <label class="booking-step active">Password<input type="password" required placeholder="••••••••"></label>
      <button class="btn btn-primary full" type="submit">Login</button>
      <p class="small-muted" style="text-align:center;margin-top:12px">Demo login — no real account is created.</p>
    </form>`);
}

function downloadAppointment(){
  const a = getAppointments()[0];
  if(!a){showGeneric("No appointment", "<p class='small-muted'>There is no appointment to download yet.</p>");return}
  const content = `MEDICARE APPOINTMENT\n\nAppointment ID: ${a.id}\nPatient: ${a.patient}\nMobile: ${a.phone}\nHospital: ${a.hospital}\nDepartment: ${a.department}\nDoctor: ${a.doctor}\nDate: ${a.date}\nTime: ${a.time}\nReason: ${a.reason || "General consultation"}\n\nPlease carry a valid ID and arrive 15 minutes before your appointment.`;
  const blob = new Blob([content],{type:"text/plain"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href=url; link.download=`MediCare-${a.id}.txt`; link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if(!el) return;
  const action = el.dataset.action;

  if(action==="close-modal"){closeModal();return}
  if(action==="book-appointment"){openBooking();return}
  if(action==="quick-book"){openBooking(doctors.find(d=>d.name===el.dataset.doctor)?.id || 1,null,el.dataset.time);return}
  if(action==="doctor-book"){closeModal();openBooking(Number(el.dataset.id));return}
  if(action==="book-hospital"){closeModal();const h=hospitals.find(x=>x.id===Number(el.dataset.id));openBooking(null,h?.name);return}
  if(action==="doctor-details"){showDoctorDetails(Number(el.dataset.id));return}
  if(action==="hospital-details"){showHospitalDetails(Number(el.dataset.id));return}
  if(action==="open-dashboard"){showDashboard();return}
  if(action==="open-login"){openLogin();return}
  if(action==="open-contact"){showGeneric("Patient Support",`<p>Our demo support desk is available for appointment and portal assistance.</p><div class="summary-box"><p><strong>Phone:</strong> 1800-000-MEDI</p><p><strong>Email:</strong> support@medicare.example</p><p><strong>Hours:</strong> 24/7 patient assistance</p></div><button class="btn btn-primary full" data-action="close-modal">Close</button>`);return}
  if(action==="service"){showGeneric(el.dataset.service,`<p class="small-muted">This module is ready for backend integration.</p><div class="summary-box"><p><strong>Service:</strong> ${el.dataset.service}</p><p>Connect this interface to your Node.js/Python API and AWS data services when the backend is ready.</p></div><button class="btn btn-primary full" data-action="book-appointment">Book an OPD appointment</button>`);return}
  if(action==="legal"){showGeneric(el.dataset.title,`<p class="small-muted">This is a demonstration project. Replace this placeholder with your organization's approved ${el.dataset.title.toLowerCase()} before production use.</p><button class="btn btn-primary full" data-action="close-modal">Close</button>`);return}
  if(action==="next-step"){
    const form=$("#bookingForm");
    if(bookingStep===1){
      if(!$("#bookingHospital").value || !$("#bookingDepartment").value || !$("#bookingDoctor").value){form.reportValidity();return}
      setBookingStep(2);
    } else if(bookingStep===2){
      if(!$("#bookingDate").value || !$("#bookingTime").value){form.reportValidity();return}
      setBookingStep(3);
    }
    return;
  }
  if(action==="prev-step"){setBookingStep(Math.max(1,bookingStep-1));return}
  if(action==="show-all-doctors"){currentDoctorFilter="all";$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter==="all"));renderDoctors(doctors);$("#doctors").scrollIntoView({behavior:"smooth"});return}
  if(action==="show-all-hospitals"){$("#hospitals").scrollIntoView({behavior:"smooth"});return}
  if(action==="run-search"){
    const q=$("#globalSearch").value.trim().toLowerCase();
    const dept=$("#searchDepartment").value;
    const list=doctors.filter(d=>(!q || `${d.name} ${d.specialty} ${d.hospital}`.toLowerCase().includes(q)) && (!dept || d.specialty===dept));
    renderDoctors(list);$("#doctors").scrollIntoView({behavior:"smooth"});return;
  }
  if(action==="download-appointment"){downloadAppointment();return}
  if(action==="cancel-latest"){
    if(confirm("Cancel your latest demo appointment?")){localStorage.removeItem("medicareAppointments");renderLatestAppointment();showGeneric("Appointment cancelled","<p class='small-muted'>Your latest demo appointment has been cancelled.</p><button class='btn btn-primary full' data-action='close-modal'>Done</button>");}
    return;
  }
});

document.addEventListener("click", e => {
  const scrollBtn=e.target.closest("[data-scroll]");
  if(scrollBtn){e.preventDefault();$(scrollBtn.dataset.scroll)?.scrollIntoView({behavior:"smooth"});}
  const filter=e.target.closest(".filter");
  if(filter){
    $$(".filter").forEach(x=>x.classList.remove("active"));filter.classList.add("active");
    currentDoctorFilter=filter.dataset.filter;
    renderDoctors(currentDoctorFilter==="all"?doctors:doctors.filter(d=>d.specialty===currentDoctorFilter));
  }
});

document.addEventListener("submit", async e => {
  if(e.target.id==="bookingForm"){
    e.preventDefault();

    if(!e.target.reportValidity()) return;

    const doctor=doctors.find(
      d=>d.id===Number($("#bookingDoctor").value)
    );

    const appointmentData={
      patientName:$("#patientName").value.trim(),
      phone:$("#patientPhone").value.trim(),
      hospital:$("#bookingHospital").value,
      department:$("#bookingDepartment").value,
      doctor:doctor?.name || "",
      date:$("#bookingDate").value,
      time:$("#bookingTime").value,
      reason:$("#visitReason").value.trim()
    };

    try{
      const response=await fetch(
        `${API_BASE_URL}/appointments`,
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(appointmentData)
        }
      );

      const data=await response.json();

      if(!response.ok || !data.success){
        throw new Error(
          data.message || `HTTP error: ${response.status}`
        );
      }

      const appointment=data.appointment;

      const appt={
        id:appointment.id,
        patient:appointment.patientName,
        phone:appointment.phone,
        hospital:appointment.hospital,
        department:appointment.department,
        doctor:appointment.doctor,
        date:new Date(
          appointment.date+"T00:00:00"
        ).toLocaleDateString("en-IN",{
          day:"2-digit",
          month:"short",
          year:"numeric"
        }),
        time:appointment.time,
        reason:appointment.reason,
        status:appointment.status
      };

      saveAppointment(appt);
      closeModal();
      showSuccess(appt);

      console.log(
        "Appointment created successfully:",
        appointment
      );

    }catch(error){
      console.error(
        "Failed to create appointment:",
        error
      );

      alert(
        "Unable to book appointment. Please make sure the backend server is running."
      );
    }
  }
  if(e.target.id==="loginForm"){
    e.preventDefault();
    closeModal();
    showGeneric("Welcome to MediCare","<p class='small-muted'>Demo login successful. Connect this form to your authentication API for real user accounts.</p><button class='btn btn-primary full' data-action='open-dashboard'>Open Patient Dashboard</button>");
  }
});ssss

$("#bookingDepartment").addEventListener("change", () => {
  const dept=$("#bookingDepartment").value;
  $("#bookingDoctor").innerHTML=`<option value="">Select doctor</option>`+doctors.filter(d=>!dept||d.specialty===dept).map(d=>`<option value="${d.id}">${d.name} — ${d.specialty}</option>`).join("");
});

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });
  }

  $$(".nav a").forEach(a => {
    a.addEventListener("click", () => {
      mainNav?.classList.remove("open");
    });
  });

  const bookingDate = $("#bookingDate");

  if (bookingDate) {
    bookingDate.setAttribute(
      "min",
      new Date().toISOString().split("T")[0]
    );
  }
});

renderDoctors();
renderHospitals();
renderLatestAppointment();

loadDoctorsFromAPI();
loadHospitalsFromAPI();
loadAppointmentsFromAPI();
