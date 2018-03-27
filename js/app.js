var download = function (content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};
var app = new Vue({
	el: '#app',
	data: {
		// 基础参数
		width: "1280",
		height: "720",
		scWidth: 1,
		scHeight: 1,
		quizNumRow: 8,

		// 控制台
		controlDisplay: true,

		// 问题
		quizList: [
			
		],
		quizIdx: 0,// 当前正在显示的问题列表
		quizDisplay: false,
	},
	filters:{
		quizNum: function(idx){
			return ('0'+(idx+1)).slice(-2);
		}
	},
	methods:{
		uploadImg: function(e){
			var self = this;
			var fileData = e.target.files[0];
			// 控制大小
			if (fileData.size > 5000000) {
				alert("上传文件不能大于5M");
				return;
			}
			var reader = new FileReader();
			reader.readAsDataURL(fileData);
			reader.onload = function (e) {
				self.quizList = self.quizList.concat([{
					img: this.result,
					done: false
				}]);
			}
		},
		downloadCfg: function(){
			var cfg = {};
			cfg.quizList = [];
			for (var i = this.quizList.length - 1; i >= 0; i--) {
				cfg.quizList.push({
					img: this.quizList[i]['img'],
					done: false
				});
			}
			download(JSON.stringify(cfg),"配置文件.json");
		},
		readCfg: function(e){
			var self = this;
			var fileData = e.target.files[0];
			var reader = new FileReader();//新建一个FileReader
			reader.readAsText(fileData, "UTF-8");//读取文件 
			reader.onload = function(evt){ //读取完文件之后会回来这里
				try{
					var cfg = JSON.parse(evt.target.result);
					self.quizList = cfg.quizList;
				}catch(e){
					alert("配置文件错误");
				}
			}
		}
	},
	created:function(){
		var self = this;
		document.onkeydown = function(event){
			switch(event.key){
				// 唤起控制台
				case "`":
					self.controlDisplay = !self.controlDisplay;
					break;
				// 唤起问题列表
				case "Shift":
					self.quizDisplay = false;
					break;
				default:
			}
			// 题目相关控制
			if (self.controlDisplay) {
				return;
			}
			if (event.keyCode > 48 && event.keyCode < 58) {
				self.quizIdx = event.keyCode - 49;
				if (!self.quizList[ self.quizIdx ]) {
					return;
				}
				self.quizDisplay = true;
				self.quizList[ self.quizIdx ]['done'] = true;
			}else if(event.keyCode > 64 && event.keyCode < 91){
				self.quizIdx = event.keyCode - 56;
				if (!self.quizList[ self.quizIdx ]) {
					return;
				}
				self.quizDisplay = true;
				self.quizList[ self.quizIdx ]['done'] = true;
			}
		}
		// 屏幕适配
		var width = window.screen.width;
        var height = window.screen.height;
        this.scWidth = width/this.width;
        this.scHeight = height/this.height;
	}
});