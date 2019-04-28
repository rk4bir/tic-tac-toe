// ======================= GLOABAL VARIABLES =========================

// Track BOT's turn
BOT_TURN = false

// BOT turn no. track
TURN_NUMBER = 0

// Game level
var LEVEL = 0

// Symbols
var PLAYER_SYMBOL = '1'
var BOT_SYMBOL = '0'
var EMPTY_SYMBOL = '?'

// The board GRID
var GRID = [[EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL], [EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL], 
			[EMPTY_SYMBOL, EMPTY_SYMBOL, EMPTY_SYMBOL]]


// Corners
var CORNERS = [ [0, 0], [0, 2], [2, 0], [2,2] ]

// Middles
var MIDDLES = [ [0, 1], [1, 0], [1, 2], [2, 1] ]

// Numeric positions on the 2D GRID playground
var POSITIONS = { 1: [0, 0], 2: [0, 1], 3: [0, 2], 4: [1, 0], 
				5: [1, 1], 6: [1, 2], 7: [2, 0], 8: [2, 1], 9: [2, 2] }

// ======================= GLOABAL VARIABLES =========================








// =========== RANDOM NUMBER AND CHOICE MAKING FUNCTION ==============

function randint(min, max) {
    return Math.floor(Math.random() * (max+1 - min) + min);
}

function array_len(ARRAY){
	var len = 0;
	for ( var el in ARRAY ){
		len += 1;
	}
	return len
}

function random_corner_choice(){
	var min = 0
	var max = array_len(CORNERS) - 1
	return CORNERS[randint(min, max)]
}

// =========== RANDOM NUMBER AND CHOICE MAKING FUNCTION ==============









/*=====================GAME OVER CHECK FUNCTIONS======================*/

function row_check(){
	/*
		Check all rows whether the row is filled with same icon/symbol,
		return won symbol and true or '' and false as a list
	*/
	for(var r=0; r<3; ++r){
		if ( GRID[r][0] == GRID[r][1] && GRID[r][0] == GRID[r][2] && GRID[r][2] != EMPTY_SYMBOL ) {
			return [GRID[r][0], true]
		}
	}
	return null
}

function col_check(){
	/*	
		Check all coloumns whether the it is filled with same icon/symbol. 
		return won symbol and true or '' and false as a list
	*/
	for(var c=0; c<3; ++c){
		if (GRID[0][c] == GRID[1][c] && GRID[0][c] == GRID[2][c] && GRID[2][c] != EMPTY_SYMBOL ) {
			return [GRID[0][c], true]
		}
	}
	return null
}

function diagonal_check(){
	/*
	    Check whether the GRID has same symbol/icon along it's two diagonals.
	    return won symbol and true or '' and false as a list
	*/
	var d1 = GRID[0][0] == GRID[1][1] && GRID[0][0] == GRID[2][2] && GRID[2][2] != EMPTY_SYMBOL
	var d2 = GRID[0][2] == GRID[1][1] && GRID[0][2] == GRID[2][0] && GRID[2][0] != EMPTY_SYMBOL
	if ( d1 || d2 ) {
		return [ GRID[1][1], true ]
	}
	return null
}

function game_over_check(){
	/*
	    Checks whether the game is over. If game is over, then prints the 
	    result and exit the game.
	    ['symbol', ture or false]
	    true means game is over
	*/
	if ( row_check() != null ){
		return row_check(); // returns [symbol, true]
	}
	if ( col_check() != null ){
		return col_check() // returns [symbol, true]
	}
	if ( diagonal_check() != null ){
		return diagonal_check() // returns [symbol, true]
	}
	
	// Checks whether any empty space is found
	// meaning if empty is still in grid play must go on
	// that's why it return without closing the game
	for (var r=0; r<3; ++r) {
		for (var c=0; c<3; ++c) {
			if ( GRID[r][c] == EMPTY_SYMBOL ) {
				return null
			}
		}
	}
	return [EMPTY_SYMBOL, true]
}

function post_game_over_action(symbol) {
	if ( symbol == EMPTY_SYMBOL ){
		$("#info").html("Draw! Whatta match!<br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}else if ( symbol == BOT_SYMBOL ){
		$('#info').html("Ahha! Bot won the game.<br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}else if ( symbol == PLAYER_SYMBOL ) {
		$('#info').html("Congrats! You won the game.<br><button onclick='restart_game();' class='btn btn-sm btn-info'>Restart Game</button>")
	}
}

function clean_backend_grid(){
	for ( var r=0; r<3; ++r ) {
		for (var c = 0; c<3; ++c) {
			GRID[r][c] = EMPTY_SYMBOL
		}
	}
	TURN_NUMBER = 0
}

function clean_frontend_grid(){
	$('#info').html('')
	$('#row1-col1').removeClass('text-dark').removeClass('text-white').html('')
	$('#row1-col2').removeClass('text-dark').removeClass('text-white').html('')
	$('#row1-col3').removeClass('text-dark').removeClass('text-white').html('')
	$('#row2-col1').removeClass('text-dark').removeClass('text-white').html('')
	$('#row2-col2').removeClass('text-dark').removeClass('text-white').html('')
	$('#row2-col3').removeClass('text-dark').removeClass('text-white').html('')
	$('#row3-col1').removeClass('text-dark').removeClass('text-white').html('')
	$('#row3-col2').removeClass('text-dark').removeClass('text-white').html('')
	$('#row3-col3').removeClass('text-dark').removeClass('text-white').html('')
}

function restart_game(){
	BOT_TURN = 0
	clean_backend_grid()
	clean_frontend_grid()
}
/*=====================GAME OVER CHECK FUNCTIONS======================*/













// =============== POSSIBLE WIN MOVE HELPER FUNCTIONS ======================

function check_for_a_row_win(r, symbol){
	if ( GRID[r][0] == symbol && GRID[r][1] == symbol && GRID[r][2] == EMPTY_SYMBOL ) return [r, 2]
	if ( GRID[r][0] == symbol && GRID[r][2] == symbol && GRID[r][1] == EMPTY_SYMBOL ) return [r, 1]
	if ( GRID[r][1] == symbol && GRID[r][2] == symbol && GRID[r][0] == EMPTY_SYMBOL ) return [r, 0]
	return null
}

function check_for_a_col_win(c, symbol){
	if ( GRID[0][c] == symbol && GRID[1][c] == symbol && GRID[2][c] == EMPTY_SYMBOL ) return [2, c]
	if ( GRID[0][c] == symbol && GRID[2][c] == symbol && GRID[1][c] == EMPTY_SYMBOL ) return [1, c]
	if ( GRID[1][c] == symbol && GRID[2][c] == symbol && GRID[0][c] == EMPTY_SYMBOL ) return [0, c]
	return null
}

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

function check_for_win_play(symbol){
	for ( var row=0; row<3; ++row ){
		row_ck = check_for_a_row_win(row, symbol)
		if ( row_ck != null ) return row_ck
	}
	for ( var col=0; col<3; ++col ){
		col_ck = check_for_a_col_win(col, symbol)
		if ( col_ck != null ) return col_ck
	}
	diag_ck = check_for_a_diagonal_win(symbol)
	if ( diag_ck != null ) return diag_ck
	return null
}

// =============== POSSIBLE WIN MOVE HELPER FUNCTIONS ======================













// ========================= HARD LEVEL PLAY FUNCTIONS =====================

function progressive_play(){
	if ( GRID[0][0] == GRID[2][2] && GRID[0][0] == PLAYER_SYMBOL ) {
		$('#'+get_selector_from_rc(1,0)).addClass('text-dark').html('&#10008;')
		GRID[1][0] = BOT_SYMBOL; return
	}
	if ( GRID[0][2] == GRID[2][0] && GRID[0][2] == PLAYER_SYMBOL ) {
		$('#'+get_selector_from_rc(1,2)).addClass('text-dark').html('&#10008;')
		GRID[1][2] = BOT_SYMBOL; return
	}
	for(var index in CORNERS){
		[r, c] = CORNERS[index]
		if ( GRID[r][c] == EMPTY_SYMBOL ){
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return
		}
	}
	for(var index in MIDDLES){
		[r, c] = MIDDLES[index]
		if ( GRID[r][c] == EMPTY_SYMBOL ) {
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return
		}
	}
}

function hard_level(){
	// BOT play for level => hard
	// First turn
	if ( TURN_NUMBER == 0 ) {
		if ( GRID[1][1] == PLAYER_SYMBOL ) {
			[r, c] = random_corner_choice()
			GRID[r][c] = BOT_SYMBOL
			selector = get_selector_from_rc(r,c)
		}else{
			GRID[1][1] = BOT_SYMBOL
			selector = get_selector_from_rc(1,1)
		}
		TURN_NUMBER++
		$('#'+selector).addClass('text-dark').html('&#10008;') // cross icon
		return null
	}else{
		// Attempt for a BOT win
		if ( check_for_win_play(BOT_SYMBOL) != null ) {
			[r, c] = check_for_win_play(BOT_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return null
		}
		// Check for a Player win and block it
		if ( check_for_win_play(PLAYER_SYMBOL) != null ) {
			[r, c] = check_for_win_play(PLAYER_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return null
		}
		// Try for a progressive win play
		progressive_play()
		return null
	}
}

// ========================= HARD LEVEL PLAY FUNCTIONS =====================









// EASY LEVEL PLAY FUNCTION
function easy_level(){
	// BOT play for level => easy
	while (true){
		[r, c] = POSITIONS[randint(1,9)]
		if ( GRID[r][c] == EMPTY_SYMBOL ){
			GRID[r][c] = BOT_SYMBOL;
			$('#'+get_selector_from_rc(r, c)).addClass('text-dark').html('&#10008;')
			return
		}
	}
}


// ==================== MEDIUM LEVEL PLAY FUNCTION ===================

function make_a_foolish_move() {
	while (true) {
		[r, c] = POSITIONS[randint(1,9)]
		if ( GRID[r][c] == EMPTY_SYMBOL ){
			GRID[r][c] = BOT_SYMBOL;
			$('#'+get_selector_from_rc(r, c)).addClass('text-dark').html('&#10008;')
			return
		}
	}
}

function medium_level(){
	// BOT play for level => medimu
	// First turn
	if ( TURN_NUMBER == 0 ) {
		if ( GRID[1][1] == PLAYER_SYMBOL ) {
			[r, c] = random_corner_choice()
			GRID[r][c] = BOT_SYMBOL
			selector = get_selector_from_rc(r,c)
		}else{
			GRID[1][1] = BOT_SYMBOL
			selector = get_selector_from_rc(1,1)
		}
		TURN_NUMBER++
		$('#'+selector).addClass('text-dark').html('&#10008;') // cross icon
		return null
	}else{
		// Attempt for a BOT win
		if ( check_for_win_play(BOT_SYMBOL) != null ) {
			[r, c] = check_for_win_play(BOT_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return null
		}
		// Check for a Player win and block it
		if ( check_for_win_play(PLAYER_SYMBOL) != null ) {
			[r, c] = check_for_win_play(PLAYER_SYMBOL)
			GRID[r][c] = BOT_SYMBOL
			$('#'+get_selector_from_rc(r,c)).addClass('text-dark').html('&#10008;')
			return null
		}
		// Try for a random foolish move
		make_a_foolish_move()
		return null
	}
}


// PLAY ACCORDING TO CURRENT LEVEL
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
		$('#hard').removeClass('btn-danger');
		$('#hard').addClass('btn-success');
		$('#medium').removeClass('btn-success');
		$('#medium').addClass('btn-danger');
		$('#easy').removeClass('btn-success');
		$('#easy').addClass('btn-danger');
	}else if ( value == '0') { // easy
		$('#easy').removeClass('btn-danger');
		$('#easy').addClass('btn-success');
		$('#medium').removeClass('btn-success');
		$('#medium').addClass('btn-danger');
		$('#hard').removeClass('btn-success');
		$('#hard').addClass('btn-danger');
	}else{	// medium
		$('#medium').removeClass('btn-danger');
		$('#medium').addClass('btn-success');
		$('#hard').removeClass('btn-success');
		$('#hard').addClass('btn-danger');
		$('#easy').removeClass('btn-success');
		$('#easy').addClass('btn-danger');
	}
	LEVEL = Number(value);
	clean_backend_grid()
	clean_frontend_grid()
	if ( LEVEL == 1 ) {
		console.log("Hard");
	}else if ( LEVEL == 0 ) {
		console.log('Easy')
	}else{
		console.log("Medium");
	}
}


// PLAYER MOVE HANDLES AND MAKE BOT MOVE
// BASICALLY HANDLES A PAIR OF MOVE: PLAYER => BOT
function player_turn(ID){
	/* 
		allow to make change only if it's player's 
		and not bot's turn
	*/
	[r, c] = get_rc_from_selector(ID) // target position
	if ( GRID[r][c] == '?' ) {
		GRID[r][c] = PLAYER_SYMBOL;
		// set tick icon for player
		$('#'+ID).addClass('text-white').html('&#10004;')
		// if game over
		if ( game_over_check() != null ) { 
			// passing output symbol
			post_game_over_action(game_over_check()[0])
			return
		}
		// bot play
		bot_play();
		// if game over
		if ( game_over_check() != null ) {
			// passing output symbol
			post_game_over_action(game_over_check()[0])
			return
		}
	}else{
		// show position is already filled
		$('#info').html("Position already filled.")
	}
	return
}

