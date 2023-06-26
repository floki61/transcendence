let customersArray = ['Custy Stomer', 'C. Oostomar', 'C.U.S. Tomer', 3432434, 'Custo Mer', 'Custopher Ustomer', 3432435, 'Kasti Yastimeur'];

//Write Your Code here:
function CheckcustomArray():void{
  let i = 0;
  while(custmersArray[i])
  {
    if(typeof customersArray[i] != 'string'){
      console.log(`Type error: ${el} should be a string!`);
    }
    i++;
  }
}


