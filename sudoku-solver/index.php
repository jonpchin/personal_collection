<!DOCTYPE html>
<!--Sudoku Solver by Jonathan Chin -->
<html>
    <head>
        <title>Sudoku Solver</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="style.css" rel="stylesheet" type = "text/css"/>
    </head>
    <body>
        <div>Please enter your numbers in the Sudoku grid on the left and click Solve. The solved Sudoku will appear on the right. Javascript must be enabled in your browser for this to work.</div>
		<table border="1" class="inlineTable">
            <?php
				for ($i=0; $i<9; $i++){
					echo '<tbody><tr>';
					for($j=1; $j<=9; $j++){
						echo '<th><input type="text" onkeyup="ValidatePassKey(this)" maxlength="1"
							id="' . ($i * 9 + $j) .'"  name="box" value="" onkeypress="return isNumber(event)"
							style="height: 30px; width: 30px; font-size: 25px;"/></th>';
					}	
					echo '</tr></tbody>';
				}
            ?> 
		</table>
        <input type="submit" value="Solve" name="solve" onClick=solve() />
		<table border="1" class="inlineTable">
            <?php
				for ($i=0; $i<9; $i++){
					echo '<tbody><tr>';
					for($j=1; $j<=9; $j++){
						echo '<th><input type="text" onkeyup="ValidatePassKey(this)" maxlength="1"
							id="new' . ($i * 9 + $j) .'"  name="box" value="" onkeypress="return isNumber(event)"
							style="height: 30px; width: 30px; font-size: 25px;"/></th>';
					}	
					echo '</tr></tbody>';
				}
            ?> 
		</table>
        <script src="solve.js" type="text/javascript"></script>
    </body>
</html>
