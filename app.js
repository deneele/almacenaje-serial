const { parse } = require('path')
const serialPort = require('serialport')
const fs= require ('fs')

const xl = require('excel4node');
const path = require('path');
const XLSX = require('xlsx');
/*---------------------------------creacion del archivp excel-------------------------------------------------------*/

//inicializar libro de trabajo
var wb= new xl.Workbook();
//inciar la hoja de trabajo
var ws= wb.addWorksheet('moviemientos');

// Create a new instance of a Workbook class
var wb = new xl.Workbook();
 
// Add Worksheets to the workbook
var ws = wb.addWorksheet('Sheet 1');

 
// Create un estilo
var style = wb.createStyle({
  font: {
    color: '#FF0800',
    size: 12,
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -',
});

 
// Svalores que estaran en las celdas del excel
var array = fs.readFileSync('ticket.txt').toString().split("\n");


for (let i = 1; i < array.length; i++) {
  console.log(array[i]) 
    ws.cell(i,1)
    .string(array[i])
    .style(style);
  
  
}

//creacion del excel
  const pathExcel = path.join(__dirname,'excel','datosauto.xlsx');
  wb.write(pathExcel, function (err, stats){
    if (err){
        console.log(err)
    }else{  
        console.log("excel generado")
    }
})

/*----------------------Lectura por medio de çl puerto serial---------------------------------------------*/
/*
//puerto por el cual se comunicara y la velocidad
const port = new serialPort(
    'COM2',
    {baudRate: 9600}
)
//lectura de lo que llegue por el puerto seerial
const parser = new serialPort.parsers.Readline()

port.pipe(parser)
//mostrar los datos
parser.on('data', (line)=>{
   // declaracion de un avarible privara a utilizar
    let datos= line
    //crecion del archivo donde se alojara la informacion que llegue del puerto
    fs.appendFile('ticket.txt','\n'+'line,(err)=>{
        if (err){
            console.log('hubo un error, el archivo no se pudo crear');
        }
    })
    console.log(datos)
    
})
 */
/*------------------------------------------------------------------------------------------*/




