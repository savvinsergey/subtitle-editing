const EventEmitter = require('events');

/*--------private section-----------*/

function _initHeader(table) {
    const row = table.insertRow(-1);
    ['ID', 'Start time', 'End time', 'Text', 'Actions'].forEach((title) => {
        const cell = row.insertCell(-1);
        _initCell.call(this, cell, title);
    });
}

function _initCell (cell, data, field) {
    if (data) {
        const span = document.createElement('span');

        span.innerHTML = data;
        cell.appendChild(span);

        let input = null;
        if (field === 'text') {
            span.classList.add('edit-span');

            input = document.createElement('input');
            input.classList.add('form-control', 'edit-input', 'hide');
            input.value = data;

            cell.appendChild(input);
        }
    }
}

function _initActionButtons(cell) {
    this.btnEdit = _createButton.call(this, cell, ['btn', 'btn-primary', 'mr-2', 'edit-btn'], 'Edit');
    this.btnSave = _createButton.call(this, cell, ['btn', 'btn-success', 'mr-2', 'hide'], 'Save');
    this.btnCancel = _createButton.call(this, cell, ['btn', 'btn-secondary', 'mr-2', 'hide'], 'Cancel');

    if (this.params.deleteAllowed) {
        this.btnDelete = _createButton.call(this, cell, ['btn', 'btn-danger'], 'Delete');
    }

    this.btnEdit.addEventListener('click', () => _edit.call(this));
    this.btnCancel.addEventListener('click', () => _cancel.call(this));
    this.btnSave.addEventListener('click', () => _save.call(this));

    if (this.btnDelete) {
        this.btnDelete.addEventListener('click', () => _delete.call(this));
    }
}

function _createButton(cell, classes, text) {
    const btn = document.createElement('button');
    btn.classList.add(...classes);
    btn.innerText = text;

    cell.appendChild(btn);

    return btn;
}

function _edit() {
    this.element.querySelector('.edit-span').classList.add('hide');
    this.element.querySelector('.edit-input').classList.remove('hide');

    this.btnEdit.classList.add('hide');
    this.btnSave.classList.remove('hide');

    this.btnCancel.classList.remove('hide');
    if (this.btnDelete) {
        this.btnDelete.classList.add('hide');
    }
}

function _cancel() {
    this.element.querySelector('.edit-span').classList.remove('hide');
    this.element.querySelector('.edit-input').classList.add('hide');

    this.btnSave.classList.add('hide');
    this.btnEdit.classList.remove('hide');

    this.btnCancel.classList.add('hide');
    if (this.btnDelete) {
        this.btnDelete.classList.remove('hide');
    }
}

function _save() {
    const input = this.element.querySelector('.edit-input');
    if (input) {
        this.data.text = input.value;

        this.element.classList.add('table-warning');
        this.element.querySelector('.edit-span').innerHTML = input.value;

        this.events.emit('edited', this.data);

        _cancel.call(this);
    }
}

function _delete() {
    this.element.remove();
    this.events.emit('deleted', this.data);
}


/*--------public section-----------*/

export class Row {
    element = null;
    index = null;
    data = null;

    params = {};

    btnCancel = null;
    btnDelete = null;
    btnSave = null;
    btnEdit = null;

    events = new EventEmitter();

    constructor(table, index, data, params) {
        this.index = index;
        this.data = data;
        this.params = params;

        const row = this.element = table.insertRow(-1);
        row.setAttribute('data-id', data['id']);

        for (let property in data) {
            if (data.hasOwnProperty(property)) {
                const cell = row.insertCell(-1);
                _initCell.call(this, cell, data[property], property);
            }
        }

        const cell = row.insertCell(-1);
        _initCell.call(this, cell, null);
        _initActionButtons.call(this, cell);
    }
}

export class HeaderRow {
    constructor(table) {
        _initHeader.call(this, table);
    }
}

