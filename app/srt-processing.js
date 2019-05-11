const FileSaver = require('file-saver');
const EventEmitter = require('events');

/*--------private section-----------*/

function _serialize(rawData) {
    try {
        const resultJson = [];
        const dataArray = rawData.split('\n\r');
        dataArray.forEach((item) => {
            item = item.split('\n').filter((item) => !!item);
            if (!item.length || item.length < 3) {
                throw new Error('Wrong data');
            }

            const id = +item.shift();
            if (isNaN(id)) {
                throw new Error('Wrong id');
            }

            const time = item.shift().split('-->');
            if (time.length !== 2) {
                throw new Error('Wrong time');
            }

            resultJson.push({
                id,
                startTime: time[0].trim(),
                endTime: time[1].trim(),
                text: item.join('<br/>')
            })
        });

        return resultJson;
    }
    catch (e) {
        return e;
    }
}

function _deserialize(dataArray) {
    if (!dataArray.length) {
        return '';
    }

    return dataArray.map((item) =>
        `${item.id}\n${item.startTime} --> ${item.endTime}\n${item.text.replace('<br/>','\n')}\n`
    ).join('\r\n');
}


/*--------public section-----------*/

export class SrtProcessing {
    events = new EventEmitter();

    constructor(element) {
        const events = this.events;
        const input = document.querySelector(element);

        if (!input) {
            return;
        }

        input
            .addEventListener("click", function () {
                this.value = '';
            });

        input
            .addEventListener("change", function () {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    const srtFile = this.files[0];

                    reader.readAsText(srtFile);

                    reader.addEventListener('error', (e) => {
                        events.emit('error',`Reading file error`);
                    });

                    reader.addEventListener('loadend', (e) => {
                        if (!e.target.result) {
                            events.emit('error',`File is empty`);
                            return;
                        }

                        const resultJsonData = _serialize.call(this, e.target.result);
                        if (Array.isArray(resultJsonData)) {
                            events.emit('data', resultJsonData);
                        } else {
                            events.emit('error', `Parsing data error. ${resultJsonData}`);
                        }
                    });
                }
            });
    }

    downloadFile(data) {
        data = _deserialize.call(this, data);
        saveAs(new Blob([data], {
            type: 'text/plain;charset=utf-8'
        }), 'result.srt');
    }
}
