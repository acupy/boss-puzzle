(function(BM){
	BM.NotificationManager = function(){
	}

	BM.NotificationManager.error = function(msg){
		BM.NotificationManager.genericMessage(msg, 'error-msg');
	}
	BM.NotificationManager.warning = function(msg){
		BM.NotificationManager.genericMessage(msg, 'warning-msg');
	}
	BM.NotificationManager.info = function(msg){
		BM.NotificationManager.genericMessage(msg, 'info-msg');
	}
	BM.NotificationManager.success = function(msg){
		BM.NotificationManager.genericMessage(msg, 'success-msg');
	}
	BM.NotificationManager.genericMessage = function(msg, cssClass){
		var msgDiv = document.createElement('div');
		msgDiv.className = cssClass;
		msgDiv.appendChild(document.createTextNode(msg));
		document.body.appendChild(msgDiv);
		var removeMsg = function(msgDiv){
			return function(){
					document.body.removeChild(msgDiv);
				}
		};
		var hideMsg = function(msgDiv, callback){
			return function(){
					msgDiv.className += ' hidden';
					setTimeout(callback(msgDiv), 1000);
				}
		};

		setTimeout(hideMsg(msgDiv, removeMsg), 2000);
	}
})(window.BM = window.BM || {});

