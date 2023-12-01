const app = document.querySelector("#calc");
const DEFAULT_CALC_FIELDS = 3;
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
    sum.innerText = "Sum: -";
    results.append(sum);

    const average = document.createElement("span");
    average.innerText = "Average: -"
    results.append(average);

    const min = document.createElement("span");
    min.innerText = "Min: -";
    results.append(min);

    const max = document.createElement("span");
    max.innerText = "Max: -"
    results.append(max);

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
        let data = [];
        let sumResult = 0;
        let avgResult;
        let minResult;
        let maxResult;

        for (let i = 0; i < fields.children.length; i++) {
            const element = fields.children[i];
            let value = Number(element.value);
            if (!dynamicUpdate && (isNaN(value) || element.value == "")) {
                element.remove();
                i--;
                continue;
            }
            if (!element.value == "" && !isNaN(value)) data.push(value);
        }
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            sumResult += el;
            if (i == 0) {
                minResult = el;
                maxResult = el;
            }
            if (minResult > el) minResult = el;
            if (maxResult < el) maxResult = el;
        }
        avgResult = (data.reduce((a, b) => a + b, 0) / data.length);

        sum.innerText = `Sum: ${sumResult}`;
        average.innerText = `Average: ${avgResult}`;
        min.innerText = `Min: ${minResult}`;
        max.innerText = `Min: ${maxResult}`;
    }
}