const SerialPort = require("serialport");
const port = new SerialPort(
    'COM6',
    { autoOpen: false, baudRate: 9600 }
);

//Variable para obtener la fecha
var now = new Date();
var now2 = Date.parse(now);

// Variable que necesitamos para crear el txt
var fs = require('fs')

//Variable para elegir los diferentes tipos de impresión de tickets
var Selector = 1;

//Función para abrir puerto.
function abrir() {
    port.open(err => {
        if (!err)
            return;

        console.log('Port is not open: ' + err.message);
        setTimeout(abrir, 10000);
    });
}

//Función para terminar el proceso
function kill() {
    process.exit(1);
}

//Función para ejecutar un comando en cmd.exe y resetar el ticket
function reset() {
    const child_process = require('child_process');
    let comando = child_process.spawn('cmd', ['/c', 'node index.js C:\\Users\\Corpus\\' + '"OneDrive - Centro de Enseñanza Técnica Industrial"' + '\\9no\\Proyecto\\Serial']);

    comando.stdout.on('data', function (datos) {
        console.log(datos.toString());
    });

    comando.stderr.on('data', function (datos) {
        console.log('Error: ', datos.toString());
    });

    comando.on('exit', function (codigo) {
        console.log('El proceso finalizó con el código: ', codigo);
    });
}


//Función para cerrar puerto
function cerrar() {
    port.close(err => {
        if (!err)
            return;

        console.log('El puerto no se puede cerrar: ' + err.message);
        console.log('Reintentando cerrar...');
        setTimeout(cerrar, 10000);
    })
}

//Función que imprime el ticket full
function DatosFull() {
    //Abrimos el puerto
    abrir();

    //Establecemos la auto-ejecución de la función "cerrar puerto" y "DatosFull"
    setTimeout(cerrar, 70000);
    setTimeout(reset, 80000);

    //Utilizamos el parser para comenzar a leer el documento mediante el stream
    const parser = new SerialPort.parsers.Readline()
    port.pipe(parser)

    //Método para guardar lo mostrado en un archivo de texto
    parser.on('data', (line) => {
        fs.appendFile('./logs/' + now2 + '.txt', '\n' + line, function (err) {
            if (err) {
                console.log('Ocurrió el siguiente problema: ' + err)
            }
        })
    })
}

//Función que imprime el ticket a "x" cantidad de bits y salta línea
function DatosBite() {
    const ByteLength = require('@serialport/parser-byte-length');
    const parser = port.pipe(new ByteLength({ length: 9 }))

    console.log('Escuchando por un nuevo ticket \n');

    parser.on('data', (line) => {

        fs.appendFile(now2 + '.txt', '\n' + line, function (err) {
            if (err) {
                console.log('Ocurrió el siguiente problema: ' + err)
            }
        })
        console.log(line.toString())
    })
}

//Función de prueba, no hacer caso
function Datos() {
    console.log('Se imprimirá el primer ticket')
    setTimeout(DatosFull, 80000);
    console.log('Se volverá a imprimir un ticket en 70 segundos')
    DatosFull();
}

//Un simple if que nos selecciona la función
if (Selector == 1) {
    DatosFull();
} else if (Selector == 2) {
    DatosBite();
} else {
    Datos();
}