/*! scroll-load - v1.0.0 - tianxiangbing - http://www.lovewebgames.com/jsmodule/scroll-load.html 2015-04-03 */
;
(function($) {
	window.ScrollLoad = function() {
		this.container;
		this.url;
		this.param;
		this.page = 1;
		this.pagename = 'page'
		this.loadmore;
	};
	ScrollLoad.prototype = {
		init: function(settings) {
			this.settings = $.extend({}, settings);
			this.load = this.settings.loadmore || $('<div class="ui-loading">点击加载更多</div>');
			this.scrolltrigger = $(this.settings.scrolltrigger || window);
			this.container = this.settings.container;
			if (this.container.children().size() == 0) {
				this.container.append('<div class="scroll-content"/>');
			}
			this.container.append(this.load);
			this.url = this.settings.url;
			this.page = this.settings.page || 1;
			this.pagename = settings.pagename || 'page';
			this.param = $.extend({}, this.settings.param);
			this.param[this.pagename] = this.page;
			this.bindEvent();
			this.checkPosition();
		},
		touch: function(obj, fn) {
			var move;
			$(obj).on('click', fn);
			$(obj).on('touchmove', function(e) {
				move = true;
			}).on('touchend', function(e) {
				e.preventDefault();
				if (!move) {
					var returnvalue = fn.call(this, e, 'touch');
					if (!returnvalue) {
						e.preventDefault();
						e.stopPropagation();
					}
				}
				move = false;
			});
		},
		bindEvent: function() {
			if (this.container.size()) {
				var _this = this;
				if (_this.settings.scrollLoad) {
					_this.scrolltrigger.scroll(function() {
						_this.checkPosition();
					});
				}
				_this.touch(_this.load, function() {
					_this.ajaxData();
				});
			}
		},
		checkPosition: function() {
			var offsetH = $(this.container).children().first().height();
			var height = this.load.height();
			var clientHeight = this.scrolltrigger[0].clientHeight || document.documentElement.clientHeight || document.body.clientHeight; //可视区域
			var clientWidth = this.scrolltrigger[0].clientWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var scrollTop = this.scrolltrigger.scrollTop();
			if (offsetH + height / 2 <= clientHeight + scrollTop) {
				this.ajaxData();
			}
		},
		ajaxData: function() {
			var _this = this;
			if (_this.ajax) {
				return false;
			}
			_this.ajax = true;
			this.load.html('正在加载中...');
			this.param[this.pagename] = this.page;
			$.ajax({
				url: _this.url,
				type: _this.settings.type || "get",
				dataType: "json",
				cache: false,
				data: _this.param,
				timeout: 30000,
				success: function(result) {
					if (_this.settings.format) {
						_this.settings.format(this.container, result);
					} else {
						_this.format(result);
					};
					_this.page++;
				},
				complete: function() {
					setTimeout(function() {
						_this.ajax = false;
					}, 500);
					_this.load.html('点击加载更多');
				}
			});
		},
		format: function(result) {
			if (!(result.data && result.data.length)) {
				result.nodata = true;
				this.load.remove();
			};
			var tpl = typeof this.settings.tpl === "string" ? $(this.settings.tpl) : this.settings.tpl;
			var source = tpl.html();
			var template = Handlebars.compile(source);
			var html = template(result);
			this.container.children().first().append(html)
			this.settings.callback && this.settings.callback(this.container, result);
		}
	};
})(window.Zepto || window.jQuery);
;(function($) {
	$.fn.ScrollLoad = function(settings) {
		var list = [];
		$(this).each(function() {
			var scroll = new ScrollLoad();
			var options = $.extend({
				container: $(this)
			}, settings);
			scroll.init(options);
			list.push(scroll);
		});
		return list;
	}
})(window.Zepto || window.jQuery);