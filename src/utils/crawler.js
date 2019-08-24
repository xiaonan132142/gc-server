var Crawler = require('crawler');
const ClassificationModel = require('../models').Classification;


var c = new Crawler({
  // 在每个请求处理完毕后将调用此回调函数
  callback: function(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      // $ 默认为 Cheerio 解析器
      // 它是核心jQuery的精简实现，可以按照jQuery选择器语法快速提取DOM元素
      //console.log($("body .list ul li a:last-child").text());

      $('body .list ul li').each(async (i, data) => {
        let userId = '-QM7XbtaD';
        let title = $(data).children('a:last-of-type').text();
        let sort = $(data).children('a:first-of-type').text();
        let desc = title;
        let image = '';
        let published = true;
        let available = true;
        let free = true;
        let price = 0;

        try {
          const classificationObj = {
            userId,
            title,
            desc,
            image,
            sort,
            free,
            price,
            published,
            available,
          };
          const newClassification = new ClassificationModel(classificationObj);
          await newClassification.save();

          console.log(title + ' 添加成功');
        } catch (e) {
          console.log(e);
        }
      });

    }
    done();
  },
});

// 将一个URL加入请求队列，并使用默认回调函数
let urlArr = [];
for (let i = 2; i < 36; i++) {
  let url = 'https://www.ggziyuan.com/kehuishoulaji_' + i + '.html';
  console.log(url)
  urlArr.push(url);
}
//c.queue('https://www.ggziyuan.com/kehuishoulaji.html');

// 将多个URL加入请求队列
c.queue(urlArr);
