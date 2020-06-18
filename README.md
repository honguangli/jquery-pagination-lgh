# jquery-pagination-lgh
jquery-pagination-lgh is a pagination component depend on jquery

## Basic Usages
```
<link rel="stylesheet" href="css/jquery-pagination-lgh.css" />
<div class="pagination-box"></div>
<script type="text/javascript" src="js/jquery.min.js"></script>
<script type="text/javascript" src="js/jquery-pagination-lgh.js"></script>
<script type="text/javascript">
  // step-1
  const $paginationBox = $('.pagination-box');
  // step-2
  let opt = {
    page: 1,
    limit: 9,
    total: 999,
    pageShow: 10,
    clickFun: function (page, limit, total, pageTotal, pageShow) {
      testFun(page, limit, total, pageTotal, pageShow);
    }
  };
  // step-3
  $paginationBox.pagination(opt);
</script>
```

and you can use some methods

```
$paginationBox.pagination('update', opt); // update the opt and auto refresh
$paginationBox.pagination('refresh'); // refresh
```

## License
MIT License

## Contact
1947501227@qq.com
