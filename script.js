const inputSlider = document.querySelector("[data-lengthSlider]");
//upar wala custome attribute ka syntax hai
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#number");
const symbolsCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generator = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()-_+=|\}]{[":;?/>.<,';

let password = "";
let passwordLength = 10;
let checkCount = 0;
//set the strength circle color to grey initially
handleSlider();
setIndicator("#ccc");
//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"%100%";
}
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}
function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandNumber() {
    return getRandInteger(0, 9);
}
function generateLowerCase() {
    //ascii value to string
    return String.fromCharCode(getRandInteger(97, 123));
}
function generateUpperCase() {
    //ascii value to string
    return String.fromCharCode(getRandInteger(65, 91));
}
function generateSymbol() {
    const randsym = getRandInteger(0, symbols.length);
    return symbols.charAt(randsym);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNum = false;
    if (uppercaseCheck.checked)
        hasUpper = true;
    if (lowercaseCheck.checked)
        hasLower = true;
    if (symbolsCheck.checked)
        hasSymbol = true;
    if (numbersCheck.checked)
        hasNum = true;
    if (hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}
async function copyContent() {
    try {
        //used to copy in clipboard
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    //add active class to make span wala visible
    copyMsg.classList.add("active");
    setTimeout(function () {
        copyMsg.classList.remove("active");
    }, 2000);
}

//evenlisteners
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
    //Fisher Yates Method to suffle array
    for(let i=array.length-1;i>=0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});
generator.addEventListener('click', () => {
    //none of the check box selected
    if (checkCount <= 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // console.log("Starting the journey");
    //remove old password
    password = "";

    //    if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    //    }
    //    if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    //    }
    //    if(numbersCheck.checked){
    //     password+=generateRandNumber();
    //    }
    //    if(symbolsCheck.checked){
    //     password+=generateSymbol();
    //    }


    let arrayOfCheckedFunction = [];

    if (uppercaseCheck.checked) 
        arrayOfCheckedFunction.push(generateUpperCase);
    if (lowercaseCheck.checked) 
        arrayOfCheckedFunction.push(generateLowerCase);
    if (numbersCheck.checked) 
        arrayOfCheckedFunction.push(generateRandNumber);
    if (symbolsCheck.checked) 
        arrayOfCheckedFunction.push(generateSymbol);

    // Compulsory Addition
    for (let i = 0; i < arrayOfCheckedFunction.length; i++) {
        password += arrayOfCheckedFunction[i]();
    }

    // console.log("Password: " + password);

    // Additional addition
    for (let i = 0; i < passwordLength - arrayOfCheckedFunction.length; i++) {
        let randIndex = getRandInteger(0, arrayOfCheckedFunction.length);
        password += arrayOfCheckedFunction[randIndex]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));
    //console.log("pass suffel done");
    passwordDisplay.value=password;
    passwordDisplay.style.paddingLeft = "30px";
    //console.log("final");
    calcStrength();
});
