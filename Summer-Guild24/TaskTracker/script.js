document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskDescription = document.getElementById('taskDescription').value;
    const taskDeadline = document.getElementById('taskDeadline').value;

    if (taskName === '' || taskDeadline === '') {
        alert('Task name and deadline are required!');
        return;
    }

    const table = document.getElementById('taskTable').querySelector('tbody');
    const row = table.insertRow();
    row.innerHTML = `
        <td>${taskName}</td>
        <td>${taskDescription}</td>
        <td>${taskDeadline}</td>
        <td>Incomplete</td>
        <td>
            <button class="complete">Complete</button>
            <button class="remove">Remove</button>
        </td>
    `;

    document.getElementById('taskForm').reset();

    row.querySelector('.complete').addEventListener('click', function () {
        row.cells[3].textContent = 'Complete';
    });

    row.querySelector('.remove').addEventListener('click', function () {
        table.deleteRow(row.rowIndex - 1);
    });
});