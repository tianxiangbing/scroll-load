# scroll-load
滚动到底部时加载更多内容
例子见[DEMO](http://www.lovewebgames.com/jsmodule/scroll-load.html)  
#用法
	<div id="content">
	</div>
	<script id="entry-template" type="text/x-handlebars-template">
		{{#each data}}
		<div><img src="{{url}}"/></div>
		<div>{{title}}</div>
		{{/each}}
	</script>
	<script src="../dist/jquery-1.9.1.min.js"></script>
	<script src="../dist/handlebars-v3.0.0.js"></script>
	<script src="../dist/scroll-load-jquery.js"></script>
	<script>
		$('#content').ScrollLoad({tpl:"#entry-template",url:"data.json",autoLoad:true});
	</script>
#参数及回调
##url
	请求加载的url
##pagename
	分页参数名page
##param
	object,其他的参数
##autoLoad  :bool
	是否自动加滚动加载,默认false;
##format: function
	格式化的回调方法，如果没传，就会以tpl参数进行handlebars的方式格式化 。
##tpl:
	handlebars的模板节点(string or object),要单独引用handlebars
##max:
	最大页数,默认最大20页