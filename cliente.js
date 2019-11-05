
//Modulo instalado de terceros
const inquirer = require('inquirer');
//Modulo Nativo de NODE
const fs = require("fs");

const rutaArchivo = __dirname + '/pedidos.json';

let content = fs.readFileSync(rutaArchivo, {encoding: 'utf8'});

content = JSON.parse(content);

//console.log(typeof content);





//let anio = fechaPedido.getFullYear();
//let mes = fechaPedido.getMonth();
//let dia = fechaPedido.getDate();

//let hora = fechaPedido.toLocaleTimeString('en-US', { hour12: true});
//let hora = fechaPedido.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second:'numeric', hour12: true });

//time.toLocaleString('en-US', { hour: 'numeric', hour12: true })

let opciones = [
    {
        type: 'confirm',
        name: 'paraLlevar',
        message: '¿La pizza es para llevar?',
        default: false
    },
    {
        type:'input',
        name:'direccion',
        message:'Ingresá tu dirección',
        when: function(answers) {
            return answers.paraLlevar;
        },
        validate: function(answer) {
            if (answer.length<5){
                return "Dejanos saber tu direccion para llevarte la Pizza"
            }

            return true;
        },
    },
    {
        type: 'input',
        name: 'nombre',
        message: "Ingresá tu nombre",
        validate: function(answer) {
            if (answer.length<1){
                return "Por favor ingresá tu nombre"
            }
            return true;
        },
    },
    {
        type: 'input',
        name: 'telefono',
        message: "Ingresá tu número de teléfono",
        validate: function(answer) {
            if (isNaN(answer)){
                return 'Por favor ingresá un número de teléfono válido';
            }

            return true
        },
    },
    {
        type: 'rawlist',
        name: 'gusto',
        message: "Elegí el gusto de la pizza",
        choices: [ new inquirer.Separator(' = Nuestros Sabores = '),
        'Muzzarella', 'Jamón y Morrón','Cuatro Quesos', 'Anchoas','Jamón y Piña'],
        default: 'Muzzarella',
    },
    {
        type: 'list',
        name: 'tamanio',
        message:'Elegí el tamaño de la pizza',
        choices: [ new inquirer.Separator(' = Nuestros Tamaños = '),'Personal','Mediana','Grande'],
        default: 'Grande',
    },
    {
        type: 'confirm',
        name: 'agregarBebida',
        message: '¿Queres agregar una bebida?',
        default: false
    },
    {
        type: 'list',
        name: 'gustoBebida',
        message:'Elegí el gusto de la bebida',
        choices: [
            new inquirer.Separator(' = Las Bebidas = '),
            'Coca-Cola','Sprite','Fanta','Paso de los Toros Pomelo'],
        when: function(answers) {
            return answers.agregarBebida;
        },
        default: 'Coca-Cola'
    },
    {
        type: 'confirm',
        name: 'clienteHabitual',
        message: '¿Sos cliente habitual?',
        default: false
    },
    {
        type: 'checkbox',
        message: '¿Qué gustos de empanadas queres?',
        name: 'empanadas',
        pageSize: 8,
        choices: [
            new inquirer.Separator(' = Los clásicos = '),
            {
                name: 'Jamón y Queso(JyQ)',
            },
            {
                name: 'Carne Cortada a Cuchillo(CCC)',
            },
            {
                name: 'Capresse(CP)',
            },
            {
                name: 'Cebolla y Queso (CQ)',
            },
            new inquirer.Separator(' = Opciones Veganas = '),
            {
                name: 'Berenjena Veggie (BV)',
            },
            {
                name: 'Zanahoria y Zuccini(ZZ)',
            },
        ],
        when: function(answers) {
            return answers.clienteHabitual;
        },
        validate: function(answer) {
            if (answer.length>3){
                return "Podes elegir hasta tres(3) gustos"
            }
            return true;
        },
    },

];

inquirer
    .prompt(opciones)
    .then(answers => {
        console.log('=== Resumen de tu pedido ===');
        console.log('Tus datos son - Nombre: '+answers.nombre+'/ Teléfono: '+answers.telefono);
        if (answers.paraLlevar){
            console.log('Tu pedido será entregado en: '+answers.direccion);
        }else{
            console.log('Nos indicaste que pasarás a retirar tu pedido')
        };
        console.log('=== Productos solicitados ===');
        console.log('Pizza: '+answers.gusto);
        console.log('Tamaño: '+answers.tamanio);
        if (answers.agregarBebida){
            console.log('Bebida: '+answers.gustoBebida);
        };
        if (answers.clienteHabitual){
            console.log('Tus tres empanadas de regalo serán de: ');
            console.log('● '+answers.empanadas[0]);
            console.log('● '+answers.empanadas[1]);
            console.log('● '+answers.empanadas[2]);
        };
        console.log('===============================');
        let totalProductos = 0;
        let totalDelivery = 0
        let descuentos = 0;
        
        if (answers.agregarBebida){
            totalProductos = totalProductos + 80
        };

        switch (answers.tamanio) {
            case 'Personal':
                totalProductos = totalProductos+430

                if (answers.agregarBebida){
                    descuentos = (totalProductos*3)/100;
                };
            break;
            case 'Mediana':
                totalProductos = totalProductos+560

                if (answers.agregarBebida){
                    descuentos = (totalProductos*5)/100;
                };    
            break;
            case 'Grande':
                 totalProductos = totalProductos+650

                if (answers.agregarBebida){
                    descuentos = (totalProductos*8)/100;
                };
            break;
        };
        
        console.log('Total productos: $'+totalProductos);

        if (answers.paraLlevar){
            totalDelivery = 20
            console.log('Total delivery: $'+ totalDelivery)
        }

        if (answers.agregarBebida){
            console.log('Descuentos: $' + descuentos);
        }
        let totalFinal = (totalProductos+totalDelivery)-descuentos;
        console.log('TOTAL: $' + totalFinal);
        console.log('===============================');      
        console.log('Gracias por comprar en DH Pizzas. Esperamos que disfrutes tu pedido.');
        let fechaPedido = new Date();
        console.log('Fecha: ' + fechaPedido.toLocaleDateString('en-US', {'hour12': true}));
        console.log('Hora: ' + fechaPedido.toLocaleTimeString('en-US', {'hour12': true}));
        
        
        let nuevos = {
            fecha: fechaPedido.toLocaleDateString('en-US', {'hour12': true}),
            hora: fechaPedido.toLocaleTimeString('en-US', {'hour12': true}),
        }
        
        
        let final= {
            ...answers,
            ...nuevos,
            totalProducts: totalFinal,
            descuento: descuentos,
            numeroPedido: content.length == 0 ? 1 : content.lastIndexOf(numeroPedido) + 1

        }

        content.push(final);

        content = JSON.stringify(content);

        fs.writeFileSync(rutaArchivo, content)

        //console.log(final);
    });