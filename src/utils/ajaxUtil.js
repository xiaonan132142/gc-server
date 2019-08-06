import Axios from 'axios';
import Qs from "qs";

let headerDefault = {'Content-Type':'application/x-www-form-urlencoded'};

// 定义一个普通方法
async function get(url, params, headers) {
  headers = Object.assign({}, headerDefault, headers);
  //主要内容在这里 在方法中返回一个Promise
  // 使用Promise的resolve返回需要异步获取的对象即可
  return new Promise((resolve, reject) => {
    Axios({
      method: 'get',
      url,
      params,
      headers,
    }).then(response => {
      // 成功返回
      resolve({ data: response.data });
    }).catch(error => {
      // 失败返回
      resolve({ data: error });
    });
  });
};

async function post(url, data, headers) {
  headers = Object.assign({}, headerDefault, headers);
  data = Qs.stringify(data);
  //主要内容在这里 在方法中返回一个Promise
  // 使用Promise的resolve返回需要异步获取的对象即可
  return new Promise((resolve, reject) => {
    Axios({
      method: 'post',
      url,
      data,
      headers
    }).then(response => {
      // 成功返回
      resolve({ data: response.data });
    }).catch(error => {
      // 失败返回
      resolve({ data: error });
    });
  });
}

module.exports = {
  get,
  post,
};
