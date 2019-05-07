var GAME_OVER = false
var TURN_NUMBER = 0
var LEVEL = 0
var PLAYER_SYMBOL = '1'
var BOT_SYMBOL = '0'
var EMPTY_SYMBOL = '?'
var GRID = [[EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL], [EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL], 
			[EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL]]
var CORNERS = [ [0, 0], [0, 2], [2, 0], [2,2] ]
var MIDDLES = [ [0, 1], [1, 0], [1, 2], [2, 1] ]
var POSITIONS = { 1: [0, 0], 2: [0, 1], 3: [0, 2], 4: [1, 0], 
				5: [1, 1], 6: [1, 2], 7: [2, 0], 8: [2, 1], 9: [2, 2] }
// ======================= GLOABAL VARIABLES =========================


// Generate random integer in between & including min-max
function randint(min, max) {
    return Math.floor(Math.random() * (max+1 - min) + min);
}

// Returns array length
function array_len(ARRAY){
	var len = 0;
	for ( let el in ARRAY ){
		len += 1;
	}
	return len
}

// Gives a random corner position
function random_corner_choice(){
	var min = 0
	var max = array_len(CORNERS) - 1
	return CORNERS[randint(min, max)]
}

// Bot play handler
function bot_play(turn){
	if ( LEVEL == 0 ) easy_level()
	if ( LEVEL == 0.5 ) medium_level()
	if ( LEVEL == 1 ) hard_level()
}

// HELPER: return back-end grid position from front-end selector
function get_rc_from_selector(selector){
	if ( selector == 'row1-col1' ) return [0, 0]
	if ( selector == 'row1-col2' ) return [0, 1]
	if ( selector == 'row1-col3' ) return [0, 2]
	if ( selector == 'row2-col1' ) return [1, 0]
	if ( selector == 'row2-col2' ) return [1, 1]
	if ( selector == 'row2-col3' ) return [1, 2]
	if ( selector == 'row3-col1' ) return [2, 0]
	if ( selector == 'row3-col2' ) return [2, 1]
	if ( selector == 'row3-col3' ) return [2, 2]
}

// HELPER: return front-end selector from back-end grid position
function get_selector_from_rc(r, c){
	if ( r==0 && c==0 ) return 'row1-col1'
	if ( r==0 && c==1 ) return 'row1-col2'
	if ( r==0 && c==2 ) return 'row1-col3'
	if ( r==1 && c==0 ) return 'row2-col1'
	if ( r==1 && c==1 ) return 'row2-col2'
	if ( r==1 && c==2 ) return 'row2-col3'
	if ( r==2 && c==0 ) return 'row3-col1'
	if ( r==2 && c==1 ) return 'row3-col2'
	if ( r==2 && c==2 ) return 'row3-col3'
}

// HANDLES DIFFICULTY SETTING 
function set_difficulty(value){
	if ( value == '1' ){ // hard
		$('#hard').removeClass('btn-danger').addClass('btn-success');
		$('#medium').removeClass('btn-success').addClass('btn-danger');
		$('#easy').removeClass('btn-success').addClass('btn-danger');
	}else if ( value == '0') { // easy
		$('#easy').removeClass('btn-danger').addClass('btn-success');
		$('#medium').removeClass('btn-success').addClass('btn-danger');
		$('#hard').removeClass('btn-success').addClass('btn-danger');
	}else{	// medium
		$('#medium').removeClass('btn-danger').addClass('btn-success');
		$('#hard').removeClass('btn-success').addClass('btn-danger');
		$('#easy').removeClass('btn-success').addClass('btn-danger');
	}
	LEVEL = Number(value);
	restart_game()
	if ( LEVEL == 1 ) {
		console.log("Hard");
	}else if ( LEVEL == 0 ) {
		console.log('Easy')
	}else{
		console.log("Medium");
	}
}

// Check for a possible row win
function row_check(){
	for(let r=0; r<3; ++r){
		if ( GRID[r][0] == GRID[r][1] && GRID[r][0] == GRID[r][2] && GRID[r][2] != EMPTY_SYMBOL ) {
			return [GRID[r][0], true]
		}
	}
	return null
}

// Check for a possible column win
function col_check(){
	for(let c=0; c<3; ++c){
		if (GRID[0][c] == GRID[1][c] && GRID[0][c] == GRID[2][c] && GRID[2][c] != EMPTY_SYMBOL ) {
			return [GRID[0][c], true]
		}
	}
	return null
}

// Check for a diagonal win
function diagonal_check(){
	var d1 = GRID[0][0] == GRID[1][1] && GRID[0][0] == GRID[2][2] && GRID[2][2] != EMPTY_SYMBOL
	var d2 = GRID[0][2] == GRID[1][1] && GRID[0][2] == GRID[2][0] && GRID[2][0] != EMPTY_SYMBOL
	if ( d1 || d2 ) {
		return [ GRID[1][1], true ]
	}
	return null
}

// Game over check
function game_over_check(){
	if ( row_check() != null ) return row_check(); // [winner_symbol, true]
	if ( col_check() != null ) return col_check() // [winner_symbol, true]
	if ( diagonal_check() != null ) return diagonal_check() // [winner_symbol, true]
	for (let r=0; r<3; ++r) { // Check whether the game is still on
		for (var c=0; c<3; ++c) {
			if ( GRID[r][c] == EMPTY_SYMBOL ) {
				return null // ensures game is not over
			}
		}
	}
	return [EMPTY_SYMBOL, true] // true stands for game over
}

// Show game result info.
function post_game_over_action(symbol) {
	if ( symbol == EMPTY_SYMBOL ){
		$("#info").html("Draw! tight game!<br><br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}else if ( symbol == BOT_SYMBOL ){
		$('#info').html("Whoaa! Bot won the game.<br><br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}else if ( symbol == PLAYER_SYMBOL ) {
		$('#info').html("Congrats! You won the game.<br><br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}
}

// Clears the GRID
function clean_backend_grid(){
	for ( let r=0; r<3; ++r ) {
		for (var c = 0; c<3; ++c) {
			GRID[r][c] = EMPTY_SYMBOL
		}
	}
}

// Clears the playground
function clean_frontend_grid(){
	$('#info').html('')
	$('#row1-col1').removeClass('text-warning').removeClass('text-white').html('')
	$('#row1-col2').removeClass('text-warning').removeClass('text-white').html('')
	$('#row1-col3').removeClass('text-warning').removeClass('text-white').html('')
	$('#row2-col1').removeClass('text-warning').removeClass('text-white').html('')
	$('#row2-col2').removeClass('text-warning').removeClass('text-white').html('')
	$('#row2-col3').removeClass('text-warning').removeClass('text-white').html('')
	$('#row3-col1').removeClass('text-warning').removeClass('text-white').html('')
	$('#row3-col2').removeClass('text-warning').removeClass('text-white').html('')
	$('#row3-col3').removeClass('text-warning').removeClass('text-white').html('')
}

// Restarts the game by setting parameters to its initial values
function restart_game(){
	TURN_NUMBER = 0
	GAME_OVER = false
	clean_backend_grid()
	clean_frontend_grid()
}

// Check for a row win move
function check_for_a_row_win(r, symbol){
	if ( GRID[r][0] == symbol && GRID[r][1] == symbol && GRID[r][2] == EMPTY_SYMBOL ) return [r, 2]
	if ( GRID[r][0] == symbol && GRID[r][2] == symbol && GRID[r][1] == EMPTY_SYMBOL ) return [r, 1]
	if ( GRID[r][1] == symbol && GRID[r][2] == symbol && GRID[r][0] == EMPTY_SYMBOL ) return [r, 0]
	return null
}

// Check for a column win move
function check_for_a_col_win(c, symbol){
	if ( GRID[0][c] == symbol && GRID[1][c] == symbol && GRID[2][c] == EMPTY_SYMBOL ) return [2, c]
	if ( GRID[0][c] == symbol && GRID[2][c] == symbol && GRID[1][c] == EMPTY_SYMBOL ) return [1, c]
	if ( GRID[1][c] == symbol && GRID[2][c] == symbol && GRID[0][c] == EMPTY_SYMBOL ) return [0, c]
	return null
}

// Check for a diagonal win move
function check_for_a_diagonal_win(symbol){
	// Diagonal 1
	if ( GRID[0][0] == symbol && GRID[1][1] == symbol && GRID[2][2] == EMPTY_SYMBOL ) return [2, 2]
	if ( GRID[0][0] ==  symbol && GRID[2][2] == symbol && GRID[1][1] == EMPTY_SYMBOL ) return [1, 1]
	if ( GRID[1][1] == symbol && GRID[2][2] == symbol && GRID[0][0] == EMPTY_SYMBOL ) return [0, 0]
	// Diagonal 2
	if ( GRID[0][2] == symbol && GRID[1][1] == symbol && GRID[2][0] == EMPTY_SYMBOL ) return [2, 0]
	if ( GRID[0][2] == symbol && GRID[2][0] == symbol && GRID[1][1] == EMPTY_SYMBOL ) return [1, 1]
	if ( GRID[1][1] == symbol && GRID[2][0] == symbol && GRID[0][2] == EMPTY_SYMBOL ) return [0, 2]
	return null
}

// Check possible winning move
function check_for_win_play(symbol){
	for ( let row=0; row<3; ++row ){
		row_ck = check_for_a_row_win(row, symbol)
		if ( row_ck != null ) return row_ck
	}
	for ( let col=0; col<3; ++col ){
		col_ck = check_for_a_col_win(col, symbol)
		if ( col_ck != null ) return col_ck
	}
	diag_ck = check_for_a_diagonal_win(symbol)
	if ( diag_ck != null ) return diag_ck
	return null
}

// Make a smart move
function progressive_play(){
	if ( GRID[0][0] == GRID[2][2] && GRID[0][0] == PLAYER_SYMBOL ) {
		$('#'+get_selector_from_rc(1,0)).addClass('text-warning').html('&#10008;')
		GRID[1][0] = BOT_SYMBOL; return
	}
	if ( GRID[0][2] == GRID[2][0] && GRID[0][2] == PLAYER_SYMBOL ) {
		$('#'+get_selector_from_rc(1,2)).addClass('text-warning').html('&#10008;')
		GRID[1][2] = BOT_SYMBOL; return
	}
	for(let index in CORNERS){
		[r, c] = CORNERS[index]
		if ( GRID[r][c] == EMPTY_SYMBOL ){
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
			return
		}
	}
	for(let index in MIDDLES){
		[r, c] = MIDDLES[index]
		if ( GRID[r][c] == EMPTY_SYMBOL ) {
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
			return
		}
	}
}

// BOT play for level => hard
function hard_level(){
	if ( TURN_NUMBER == 0 ) { // First turn
		if ( GRID[1][1] == PLAYER_SYMBOL ) {
			[r, c] = random_corner_choice()
			GRID[r][c] = BOT_SYMBOL
			selector = get_selector_from_rc(r,c)
		}else{
			GRID[1][1] = BOT_SYMBOL
			selector = get_selector_from_rc(1,1)
		}
		TURN_NUMBER++
		$('#'+selector).addClass('text-warning').html('&#10008;') // cross icon
		return null
	}else{
		if ( check_for_win_play(BOT_SYMBOL) != null ) { // Try for a win move
			[r, c] = check_for_win_play(BOT_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
			return null
		}
		if ( check_for_win_play(PLAYER_SYMBOL) != null ) { // block player win
			[r, c] = check_for_win_play(PLAYER_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
			return null
		}
		progressive_play() // Try for a progressive win play
		return null
	}
}

// Make a random irational move
function make_a_foolish_move() {
	easy_level();
}

// BOT play for level => medium
function medium_level(){
	if ( TURN_NUMBER == 0 ) { // First turn
		if ( GRID[1][1] == PLAYER_SYMBOL ) {
			[r, c] = random_corner_choice()
			GRID[r][c] = BOT_SYMBOL
			selector = get_selector_from_rc(r,c)
		}else{
			GRID[1][1] = BOT_SYMBOL
			selector = get_selector_from_rc(1,1)
		}
		TURN_NUMBER++
		$('#'+selector).addClass('text-warning').html('&#10008;') // cross icon
		return null
	}else{
		if ( check_for_win_play(BOT_SYMBOL) != null ) { // Try for a win
			[r, c] = check_for_win_play(BOT_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
			TURN_NUMBER++
			return null
		}
		if ( TURN_NUMBER < 3 ){ // Block player win
			if ( check_for_win_play(PLAYER_SYMBOL) != null ) {
				[r, c] = check_for_win_play(PLAYER_SYMBOL)
				GRID[r][c] = BOT_SYMBOL
				$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
				TURN_NUMBER++
				return null
			}
		}
		make_a_foolish_move() // make foolish move
		TURN_NUMBER++
		return null
	}
}

// BOT play for level => easy
function easy_level(){
	if ( check_for_win_play(BOT_SYMBOL) != null ) {
		[r, c] = check_for_win_play(BOT_SYMBOL)
		GRID[r][c] = BOT_SYMBOL
		$('#'+get_selector_from_rc(r,c)).addClass('text-warning').html('&#10008;')
		return null
	}
	while (true){
		[r, c] = POSITIONS[randint(1,9)]
		if ( GRID[r][c] == EMPTY_SYMBOL ){
			GRID[r][c] = BOT_SYMBOL;
			$('#'+get_selector_from_rc(r, c)).addClass('text-warning').html('&#10008;')
			return
		}
	}
}

// Play handler
function player_turn(ID){
	if( !GAME_OVER ){
		[r, c] = get_rc_from_selector(ID) // target position
		if ( GRID[r][c] == '?' ) {
			GRID[r][c] = PLAYER_SYMBOL;
			$('#'+ID).addClass('text-white').html('&#10004;') // set player icon
			if ( game_over_check() != null ) { // if game over
				GAME_OVER = true
				post_game_over_action(game_over_check()[0]) // game_over_check()[0] = symbol 
				return
			}
			bot_play();
			if ( game_over_check() != null ) { // if game over
				GAME_OVER = true
				post_game_over_action(game_over_check()[0])
				return
			}
		}else{
			alert("Position already filled.")
		}
	}else{
		alert("Game is over!")
	}
	return
}

