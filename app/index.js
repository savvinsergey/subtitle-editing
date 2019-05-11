import { SrtTable } from './srt-table'
import { SrtProcessing } from './srt-processing'

const srtTable = new SrtTable();
const srtProcessing = new SrtProcessing('#srtFile');

srtProcessing.events
    .on('data',(content) => {
        srtTable.createTable('#table-container', content);

        srtTable.events
            .on('changedData',(data) => {
                console.log('Data was changed', data);
                srtProcessing.downloadFile(data);
            })
    })
    .on('error', (error) => {
        console.error(error);
    });
