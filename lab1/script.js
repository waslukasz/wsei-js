const app = document.querySelector("#calc");
const DEFAULT_CALC_FIELDS = 4;
const ENABLE_DYNAMIC_UPDATE = true;

InitializeCalc();


function InitializeCalc() {
    const addCalcFieldButton = document.createElement("button");
    addCalcFieldButton.innerText = "Add field"
    app.append(addCalcFieldButton);

    addCalcFieldButton.addEventListener("click", AddCalcField);

    const removeCalcFieldButton = document.createElement("button");
    removeCalcFieldButton.innerText = "Remove field"
    app.append(removeCalcFieldButton);

    const fields = document.createElement("div");
    fields.classList.add("calc-fields");
    app.append(fields);

    removeCalcFieldButton.addEventListener("click", RemoveCalcField)

    for (let i = 0; i < DEFAULT_CALC_FIELDS; i++) {
        AddCalcField();
    }

    const results = document.createElement("div");
    results.classList.add("calc-results");
    
    const sum = document.createElement("span");
    sum.innerText = "Sum: 0";
    results.append(sum);

    const difference = document.createElement("span");
    difference.innerText = "Difference: 0";
    results.append(difference)

    const multiply = document.createElement("span");
    multiply.innerText = "Multiplication: 0";
    results.append(multiply);

    const division = document.createElement("span");
    division.innerText = "Division: 0";
    results.append(division);

    app.append(results);

    const calculateButton = document.createElement("button");
    calculateButton.innerText = "Calculate";
    app.append(calculateButton);
    
    calculateButton.addEventListener("click", (event) => {
        UpdateData(false);
        event.preventDefault();
    });

    function AddCalcField() {
        const element = document.createElement("input");
        element.setAttribute("type", "text");
        fields.append(element);
        if (ENABLE_DYNAMIC_UPDATE) {
            element.addEventListener("input", () => {
                UpdateData(true);
            });
        }

    }
    
    function RemoveCalcField() {
        fields.children[fields.children.length-1].remove();
        UpdateData(true);
    }

    function UpdateData(dynamicUpdate) {
        let sumResult = 0;
        let differenceResult = 0;
        let differenceStarted = false;
        let multiplicationResult = 0;
        let multiplicationStarted = false;
        let divisionResult = 0;
        let divisionStarted = false;
        let divisionPossible = true;
        for (let i = 0; i < fields.children.length; i++) {
            const element = fields.children[i];
            let value = Number(element.value);
            if (!dynamicUpdate && (isNaN(value) || element.value == "")) {
                element.remove();
                i--;
                continue;
            }
            if (dynamicUpdate && isNaN(value)) {
                element.placeholder = "Enter number.";
                element.value = "";
                break;
            }
            sumResult += value;
            if (!differenceStarted) {
                differenceResult = value;
                differenceStarted = true;
            } else {
                differenceResult -= value;
            }
            if (!multiplicationStarted) {
                multiplicationResult = value;
                multiplicationStarted = true;
            } else {
                multiplicationResult *= value;
            }

            if (divisionPossible) {
                if (!divisionStarted) {
                    if (value == 0) divisionPossible = false;
                    if (divisionPossible) {
                        divisionResult = value;
                        divisionStarted = true;
                    }
                } else {
                    if (value == 0) divisionPossible = false;
                    if (divisionPossible) {
                        divisionResult /= value;
                    }
                }
            }
        }

        sum.innerText = `Sum: ${sumResult}`;
        difference.innerText = `Difference: ${differenceResult}`;
        multiply.innerText = `Multiplication: ${multiplicationResult}`;
        if (divisionPossible) division.innerText = `Division: ${divisionResult}`;
        else division.innerText = "Division not possible.";
        
    }
}