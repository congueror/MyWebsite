<!DOCTYPE html>
<html lang="en">
<body id="body">

<link rel="stylesheet" href="mathquill-0.10.1/mathquill.css"/>
<link rel="stylesheet" href="calculator.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="mathquill-0.10.1/mathquill.js"></script>
<script>
    const MQ = MathQuill.getInterface(2);
</script>

<div id="buttons1">
    <button class="additionButton1" onclick="onAddButtonClick('1')"><span class="display">1</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('2')"><span class="display">2</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('3')"><span class="display">3</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('+')"><span class="display">+</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('4')"><span class="display">4</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('5')"><span class="display">5</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('6')"><span class="display">6</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('-')"><span class="display">-</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('7')"><span class="display">7</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('8')"><span class="display">8</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('9')"><span class="display">9</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('\\cdot')"><span class="display">\cdot</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('0')"><span class="display">0</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('\\pi')"><span class="display">\pi</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('\\e')"><span class="display">e</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('\\div')"><span class="display">\div</span></button>
    <button class="additionButton1" onclick="onAddButtonClick('\\=')"><span class="display">\=</span></button>
</div>

<div id="buttons2">
    <button class="additionButton2" onclick="onAddButtonClick('\\^{\\circ}')"><span class="display">x^{\circ}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\frac{}{}')"><span class="display">\frac{x}{y}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\sqrt{}')"><span class="display">\sqrt{x}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\nthroot[]{}')"><span class="display">\nthroot[n]{x}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('^2')"><span class="display">x^2</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('^')"><span class="display">x^n</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\left|\\right|')"><span class="display">\left|x\right|</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\log_{}\\left(\\right)')"><span class="display">\log_n{x}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\log{}\\left(\\right)')"><span class="display">\log{x}</span></button>
    <button class="additionButton2" onclick="onAddButtonClick('\\ln{}\\left(\\right)')"><span class="display">\ln{x}</span></button>
</div>

<div id="buttons3">
    <button class="additionButton3" onclick="onAddButtonClick('\\sin{}\\left(\\right)')"><span class="display">\sin{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\cos{}\\left(\\right)')"><span class="display">\cos{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\tan{}\\left(\\right)')"><span class="display">\tan{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\csc{}\\left(\\right)')"><span class="display">\csc{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\sec{}\\left(\\right)')"><span class="display">\sec{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\cot{}\\left(\\right)')"><span class="display">\cot{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arcsin{}\\left(\\right)')"><span class="display">\arcsin{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arccos{}\\left(\\right)')"><span class="display">\arccos{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arctan{}\\left(\\right)')"><span class="display">\arctan{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arccsc{}\\left(\\right)')"><span class="display">\arccsc{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arcsec{}\\left(\\right)')"><span class="display">\arcsec{x}</span></button>
    <button class="additionButton3" onclick="onAddButtonClick('\\arccot{}\\left(\\right)')"><span class="display">\arccot{x}</span></button>
</div>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<span id="input"></span>
<script>
    let eq = "";
    let answerSpan = document.getElementById("input");
    let answerMathField = MQ.MathField(answerSpan, {
        //spaceBehavesLikeTab: true;
        //leftRightIntoCmdGoes: false;
        handlers: {
            edit: function () {
                eq = answerMathField.latex(); // Get entered math in LaTeX format
            }
        }
    });
    answerMathField.focus();
    if (window.location.href.includes("eq=")) {
        let link = window.location.href;
        let latex = link.substring(link.indexOf("eq=") + 3, link.length);
        latex = latex.replaceAll("\\plus", "+");
        latex = latex.replaceAll("\\neg", "-");
        latex = latex.replaceAll("\\equals", "=");
        latex = latex.replaceAll("\\pow", "^");
        latex = latex.replaceAll("\\abs{", "\\left|");
        latex = latex.replaceAll("}abs", "\\right|");
        answerMathField.latex(latex);
    }

    let displays = document.getElementsByClassName("display");
    for (let i = 0; i < displays.length; i++) {
        MQ.StaticMath(displays[i]);
    }

    function onAddButtonClick(latex) {
        answerMathField.write(latex);
        answerMathField.focus();
    }

    function onGoButtonClick() {
        if (eq !== "") {
            eq = eq.replaceAll("+", "\\plus");
            eq = eq.replaceAll("-", "\\neg");
            eq = eq.replaceAll("=", "\\equals");
            eq = eq.replaceAll("^", "\\pow");
            eq = eq.replaceAll("\\left|", "\\abs{")
            eq = eq.replaceAll("\\right|", "}abs")
            window.location.href = "calculator.php?_ijt=fe4rd3dgnrh8o5753vfu4i78eh&_ij_reload=RELOAD_ON_SAVE&eq=" + eq;
        }
    }
</script>

<form>
    <input id="goButton" type="button" value="GO" onclick="onGoButtonClick()">
</form>

<br><br><br><br>

<?php
if (array_key_exists('eq', $_GET)) {
    $equation = $_GET['eq'];

    $output = null;
    exec("Calculator.exe $equation", $output);
    print_r($output);
}
?>

</body>
</html>