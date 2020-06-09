;
(function($) {
  "use strict";
  // 默认配置
  const defaults = {
    curr: 1, // 当前页码
    limit: 10, // 每页记录数
    total: 0, // 总记录数
    pageTotal: 1, // 总页数
    show: 3, // 展示页码数
    clickFun: null, // 点击回调事件，仅首页、末页、数字页码有回调
    min: 1, // 当前最小页码
    max: 3, // 当前最大页码
    autoRefresh: false, // 自动刷新，触发切换页面时是否自动刷新
  };

  function Pagination(element, option) {
    this.options = $.extend(true, defaults, option);
    this.element = element;
  }

  Pagination.prototype = {
    init: function() {
      const self = this;
      const element = self.element;
      const opt = self.options;

      self.refresh();

      // 跳转首页
      element.on('click', '.page-start:not(.disabled)', function() {
        gotoStartPage();
      });
      // 跳转末页
      element.on('click', '.page-end:not(.disabled)', function() {
        gotoEndPage();
      });
      // 跳转指定页
      element.on('click', '.page-number:not(.disabled)', function() {
        const target = Number($(this).attr('data-page'));
        gotoTargetPage(target);
      });
      // 向左切换分页
      element.on('click', '.page-left:not(.disabled)', function() {
        moveLeft();
      });
      // 向右切换分页
      element.on('click', '.page-right:not(.disabled)', function() {
        moveRight();
      });
      // 跳转首页
      function gotoStartPage() {
        if (opt.curr === 1) {
          return
        }
        opt.curr = 1;
        if ($.isFunction(opt.clickFun)) {
          opt.clickFun(opt.curr, opt.limit);
        }
        if (opt.autoRefresh) {
          self.refresh();
        }
      }

      // 跳转末页
      function gotoEndPage() {
        if (opt.curr === opt.pageTotal) {
          return
        }
        opt.curr = opt.pageTotal;
        if ($.isFunction(opt.clickFun)) {
          opt.clickFun(opt.curr, opt.limit);
        }
        if (opt.autoRefresh) {
          self.refresh();
        }
      }

      // 跳转指定页
      function gotoTargetPage(target) {
        if (target === opt.curr) {
          return
        }
        opt.curr = target;
        if ($.isFunction(opt.clickFun)) {
          opt.clickFun(opt.curr, opt.limit);
        }
        if (opt.autoRefresh) {
          self.refresh();
        }
      }

      // 左移
      function moveLeft() {
        if (opt.min <= opt.show) {
          return
        }
        opt.max = opt.min - 1;
        opt.min = opt.min - opt.show;
        self.render();
      }

      // 右移
      function moveRight() {
        if (opt.min + opt.show > opt.pageTotal) {
          return
        }
        opt.min = opt.min + opt.show;
        opt.max = Math.min(opt.min + opt.show - 1, opt.pageTotal);
        self.render();
      }
    },
    update: function(options, refresh) {
      const self = this;
      // 合并配置
      $.extend(true, self.options, options);
      if (refresh) {
        self.refresh();
      }
    },
    refresh: function() {
      const self = this;
      self.minmax();
      self.render();
    },
    minmax: function() {
      const self = this;
      const opt = self.options;
      // 计算当前最小最大页码
      opt.pageTotal = Math.ceil(opt.total / opt.limit);
      if (opt.pageTotal <= 0) {
        opt.curr = 1;
        opt.pageTotal = 1;
        opt.min = 1;
        opt.max = 1;
        return
      }
      if (opt.curr > opt.pageTotal) {
        opt.min = 1;
        opt.max = Math.min(opt.show, opt.pageTotal);
        return
      }
      const r = opt.curr % opt.show;
      opt.min = r === 0 ? opt.curr - (opt.show - 1) : opt.curr - (r - 1);
      opt.max = Math.min(opt.min + opt.show - 1, opt.pageTotal);
    },
    render: function() {
      const self = this;
      const element = self.element;
      const opt = self.options;
      let html = [];
      html.push('<ul>');
      if (opt.curr === 1) {
        html.push('<li class="page-start disabled"><a href="javascript:void(0);">首页</a></li>');
      } else {
        html.push('<li class="page-start"><a href="javascript:void(0);">首页</a></li>');
      }
      if (opt.min === 1) {
        html.push('<li class="page-left disabled"><a href="javascript:void(0);">&lt;</a></li>');
      } else {
        html.push('<li class="page-left"><a href="javascript:void(0);">&lt;</a></li>');
      }
      for (let i = opt.min; i <= opt.max; i++) {
        if (i === opt.curr) {
          html.push('<li class="page-number on disabled" data-page="' + i + '"><a href="javascript:void(0);">' +
            i + '</a></li>');
        } else {
          html.push('<li class="page-number" data-page="' + i + '"><a href="javascript:void(0);">' + i +
            '</a></li>');
        }
      }
      if (opt.max === opt.pageTotal) {
        html.push('<li class="page-right disabled"><a href="javascript:void(0);">&gt;</a></li>');
      } else {
        html.push('<li class="page-right"><a href="javascript:void(0);">&gt;</a></li>');
      }
      if (opt.curr === opt.pageTotal) {
        html.push('<li class="page-end disabled"><a href="javascript:void(0);">末页</a></li>');
      } else {
        html.push('<li class="page-end"><a href="javascript:void(0);">末页</a></li>');
      }
      html.push('</ul>');
      element.html(html.join(''));
    }
  };

  $.fn.pagination = function(option) {
    const args = arguments;
    return this.each(function() {
      const self = $(this);
      let data = self.data('pagination');
      if (!data) {
        data = new Pagination(self, option);
        data.init();
        self.data('pagination', data)
      }
      if (typeof option === 'string') {
        data[option].apply(data, Array.prototype.slice.call(args, 1));
      }
    })
  };
})($);
