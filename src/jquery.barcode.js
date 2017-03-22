(function($){

	var barcode = {

		listenerObj: null,
		letter : false,
		number : true,
		check : true,

		oneKeyTime : '', /* 一次按键时间间隔 */
		twoKeyTime : '', /* 两次按键时间间隔 */
		keyDownTime: '', /* 键按下的时间    */
		barcodeLen : 8 , /* 条形码长度      */
		spanTime   : 70, /* 一次按键按下到释放的时间间隔 */
		zerokeyVal : 48, /* 零的key值      */
		ninekeyVal : 57, /* 数字9的key值   */
		akeyVal    : 65, /* a的key值      */
		zkeyVal    : 90, /* z的key值      */
		
		show : function(){},

		checkHandInput : function(){
					console.log(this.oneKeyTime);

			if((this.oneKeyTime > this.spanTime)){
				return true;
			}else{
				return false;
			}
		},
		on_key_down : function (){
			var that = this;
			this.listenerObj.keydown(function(e){

				if(e.which !== 13 && !(that.in_range(e.which))){
					$(that.listenerObj).val('');
					return ;
				}
				var d = new Date();
				var curTime = parseInt(d.getTime());
				if(that.keyDownTime !== '' && that.keyDownTime !== NaN){
					that.twoKeyTime = curTime - that.keyDownTime;
				}
				that.keyDownTime = curTime;
			});
		},
		on_key_up : function(){
			var that = this;
			this.listenerObj.keyup(function(e){
				var d = new Date();
				var keyUpTime = d.getTime();

				that.oneKeyTime = parseInt(keyUpTime) - parseInt(that.keyDownTime);

				var isHand = that.checkHandInput();

				if(that.check && isHand && that.in_range(e.which)){
					layer.msg('禁止手动输入');
					$(that.listenerObj).val("");
				}
			})
		},
		on_key_press : function(){
			var that = this;
			this.listenerObj.keypress(function(e){
				if(e.which == 13 && that.check_barcode()){
					that.createListEl();
				}
			});
		},
		check_barcode : function(){
			var code = $(this.listenerObj).val();

			if(code.length !== this.barcodeLen){
				$(this.listenerObj).val("").focus();
				// layer.msg('条形码不合法',{time : 800});
			}else{
				return true;
			}
		},
		//判断按下的键是否在字母加数字这个范围
		in_range : function(key){

			var isLegal = false;
			if(this.number){
				isLegal = this.is_number(key);
			}
			if(this.letter){
				isLegal = this.is_letter(key);
			}
			if(this.number && this.letter){
				isLegal = (this.is_number || this.is_letter)? true : false;
			}
			return isLegal;
		},
		is_number : function(key){
			if(key > this.ninekeyVal || key < this.zerokeyVal){
				return false;
			}else{
				return true;
			}
		},
		is_letter : function(key){
			if(key > this.zkeyVal || key < this.akeyVal){
				return false;
			}else{
				return true;
			}
		},
		check_network : function(){
			return (navigator.onLine)? true : false;
		},
		createListEl : function(){
			if(typeof this.show == 'function'){
				this.show(this.listenerObj.val());
				// layer.msg('扫描成功',{time:1000});
			}else{
				layer.msg('no callback function');
			}
			this.listenerObj.val("").focus();
		},
		keepFocusInput : function(){
			this.listenerObj.blur(function(){
				var that = $(this);
				setTimeout(function(){ 
					that.focus().select();
				},300);
			});
		},
		startListen : function(listenerObj, settings){
			for(var member in settings){
				if(typeof barcode[member] !== 'undefined'){
					barcode[member] = settings[member];
				}
			}
			barcode.listenerObj = listenerObj;

			this.on_key_down();
			this.on_key_up();
			this.on_key_press();
			this.keepFocusInput();
			this.listenerObj.focus().select();
		}

	};
	$.fn.startListen = function(options){
		var settings = $.extend({
			barcodeLen : 8,
			letter : false,//条码不包含字母
			number : true, //条码为数字
		},options);
		barcode.startListen(this,settings);
	}

})(jQuery);