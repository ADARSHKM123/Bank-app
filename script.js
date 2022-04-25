'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-10-04T17:01:17.194Z',
    '2021-10-08T23:36:17.929Z',
    '2021-10-09T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE

};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

console.log('%%%%CHALLENGE%%%%%');

//1
const totaldep = accounts.map(acc=>acc.movements).flat().filter(mov=>mov>0).reduce((acc,el,i)=>acc+el,0)                                        
console.log(totaldep);
//2
const how = accounts.flatMap(acc=>acc.movements).filter((mov,i)=>mov>=1000).length
console.log(how);
//OR
const count = accounts.flatMap(acc=>acc.movements).reduce((count,curr)=>curr>=1000? count + 1: count,0);
console.log(count);

const {deposite,withdraw} = accounts.flatMap(mov=>mov.movements).reduce((sum,curre)=>{
  //  curre>0 ? (sum.deposite += curre) : (sum.withdraw +=curre);
  //OR
  sum[curre>0 ? 'deposite':'withdraw']+=curre;
   return sum;
},
  {deposite:0 , withdraw:0})
  console.log(deposite,withdraw);
// //3
const convertTile = function(title){
  
  const just = title.split(' ').map((state,i,arr)=> i==2 ? state : state.replace(state[0],state[0].toUpperCase())).join(' ');
  return just;
}
console.log(convertTile('the man is good'));

// const fix= ['man','just','a','begining'];
// console.log(fix[0].slice(0,1))

  console.log('%%%%%%%%%');
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



const createUsername = function(accs){
  accs.forEach(function(acc){
    acc.Usename = acc.owner
    .toLowerCase()
    .split(' ')
    .map(function(name){
      return name[0]
    }).join('');
  })
}

createUsername(accounts);
console.log(accounts);



const updateUi = function(acc){
  displayMovements(acc);

  //Blance________________________________________
  calcDisplaybalance(acc);


  //Summary________________________________________
  calcDisplaysummary(acc); 
  
}

const startLogouttimer = function(){
  let time = 30
  const tick = function(){
    let min =String(Math.trunc(time/60)).padStart(2,0);
    let sec = String(time%60).padStart(2,0);
  labelTimer.textContent = `${min}:${sec}`;

  if(time ===0){
    clearInterval(timer);
    labelWelcome.textContent = 'Login to get started'
    containerApp.style.opacity = 0;
    }
  time--;
 }
  tick();
  const timer = setInterval(tick,1000);
  return timer;
}


//FOrmat Number __________________________________
const formatNumber = function(value,locale,currency){
 return new Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
  }).format(value);
}

//Format Date______________________________________
const formatDate = function(date,locale){

  const calcDaypassed = (date1,date2)=>Math.round(Math.abs(date2-date1) /(1000 * 60 * 60 * 24));
  const daysPassed = calcDaypassed(new Date(),date)
 

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <=7)  return `${daysPassed} days ago`
  else{
    // const day = `${date.getDate()}`.padStart(2,0);
    // const month =`${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    // const hour  = date.getHours();
    // const minutes = date.getMinutes();
    // const seconds = date.getSeconds();
    return new Intl.DateTimeFormat(locale).format(date);
  }

}
//MOVEMENTS $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

const displayMovements = function(acc,sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a,b)=>a-b) : acc.movements
  movs.forEach(function(move,i){
    const type = move > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const formatedmove =formatNumber(move,acc.locale,acc.currency);
    const displaydate = formatDate(date,acc.locale);
    
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${displaydate}</div>
    <div class="movements__value">${formatedmove}</div>`;
    containerMovements.insertAdjacentHTML('afterbegin',html)
  });
  // containerMovements.innerHTML = '';
};


//BALANCE $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

const calcDisplaybalance =function(acc){
  acc.balance = acc.movements.reduce(function(acc,elemen,i,arr){
    return acc +elemen;
  },0);
  const formatedmove = formatNumber(acc.balance,acc.locale,acc.currency);
  labelBalance.textContent =`${formatedmove}`;
}

//SUMMARY$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const calcDisplaysummary = function(acc){
  const Incoming =acc.movements.filter((mov)=>mov>0).reduce((acc,mov)=>acc+mov,0);
  labelSumIn.textContent =  formatNumber(Incoming,acc.locale,acc.currency);

  const outgoing  =acc.movements.filter((mov)=>mov<0).reduce((acc,mov)=>acc+mov,0);
  labelSumOut.textContent =   formatNumber(Math.abs(outgoing),acc.locale,acc.currency);

  const interest =acc.movements.filter((mov)=>mov>0).map((mov)=>mov*acc.interestRate/100).filter((int,i)=>int>=1).reduce((acc,move)=>acc+move,0);
  labelSumInterest.textContent = formatNumber(interest,acc.locale,acc.currency);
}


console.log(accounts);



//Login_______________________________

//Fake
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

// const now = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month =`${now.getMonth()+1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour  = now.getHours();
// const minutes = now.getMinutes();
// const seconds = now.getSeconds();
// labelDate.textContent =`${day}/${month}/${year}, ${hour}:${minutes}`


//day//month//year
let currentAccount,timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.Usename === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options={
      day:'numeric',
      hour:'numeric',
      minute:'numeric',
      year:'numeric',
      month:'numeric',
      // weekday:'long',
    }
    // const day = `${now.getDate()}`.padStart(2,0);
    // const month =`${now.getMonth()+1}`.padStart(2,0);
    // const year = now.getFullYear();
    // const hour  = `${now.getHours()}`.padStart(2,0);
    // const minutes = `${now.getMinutes()}`.padStart(2,0);
    // // const seconds =`${now.getMinutes()}`.padStart(2,0);
    // labelDate.textContent =`${day}/${month}/${year}, ${hour}:${minutes}`
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale,options).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    if(timer) clearInterval(timer);
    timer = startLogouttimer();

    // Update UI
    updateUi(currentAccount);
    console.log('@@@@@@@');
   console.log(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function(){
    currentAccount.movements.push(amount);

   //Add Date
    currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUi(currentAccount);

    clearInterval(timer);
    timer = startLogouttimer();
  },2500);


  }
  inputLoanAmount.value = '';
});

//Transfer Amount _________________________________________

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount = +(inputTransferAmount.value);
  console.log(amount);
  const recieverAcc = accounts.find(acc=>
    acc.Usename === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value ='';

  if(amount > 0 && recieverAcc && currentAccount.balance >=amount && recieverAcc.Usename !== currentAccount.Usename){

   currentAccount.movements.push(-amount);
   recieverAcc.movements.push(amount);

   
   //Add Date
   currentAccount.movementsDates.push(new Date().toISOString());
   recieverAcc.movementsDates.push(new Date().toISOString());
  
   console.log( recieverAcc.movementsDates);
   //Update UI
  updateUi(currentAccount);
//Reset Timer
clearInterval(timer);
timer = startLogouttimer();

    console.log('Transfer valid');
  }
  console.log(recieverAcc,amount,currentAccount);
})

btnClose.addEventListener('click',function(e){

  e.preventDefault();
  if(currentAccount.Usename === inputCloseUsername.value && Number(inputClosePin.value) === currentAccount.pin ){
     const index = accounts.findIndex(acc=>acc.Usename === currentAccount.Usename);
     console.log(index);
     accounts.splice(index,1)
     containerApp.style.opacity = '0';
     console.log(accounts);
  }
})
//Sort btn//
let sort = false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayMovements(currentAccount,!sort)
  sort = !sort;
})
// const user = 'Steven Thomas Williams';
// let username =user.toLowerCase();
// const cxtName =username.split(' ').map(function(name){
//   return name[0]
// }).join('');

// console.log(cxtName);


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES


const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);

//*************************************************************** */ MAP method
// const newmove = movements.map(function(mov){
//   return mov*2;
// });
// console.log(newmove);

// const newmove = movements.map((mov=>mov*2));
// console.log(newmove);

//*************************************************************** */ FILTER method
const withdrawals = movements.filter(function(move){
  return move < 0;
})
console.log(withdrawals);


//*************************************************************** */ REDUCE method

const balance =movements.reduce(function(acc,element,i,arr){
  console.log(`${i} ${acc}:: ${arr}`);
  return acc + element;
},0)
console.log(balance);

//*************************************************************** */ MAP & FILTER & REDUCE symulatneously
console.log('*****$$$$$$$$$$$$$$$$$$$$$$$$');
const eurToUsd = 1.1;
const results = movements.filter((mov)=> mov< 0).map((mov,i,arr)=>mov*eurToUsd).reduce((acc,mov)=>acc+mov,0)
console.log(results);

//*************************************************************** */ MAXIMUM Value
const balance2 =movements.reduce(function(acc,element,i,arr){
  if(acc >element){
    return acc;
  }else{
    return element
  }
},200)
console.log(balance2);

//*************OR****** //////////////////////////////////////////////////////////

// const multi = [];
// for(const cycle of movements){
//   multi.push(cycle*2);
// }
// console.log(multi);


// movements.forEach(function(movement){
//   if(movement >0){
//     console.log(`Credited ${movement}`);
//   }else{
//     console.log(`Debited ${Math.abs(movement)}`);
//   }
// })

///////////*****************************CHALLENGE */

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

console.log('////////////////////////////////////////////////////');

const calcAveragehumanage =function(dogage){
  const data1 = dogage.map(function(age){
    if(age <=2){
      age = 2*age;
    }else{
      age= 16+age *4;
    }
    return age;
  })
 const adults = data1.filter(function(valya){
   return valya >= 18;
 })
 console.log(data1);
 console.log(adults);
//  const average = adults.reduce((acc,avg) => acc+avg,0)/adults.length;
 const average = adults.reduce((acc,avg)=> acc+avg,0)/adults.length;
return average
// const avgfinal = average/(avg.length);
// return avgfinal;
}
///CHAINING******************************************************************* //
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
const calcAveragechain= function(dog){
  const data2 =dog.map((age)=>(age<=2 ? age*2 : 16+age*4)).filter((age)=>age>=18);
  console.log(`Adults: ${data2}`);
}

calcAveragechain([5, 2, 4, 1, 15, 8, 3]);
const avg1 = calcAveragehumanage([5, 2, 4, 1, 15, 8, 3]);
console.log(avg1);

console.log(accounts);
const found =accounts.find((account)=>account.owner === 'Jessica Davis');
console.log(found);




/////////////////////////SORTING//////////

console.log(movements);
const newOne = movements.sort((a,b)=>{
if(a>b) return 1;
if(b>a) return -1;
});
console.log(newOne);

const newOne1 = movements.sort((a,b)=> a - b);
console.log(newOne1);
/////////////////////////////////////////////////


//Array programatically ///////////////////////////


const x= new Array(5);
console.log(x.fill(1,2,4));

const v =Array.from({length:500},(arr,i)=>i+1)
console.log(v);

labelBalance.addEventListener('click',function(){
  const movementUi = Array.from(document.querySelectorAll('.movements__value'),el=>Number(el.textContent.replace('€','')));
  console.log(movementUi);
})

// let arr = ['a','b','c','d','e'];
// console.log(arr.slice(-1));

// console.log(arr.slice(2,4));
// console.log(arr.slice(1,-2));
// console.log(arr.slice(3,-1));


// console.log(arr.splice(-1));
// console.log(arr);

// arr = ['a','b','c','d','e'];
// let arr1 = ['f','g','h','i','j'];

// console.log(arr.reverse());
// arr = ['a','b','c','d','e'];

// const newOne = arr.concat(arr1);
// console.log(newOne.join('...'));

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
 //
//  currencies.forEach(function(value,key,map){
//      console.log(`${key}:${value}`);
  
//  })
// console.log('*********************************');
//  const currenciesU = new Set(['USD','EUR','GBP']);

//  currenciesU.forEach(function(value,_,map){
//   console.log(`${value}:${value}`); 
//  })

//Challege 
// TEST DATA 1:

// const checkDogs =function(dogsJulia,dogsKate){

//   dogsJulia.splice(3,2);
//   dogsJulia.splice(0,1);
//  const dogs = dogsJulia.concat(dogsKate)
//  console.log(dogs);

//  dogs.forEach(function(naya,i){
//   if(naya >3){
//     console.log(`Dog number ${i+1}: Age is ${naya}:Adult`);
//   }else{
//     console.log(`Dog number ${i+1}: Age is ${naya}:Puppy`);
//   }
//  })
  // arr.forEach(function(ages){

  //   if(ages >3){
  //     console.log('adult');
  //   }else{
  //     console.log('Puppy');
  // //   }
  // })
// };


// checkDogs(...dogsJulia,...dogsKate);
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3])


//challenge  how many deposited in bank


// TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
// recommendedFood

const newobjcreation = dogs.forEach((obj)=>{
 obj.recommendedFood = obj.weight*0.75 * 28;
 console.log(obj);
})
// console.log(newobjcreation); 
console.log('###########');
const check = dogs.find(dog=>dog.owners.includes('Sarah'))
console.log(check);
console.log(`Sarah eating too ${check.curFood>check.recommendedFood ? 'much' : 'litte'}`);

const eattooMuch =dogs.filter(dog=>dog.curFood>dog.recommendedFood).flatMap(dog=>dog.owners)
console.log(eattooMuch);

const eattooLittle = dogs.filter(dog=>dog.curFood<dog.recommendedFood).flatMap(dog=>dog.owners)
console.log(eattooLittle);

const print = `${eattooMuch.join(' and ')}'s dogs eat too much!`
console.log(print);

const exact =dogs.some(dog=>dog.curFood === dog.recommendedFood)
console.log(exact);

const okcdt = dogs.some(dog=>dog.curFood > dog.recommendedFood *0.9 && dog.curFood< dog.recommendedFood*1.1)
console.log(okcdt);

const okcdt2 = dogs.filter(dog=>dog.curFood > dog.recommendedFood *0.9 && dog.curFood< dog.recommendedFood*1.1)
console.log(okcdt2);

const dogSorted = dogs.slice().sort((a,b)=>a.recommendedFood - b.recommendedFood)
console.log(dogSorted);