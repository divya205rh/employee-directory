
let employees = JSON.parse(JSON.stringify(mockEmployees));
let filteredEmployees = [...employees];
let currentPage = 1;
let itemsPerPage = 10;


const container = document.getElementById('employeeList');
const itemsPerPageSelect = document.getElementById('itemsPerPage');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const filterBtn = document.getElementById('filterBtn');
const filterPanel = document.getElementById('filterPanel');
const applyFilterBtn = document.getElementById('applyFilter');
const resetFilterBtn = document.getElementById('resetFilter');


const addBtn = document.getElementById('addBtn');
const formOverlay = document.getElementById('formOverlay');
const employeeForm = document.getElementById('employeeForm');
const cancelBtn = document.getElementById('cancelBtn');
const closeForm = document.getElementById('closeForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const roleInput = document.getElementById('role');
let editingEmployeeId = null;



function renderEmployees() {
  if (!container) {
    console.error("❌ 'employeeList' container not found in HTML.");
    return;
  }

  container.innerHTML = '';
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filteredEmployees.slice(start, end);

  paginated.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';
    card.innerHTML = `
      <strong>${emp.firstName} ${emp.lastName}</strong>
      <p><strong>Email:</strong> ${emp.email}</p>
      <p><strong>Department:</strong> ${emp.department}</p>
      <p><strong>Role:</strong> ${emp.role}</p>
      <div class="actions">
        <button class="edit-btn" data-id="${emp.id}">Edit</button>
        <button class="delete-btn" data-id="${emp.id}">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });

 attachDeleteListeners();
 attachEditListeners(); 


}


function attachDeleteListeners() {
  const deleteBtns = document.querySelectorAll('.delete-btn');
  deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      employees = employees.filter(e => e.id !== id);
      filteredEmployees = [...employees];
      renderEmployees();
    });
  });
}

function attachEditListeners() {
  const editBtns = document.querySelectorAll('.edit-btn');
  editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const emp = employees.find(e => e.id === id);
      if (!emp) return;

      editingEmployeeId = id; 
      formOverlay.classList.remove('hidden');

      firstNameInput.value = emp.firstName;
      lastNameInput.value = emp.lastName;
      emailInput.value = emp.email;
      departmentInput.value = emp.department;
      roleInput.value = emp.role;
    });
  });
}


itemsPerPageSelect.addEventListener('change', e => {
  itemsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderEmployees();
});


searchInput.addEventListener('input', e => {
  const value = e.target.value.toLowerCase();
  filteredEmployees = employees.filter(emp =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value) ||
    emp.email.toLowerCase().includes(value)
  );
  currentPage = 1;
  renderEmployees();
});


sortSelect.addEventListener('change', e => {
  const sortBy = e.target.value;
  if (sortBy === 'firstName') {
    filteredEmployees.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortBy === 'department') {
    filteredEmployees.sort((a, b) => a.department.localeCompare(b.department));
  }
  renderEmployees();
});


filterBtn.addEventListener('click', () => {
  filterPanel.classList.toggle('hidden');
});

applyFilterBtn.addEventListener('click', () => {
  const firstInput = document.getElementById('filterFirstName');
  const deptInput = document.getElementById('filterDepartment');
  const roleInput = document.getElementById('filterRole');

  const first = firstInput ? firstInput.value.toLowerCase() : '';
  const dept = deptInput ? deptInput.value.toLowerCase() : '';
  const role = roleInput ? roleInput.value.toLowerCase() : '';

  filteredEmployees = employees.filter(emp =>
    (first === '' || `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(first)) &&
    (dept === '' || emp.department.toLowerCase().includes(dept)) &&
    (role === '' || emp.role.toLowerCase().includes(role))
  );

  currentPage = 1;
  renderEmployees();
});



resetFilterBtn.addEventListener('click', () => {
  document.getElementById('filterFirstName').value = '';
  document.getElementById('filterDepartment').value = '';
  document.getElementById('filterRole').value = '';

  employees = JSON.parse(JSON.stringify(mockEmployees));
  filteredEmployees = [...employees];
  currentPage = 1;
  renderEmployees();
});


addBtn.addEventListener('click', () => {
  employeeForm.reset();
  formOverlay.classList.remove('hidden');
});

cancelBtn.addEventListener('click', () => {
  formOverlay.classList.add('hidden');
});

closeForm.addEventListener('click', () => {
  formOverlay.classList.add('hidden');
});

employeeForm.addEventListener('submit', e => {
  e.preventDefault();

  const empData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    department: departmentInput.value.trim(),
    role: roleInput.value.trim()
  };

  if (
    !empData.firstName ||
    !empData.lastName ||
    !empData.email ||
    !empData.department ||
    !empData.role ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empData.email)
  ) {
    alert('Please fill all fields with valid info.');
    return;
  }

  if (editingEmployeeId) {
    
    const index = employees.findIndex(e => e.id === editingEmployeeId);
    if (index !== -1) {
      employees[index] = { id: editingEmployeeId, ...empData };
    }
  } else {
  
    const newEmp = { id: Date.now(), ...empData };
    employees.push(newEmp);
  }

  editingEmployeeId = null;
  filteredEmployees = [...employees];
  formOverlay.classList.add('hidden');
  renderEmployees();
});

document.addEventListener('DOMContentLoaded', () => {
  renderEmployees();
});
