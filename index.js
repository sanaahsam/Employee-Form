const dbName = "Company-DB";
const relationName = "Employee-Relation";
const Token = process.env.Token_jpdb;
baseUrl = "https://api.jsonpowerdb.com:5567";

//form fields

const employeeId = document.getElementById("employeeId");
const employeeName = document.getElementById("employeeName");
const basicSalary = document.getElementById("basicSalary");
const deduction = document.getElementById("deduction");
const hra = document.getElementById("hra");
const DA = document.getElementById("DA");

//form buttons

const newBtn = document.getElementById("newBtn");
const saveBtn = document.getElementById("saveBtn");
const editBtn = document.getElementById("editBtn");
const changeBtn = document.getElementById("changeBtn");
const resetBtn = document.getElementById("resetBtn");

const firstBtn = document.getElementById("firstBtn");
const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const lastBtn = document.getElementById("lastBtn");

//check button

function checkButtons() {
  let currentRecord = parseInt(localStorage.getItem("currentRecord"));
  let lastRecord = parseInt(localStorage.getItem("lastRecord"));

  if (currentRecord === 1) {
    firstBtn.disabled = true;
    previousBtn.disabled = true;
  } else {
    firstBtn.disabled = false;
    previousBtn.disabled = false;
  }

  if (currentRecord === lastRecord) {
    nextBtn.disabled = true;
    lastBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
    lastBtn.disabled = false;
  }
}

// page load function
window.addEventListener("load", () => {
  let current = parseInt(localStorage.getItem("currentRecord"));

  try {
    jQuery.ajaxSetup({ async: false });
    const req = createGET_BY_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/irl");

    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    if (validateFormFields) {
      saveBtn.disabled = true;
      changeBtn.disabled = true;
      resetBtn.disabled = true;
      checkButtons();
    } else {
      newBtn.disabled = true;
      editBtn.disabled = true;
      changeBtn.disabled = true;
      checkButtons();
    }
  } catch (err) {
    console.log(err);
  }
});

// FORM VALIDATION

function validateFormFields() {
  let isValid = true;

  document.querySelectorAll(".errormsg").forEach((p) => (p.innerText = ""));

  if (employeeId.value.trim() === "") {
    document.getElementById("idError").innerText =
      "Employee ID should not be empty.";
    isValid = false;
  }
  if (employeeName.value.trim() === "") {
    document.getElementById("nameError").innerText =
      "Employee Name should not be empty.";
    isValid = false;
  }
  if (basicSalary.value.trim() === "") {
    document.getElementById("salaryError").innerText =
      "Employee Basic salary should not be empty.";
    isValid = false;
  }
  if (deduction.value.trim() === "") {
    document.getElementById("deductionError").innerText =
      "Employee Deduction should not be empty.";
    isValid = false;
  }
  if (hra.value.trim() === "") {
    document.getElementById("hraError").innerText =
      "Employee HRA should not be empty.";
    isValid = false;
  }
  if (DA.value.trim() === "") {
    document.getElementById("DAError").innerText =
      "Employee DA should not be empty.";
    isValid = false;
  }

  return isValid;
}

// FORM RESET FUNCTION

function resetForm() {
  employeeId.value = "";
  employeeName.value = "";
  basicSalary.value = "";
  deduction.value = "";
  hra.value = "";
  DA.value = "";
  employeeId.focus();
}

// fill data to form function

function fillForm(res) {
  let data = JSON.parse(res.data);
  let record = data.record;

  employeeId.value = record.EmployeeId;
  employeeName.value = record.EmployeeName;
  basicSalary.value = record.BasicSalary;
  deduction.value = record.Deduction;
  hra.value = record.HRA;
  DA.value = record.DA;
}

// disable inputs
function disableFields() {
  employeeId.disabled = true;
  employeeName.disabled = true;
  basicSalary.disabled = true;
  deduction.disabled = true;
  hra.disabled = true;
  DA.disabled = true;
}

// enable inputs
function enableFields() {
  employeeId.disabled = false;
  employeeName.disabled = false;
  basicSalary.disabled = false;
  deduction.disabled = false;
  hra.disabled = false;
  DA.disabled = false;
  employeeId.focus();
}

// new button

newBtn.addEventListener("click", () => {
  console.log("new btn clicked");
  resetForm();
  enableFields();
  newBtn.disabled = true;
  saveBtn.disabled = false;
  resetBtn.disabled = false;
  editBtn.disabled = true;
  changeBtn.disabled = true;
  firstBtn.disabled = true;
  previousBtn.disabled = true;
  nextBtn.disabled = true;
  lastBtn.disabled = true;
});

//save button function
saveBtn.addEventListener("click", () => {
  if (!validateFormFields()) {
    return;
  }
  alert("trying to save data");
  const data = {
    EmployeeId: employeeId.value.trim(),
    EmployeeName: employeeName.value.trim(),
    BasicSalary: basicSalary.value.trim(),
    Deduction: deduction.value.trim(),
    HRA: hra.value.trim(),
    DA: DA.value.trim(),
  };
  try {
    const req = createPUTRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName
    );

    jQuery.ajaxSetup({ async: false });
    let resultObj = executeCommandAtGivenBaseUrl(req, baseUrl, "/api/iml");
    alert("Data saved successfully");
    jQuery.ajaxSetup({ async: true });

    newBtn.disabled = false;
    saveBtn.disabled = true;
    resetBtn.disabled = true;
    editBtn.disabled = false;
    changeBtn.disabled = true;
    checkButtons();

    let firstRecord = localStorage.getItem("firstRecord");
    let lastRecord = localStorage.getItem("lastRecord");

    if (!firstRecord) {
      localStorage.setItem("firstRecord", 1);
      firstRecord = 1;
    }

    lastRecord = lastRecord ? parseInt(lastRecord) + 1 : 1;
    localStorage.setItem("lastRecord", lastRecord);
    localStorage.setItem("currentRecord", lastRecord);

    disableFields();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while saving data:", error);
    alert("An error occurred while saving data. Please try again.");
  }
});

//edit function
editBtn.addEventListener("click", () => {
  enableFields();
  newBtn.disabled = true;
  saveBtn.disabled = true;
  editBtn.disabled = true;
  changeBtn.disabled = false;
  resetBtn.disabled = false;
  firstBtn.disabled = true;
  previousBtn.disabled = true;
  nextBtn.disabled = true;
  lastBtn.disabled = true;
});

//change function
changeBtn.addEventListener("click", () => {
  console.log("change btn clicked");
  if (!validateFormFields()) {
    return;
  }
  alert("trying to update ");
  const EmployeeId = employeeId.value.trim();
  const data = {
    EmployeeId: employeeId.value.trim(),
    EmployeeName: employeeName.value.trim(),
    BasicSalary: basicSalary.value.trim(),
    Deduction: deduction.value.trim(),
    HRA: hra.value.trim(),
    DA: DA.value.trim(),
  };

  try {
    const req = createUPDATERecordRequest(
      Token,
      JSON.stringify(data),
      dbName,
      relationName,
      EmployeeId
    );

    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/iml");
    alert("Updated record.");
    jQuery.ajaxSetup({ async: true });
    newBtn.disabled = false;
    saveBtn.disabled = true;
    resetBtn.disabled = true;
    editBtn.disabled = false;
    changeBtn.disabled = true;
    checkButtons();
  } catch (error) {
    jQuery.ajaxSetup({ async: true });
    console.error("Error while updating record:", error);
    alert("An error occurred while updating the record. Please try again.");
  }
});

// reset function
resetBtn.addEventListener("click", () => {
  console.log("reset btn clicked");
  resetForm();
  location.reload();
});

firstBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentRecord"));
  let first = parseInt(localStorage.getItem("firstRecord"));
  try {
    const req = createFIRST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");

    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = first;
    localStorage.setItem("currentRecord", current);
    firstBtn.disabled = true;
    previousBtn.disabled = true;
    nextBtn.disabled = false;
    lastBtn.disabled = false;
    disableFields();
  } catch (err) {
    console.log("error");
  }
});

// previous button

previousBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentRecord"));
  let first = parseInt(localStorage.getItem("firstRecord"));
  try {
    const req = createPREV_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current -= 1;
    if (first === current) {
      firstBtn.disabled = true;
      previousBtn.disabled = true;
      nextBtn.disabled = false;
      lastBtn.disabled = false;
    }
    if (first < current) {
      firstBtn.disabled = false;
      previousBtn.disabled = false;
      nextBtn.disabled = false;
      lastBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentRecord", current);
  } catch (err) {
    console.log("error");
  }
});

// next button

nextBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentRecord"));
  let last = parseInt(localStorage.getItem("lastRecord"));

  try {
    const req = createNEXT_RECORDRequest(
      Token,
      dbName,
      relationName,
      current,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    current = current + 1;
    //checking button
    if (current === last) {
      nextBtn.disabled = true;
      lastBtn.disabled = true;
      firstBtn.disabled = false;
      previousBtn.disabled = false;
    } else if (last > current) {
      nextBtn.disabled = false;
      lastBtn.disabled = false;
      firstBtn.disabled = false;
      previousBtn.disabled = false;
    }
    disableFields();

    localStorage.setItem("currentRecord", current);
  } catch (err) {
    console.log("error");
  }
});

// last button

lastBtn.addEventListener("click", () => {
  let current = parseInt(localStorage.getItem("currentRecord"));
  let last = parseInt(localStorage.getItem("lastRecord"));

  try {
    const req = createLAST_RECORDRequest(
      Token,
      dbName,
      relationName,
      true,
      true
    );
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(req, "/api/irl");
    fillForm(resultObj);
    jQuery.ajaxSetup({ async: true });
    firstBtn.disabled = false;
    previousBtn.disabled = false;
    nextBtn.disabled = true;
    lastBtn.disabled = true;

    current = last;
    localStorage.setItem("currentRecord", current);
    disableFields();
  } catch (err) {
    console.log("error");
  }
});
