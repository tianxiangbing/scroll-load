/*
 * Created with Sublime Text 2.
 * User: 田想兵
 * Date: 2015-03-26
 * Time: 14:26:28
 * Contact: 55342775@qq.com
 */
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
})(jQuery);