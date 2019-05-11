const EventEmitter = require('events');

import {Row, HeaderRow} from './srt-row'

/*--------private section-----------*/

function _initRowEventsListeners(row) {
    row.events.on('edited', () => {
        this.events.emit('changedData', this.data);
    });
    row.events.on('deleted', (data) => {
        const index = this.data
            .findIndex((item) => item.id === data.id);
        if (!!~index) {
            this.data.splice(index, 1);
            this.events.emit('changedData', this.data);
        }
    });
}

function _createTable(containerBlock) {
    let table = containerBlock.querySelector('table');
    if (table) {
        containerBlock.removeChild(table);
    }

    table = document.createElement('table');
    table.classList.add('table');

    return table;
}

function _createRow(table, index, data) {
    const row =  new Row(table, index, data[index], {
        deleteAllowed: index !== data.length - 1
    });

    this.rows.push(row);

    return row;
}

/*--------public section-----------*/

export class SrtTable {
    data = {};
    rows = [];

    events = new EventEmitter();

    createTable(container, data) {
        this.data = data;

        const containerBlock = document.querySelector(container);
        const table = _createTable.call(this, containerBlock);

        new HeaderRow(table);

        for (let trNum = 0; trNum < data.length; trNum++){
            const row = _createRow.call(this, table, trNum, data);
            _initRowEventsListeners.call(this, row);
        }

        containerBlock.appendChild(table);
    }
}

