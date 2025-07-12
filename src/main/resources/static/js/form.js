const form = document.getElementById('employeeForm');
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('editId');

if (editId) {
  const employee = mockEmployees.find(emp => emp.id == editId);
  if (employee) {
    document.getElementById('formTitle').innerText = "Edit Employee";
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('firstName').value = employee.firstName;
    document.getElementById('lastName').value = employee.lastName;
    document.getElementById('email').value = employee.email;
    document.getElementById('department').value = employee.department;
    document.getElementById('role').value = employee.role;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('employeeId').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const department = document.getElementById('department').value;
  const role = document.getElementById('role').value;

  if (!validateEmail(email)) {
    alert("Invalid Email");
    return;
  }

  if (id) {
    const emp = mockEmployees.find(e => e.id == id);
    emp.firstName = firstName;
    emp.lastName = lastName;
    emp.email = email;
    emp.department = department;
    emp.role = role;
  } else {
    const newEmp = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      department,
      role
    };
    mockEmployees.push(newEmp);
  }

  window.location.href = "/dashboard.ftlh";
});

function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

document.getElementById('cancelBtn').addEventListener('click', () => {
  window.location.href = "/dashboard.ftlh";
});
