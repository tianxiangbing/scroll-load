/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-03-26
 * Time: 14:39:30
 * Contact: 55342775@qq.com
 */
;
(function(root, factory) {
	if (typeof define === 'function' && define.cmd) {
		define(function(require, exports, module) {
			var $ = require("jquery");
			return factory($);
		});
	} else
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'handlebars'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.ScrollLoad = factory(window.Zepto || window.jQuery || $, window.Handlebars || null);
	}
})(this, function($, Handlebars) {
	if (Handlebars) {
		Handlebars.registerHelper('isnodata', function(data, options) {
			if (!data || data.length == 0) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		});
	}
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
	};
	var ScrollLoad = function() {
		this.container;
		this.url;
		this.param;
		this.page = 1;
		this.pagename = 'page'
		this.loadmore;
	};
	ScrollLoad.prototype = {
		init: function(settings) {
			this.settings = $.extend({
				scrollLoad: true,
				max: 20
			}, settings);
			this.load = this.settings.loadmore || $('<div class="ui-loading"><span>下拉查看更多</span><hr/></div>');
			this.scrolltrigger = $(this.settings.scrolltrigger || window);
			this.container = this.settings.container;
			if (this.container.children().size() == 0) {
				this.container.append('<div class="scroll-content"/>');
			}
			this.container.append(this.load);
			this.url = this.settings.url;
			this.settings.page === undefined ? this.page = 1 : this.page = this.settings.page;
			this.pagename = settings.pagename || 'page';
			this.param = $.extend({}, this.settings.param);
			this.param[this.pagename] = this.page;
			this.bindEvent();
			if (this.settings.scrollLoad) {
				this.checkPosition();
			} else {
				var _this = this;
				setTimeout(function() {
					_this.checkPosition();
				}, 3000);
			}
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
				} else {
					if (_this.scrolltrigger.scroll) {
						_this.scrolltrigger.scroll(function() {
							_this.checkPosition();
						});
					};
				}
				_this.touch(_this.load, function() {
					_this.ajaxData();
				});
			}
		},
		checkPosition: function() {
			if (this.page >= this.settings.max) {
				this.settings.maxCallback && this.settings.maxCallback.call(this);
				return false;
			}
			var offsetH = $(this.container).height();
			var offsetTop = $(this.container).offset().top;
			var height = this.load.height();
			var clientHeight = this.scrolltrigger[0].clientHeight || document.documentElement.clientHeight || document.body.clientHeight; //可视区域
			var clientWidth = this.scrolltrigger[0].clientWidth || document.documentElement.clientWidth || document.body.clientWidth;
			var scrollTop = this.scrolltrigger.scrollTop();
			if (offsetTop + offsetH <= clientHeight + scrollTop) {
				this.ajaxData();
			}
		},
		ajaxData: function() {
			var _this = this;
			if (_this.ajax||_this.end) {
				return false;
			}
			_this.ajax = true;
			this.load.find('span').html('加载中...');
			this.param[this.pagename] = this.page;
			$.ajax({
				url: _this.url,
				type: _this.settings.type || "get",
				dataType: "json",
				cache: _this.settings.cache || false,
				data: _this.param,
				timeout: 30000,
				success: function(result) {
					if (_this.settings.format) {
						_this.settings.format.call(_this,_this.container, result, _this.page);
					} else {
						_this.format(result);
					};
					_this.page++;
					_this.ajax = false;
					_this.checkPosition();
				},
				complete: function(result) {
					_this.load.find('span').html('下拉查看更多');
					if (_this.page >= _this.settings.max) {
						_this.load.hide();
					}
				}
			}).done(function(result){
				if(result.data&&result.data.length==0){
					_this.end =true;
				}
			})
		},
		format: function(result) {
			if ((!result.data || 　result.data.length == 0) && this.page == 1) {
				result.isnodata = true;
			}
			if (!(result.data && result.data.length)) {
				result.nodata = true;
				this.load.remove();
			}
			if(Handlebars){
				var tpl = typeof this.settings.tpl === "string" ? $(this.settings.tpl) : this.settings.tpl;
				var source = tpl.html();
				var template = Handlebars.compile(source);
				var html = template(result);
				this.container.children().first().append(html);
			}
			this.settings.callback && this.settings.callback.call(this,this.container, result);
		},
		dispose: function() {
			var _this = this;
			_this.load.off('click').off('touchend');
			_this.load.remove();
			_this.scrolltrigger.off('scroll');
			$(_this.scrolltrigger).off('swipeUp')
		}
	};
	return ScrollLoad;
});