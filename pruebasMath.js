
var r = 0; // Skip seleccionado o pagination.a active actual
var m = 15; // Maximo // Cantidad de paginaciones luego de math.ceil
var l = 5; // Min // Minimo que se crean
var j = r > 2 ? r - 1 : 0; //Peraciones matematicas
var k = r > 2 ? l + r : l; // Operacioens matematicas


console.log(`======= j: ${j} k: ${k} M: ${m}`);
console.log(`======= Select ${r+1} =======`);

for (j; j < k; j++) {
  if (r < 3) {
    console.log('  $' + j + '      ');
  } else if (j !== (k-1) && j <= m) {
    console.log('        !' + j);
  }
}



