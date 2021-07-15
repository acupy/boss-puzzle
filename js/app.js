(function(NotificationManager){
	// Controller
	function BoardManagerController(dim){
		this.dim = dim;
		this.maxValue = (this.dim * this.dim) - 1;
		this.mtxArray = [];
	}

	BoardManagerController.prototype = {
		constructor: BoardManagerController,
		generateMtx: function(){
			var mtx = [];
			var possibleValues = this.getPossibleValues();
			for(var i=0; i < this.dim; i++){
				mtx.push([]);
				for(var j=0; j < this.dim; j++){
					var rnd_idx = Math.floor(Math.random() * possibleValues.length);
					mtx[i][j] = possibleValues.splice(rnd_idx, 1)[0];
					this.mtxArray.push(mtx[i][j]);
				}
			}
			return mtx;
		},
		getMtx: function(){
			var mtx = this.generateMtx();
			while (!this.isSolvable(mtx)) {
				mtx = this.generateMtx();
			}
			return mtx;
		},
		isSolvable: function(mtx){
			var inversionCnt = 0;
			for(var i=0; i<this.mtxArray.length-2; i++){
				for(var j=i+1; j<this.mtxArray.length-i-1; j++){
					if (this.mtxArray[i] === '' || this.mtxArray[j] === '') {
						break;
					}
					if( this.mtxArray[i]>this.mtxArray[j] ) {
						inversionCnt += 1;
					}
				}
			}
			return inversionCnt % 2 === 0 ? true : false;
		},
		getPossibleValues: function(){
			var values = [];
			for(var i=1; i<=this.maxValue; i++){
				values.push(i);		
			}
			return values;
		}
	}

	// View

	function BoardManagerView(controller){
		this.controller = controller;
		this.grid;
		this.mtx;
		this.emptyCell = [controller.dim - 1, controller.dim - 1];
	}
	BoardManagerView.prototype = {
		initGrid: function(){
			this.grid = this.grid || document.getElementById('grid');
			this.clearGrid();
			this.grid.style.width = this.controller.dim * 100 + this.controller.dim * 2;
			this.grid.style.height = this.controller.dim * 100 + this.controller.dim * 2;
			this.grid.style.outline = '5px solid black';
		},
		generateBoard: function(regenerate){
			this.initGrid();
			this.mtx = regenerate ? this.controller.getMtx() : this.mtx;
			for (var row in this.mtx){
				for (var item in this.mtx[row]){
					var label = this.mtx[row][item] ? this.mtx[row][item].toString() : '';
					this.addNewCell(label, row, item);
				}
			}
		},
		clearGrid: function(){
			while (this.grid.firstChild) {
			    this.grid.removeChild(this.grid.firstChild);
			}
		},
		addNewCell: function(cellContent, row, item){
			var div = document.createElement('div');
			var content = document.createTextNode(cellContent);
			div.className = cellContent ? 'cell' : 'cell-blank';
			div.appendChild(content);
			div.addEventListener('click', this.clickCell(this, row, item));
			this.grid.appendChild(div);
		},
		clickCell: function(bmv, row, item){
		
			return function(event){
				event.stopPropagation();
				if (bmv.emptyCell[0] == row && bmv.emptyCell[1] == item){
					return;
				}
				else if(bmv.isNeighborCell(parseInt(bmv.emptyCell[0]), parseInt(bmv.emptyCell[1]), parseInt(row), parseInt(item))){
					var tmpValue = bmv.mtx[row][item];
					bmv.mtx[row][item] = bmv.mtx[bmv.emptyCell[0]][bmv.emptyCell[1]];
					bmv.mtx[bmv.emptyCell[0]][bmv.emptyCell[1]] = tmpValue;
					bmv.emptyCell = [row, item];
					bmv.generateBoard(false);
					bmv.isComplete(bmv);
				}
				else{
					NotificationManager.error('Stop Cheating!!!');
				}
			}
		},
		isNeighborCell: function(row, item, rowNeighbor, itemNeighbor){
			// is same row: left or right
			if((row === rowNeighbor) && ( item - 1 === itemNeighbor || item + 1 === itemNeighbor )){
				return true;
			}
			// is same column: above or below
			else if((item === itemNeighbor) && ( row - 1 === rowNeighbor || row + 1 === rowNeighbor )){
				return true;
			}
			// not neighbour
			else{
				return false;
			}
		},
		isComplete: function(bmv){
			var previousValue = 0;
			for(var row in bmv.mtx){
				for(var item in bmv.mtx[row]){
					var currentValue = parseInt(bmv.mtx[row][item]);
					if ((parseInt(row) === bmv.controller.dim - 1) && (parseInt(item) === bmv.controller.dim - 1)){
						NotificationManager.success('!!!WINNER!!!');
					}
					else if (previousValue + 1 != currentValue){
						return;	
					}
					previousValue = currentValue;
				}
			}
		}
	}

	// Test
	function BoardManagerControllerTest(){
		var bm = new BoardManagerController(5);
		var mtx = bm.getMtx();
		var test_set = [];
		for (var row in mtx){
			for (var item in mtx[row]){
				test_set.push(mtx[row][item]);
			}
		}
		console.log(test_set);
		console.log(test_set.sort(function(a, b){return a-b}));
	}

	function btnGenerateClick(){
		var dim = document.getElementById('dim').value;
		var bmv = new BoardManagerView(new BoardManagerController(dim));
		bmv.generateBoard(true);
	}

	window.onload = function(){
		var btnGenerate = document.getElementById('btnGenerate');
		btnGenerate.addEventListener('click', btnGenerateClick);
	}

})(window.BM.NotificationManager);
// Run
//(function run(){
	//BoardManagerControllerTest();	
//	var bmc = new BoardManagerController(3);
//	var bmv = new BoardManagerView(bmc);
//	bmv.generateBoard();
//})();

