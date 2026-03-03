console.log(arguments);
console.log(require("module").wrapper);
 
const C = require("./test-module-1");
const Calc1 = new C();
console.log(Calc1.add(3,5));

const Calc2 = require("./test-module-2");
console.log(Calc2.add(3,5));

const { add, multipliy, divide } = require("./test-module-2");;
console.log(add(3, 5));

require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();