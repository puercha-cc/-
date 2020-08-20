//1. 面向对象,封装class类 
//    面向过程，class类中的定义、获取数据/标签对象写在html文件中
class SetLoop{
    // 1-1定义数据参数
      // 参数ele是父级标签div    
    constructor(ele){
         // 存储参数,也就是div标签对象     
        this.ele = ele;
         // 获取设定需要的数据参数

        //1-2 获取的标签对象       此处用ele.querySelector  在ele里边获取标签对象  document不行
        this.oUl = ele.querySelector('.banner-a');
        this.oOl = ele.querySelector('.banner-b');
        this.oD = ele.querySelector('.banner-c');
        this.oUllis = ele.querySelectorAll('.banner-a li');

        // 1-3 定义参数index  存储轮播图执行次数的变量
        this.index = 1;
        //1-4 存储自动轮播定时器变量
        this.loopTime = 0;
        //1-5 li的默认宽度
        this.oLiwidth = parseInt(window.getComputedStyle(this.oUllis[0]).width );
        // 1-6 定义开关变量,防止点击过快
        this.bool = '原始数值';
    }

    init(){
        this.setLi();    
        this.copyLi();
        this.autoLoop();
        this.overOut();
        this.focus();
        this.leftRight();
        this.hidden();
    }

//    以下的方法函数都不加function，写在class类内部

    // 2.定义方法1,运动函数 在其他的方法中调用
    move(ele, obj, callback) {
        // 2-2循环
        for (let type in obj) {
            // 获取原始定位数据
            let oldVal = parseInt(window.getComputedStyle(ele)[type]);
            // 定义定时器
            let time = setInterval(function () {
                // 计算步长
                let val = (obj[type] - oldVal) / 5;
                // 判断正负,取整
                val = val > 0 ? Math.ceil(val) : Math.floor(val);
                // 执行步长
                oldVal += val;
                // 执行定位
                ele.style[type] = oldVal + 'px';
                // 到达目标位置,终止定时器
                if (oldVal == obj[type]) {
                    // 终止定时器
                    clearInterval(time);
                    // 调用函数
                    callback()
                }
            }, 60)
        }
    }

    // 3.定义方法2,设定焦点
    setLi() {
        // 定义变量,存储生成的li标签
        let str = '';
        // 根据原始轮播图,生成焦点按钮
        this.oUllis.forEach(function (item, key) {
            if (key == 0) {
                str += `<li index="${key + 1}" class="active"></li>`;
            } else {
                str += `<li index="${key + 1}" ></li>`;
            }
        });
        // 写入标签
        this.oOl.innerHTML = str;
    }

    // 4.定义方法3, 复制标签
    copyLi() {
        // 1)获取需要复制的标签对象
        let liF = this.oUllis[0];
        let liL = this.oUllis[this.oUllis.length - 1];
        // 2)复制标签
        let first = liF.cloneNode(true);
        let last = liL.cloneNode(true);
        // 3)写入标签
        this.oUl.appendChild(first);
        this.oUl.insertBefore(last,liF);
        // 4)定义ul宽度
        this.oUl.style.width = ((this.oUllis.length + 2) * this.oLiwidth) + 'px';
        // 5)定义ul位移
        this.oUl.style.left = -this.oLiwidth + 'px';
    }

    // 5.定义方法4,自动轮播
    // 此时,所有的this,指向的都是构造函数中的参数所表示的this
    // 也就是实例化对象,都要改成箭头函数
    autoLoop() {
        // 改成箭头函数
        this.loopTime = setInterval( ()=> {
            // 记录轮播次数变量++
            this.index++;

            // 执行运动函数,改成箭头函数
            this.move(this.oUl, { left: -this.index * this.oLiwidth },  ()=>{
                // 虽然写在class中的方法,可以省略function关键词
                // 但是定义的还是一个函数,class语法,会自动添加 function关键词
                // 有了 function关键词 就可以提前调用函数方法
                // 调用时,通过 this.函数方法名称() 来调用
                this.stopLoop();
            })
        }, 3000);
    }

    // 6.定义方法5 , 运动终止时,执行的函数
    stopLoop() {
        // 1)给开关变量,赋值初始值
        this.bool = '原始数值'; 
        // 2)判断idnex数值,并且给ul做定位
        // 如果是最后一个img1
        if (this.index == this.oUllis.length + 1) {
            // 改变index数值
            this.index = 1;
            // 瞬间切换图片
            this.oUl.style.left = (-this.index * this.oLiwidth) + 'px';
        // 如果是第一个img5
        } else if (this.index == 0) {
            // 改变index数值
            this.index = this.oUllis.length;
            // 瞬间切换图片
            this.oUl.style.left = (-this.index * this.oLiwidth) + 'px';
        }
        // 3)设定焦点按钮样式,后动
        // 获取ol中的li,在生成焦点之后生成
        // 在 this.ele 也就是 oDiv中 获取 ol中的li
        let oOllis = this.ele.querySelectorAll('ol li');
        // 循环遍历
        // 使用 this.index 必须改成箭头函数
        oOllis.forEach( (item) => {
            // 清除所有的样式
            item.className = '';
            // 给点击的li,添加样式
            if (item.getAttribute('index') == this.index) {
                item.className = 'active';
            }
        })
    }

    // 7.定义方法6 , 鼠标移入移出
    overOut () {
        // 给父级div添加事件 oDiv改成 this.ele
        // 移入清除定时器,终止函数
        this.ele.addEventListener('mouseover',  () =>{
            clearInterval(this.loopTime)
        });
        // 移出,再次执行函数
        this.ele.addEventListener('mouseout',  () =>{
            this.autoLoop();
        });
    }

    // 8.定义方法7,焦点按钮切换
    focus(){
        // 给ol添加事件
        this.oOl.addEventListener('click' , (e)=>{
            // 如果点击的是li标签
            if(e.target.tagName == 'LI'){
                // 防止点击过快
                if(this.bool !== '原始数值'){
                    return;
                }
                this.bool = '非原始数值';
                // 获取点击标签,index的属性,赋值给变量
                this.index = e.target.getAttribute('index')-0;
                // 一定要用move()运动函数,这样才可以再次点击
                this.move(this.oUl, { left: -this.index * this.oLiwidth },  ()=> {
                    this.stopLoop();
                })
            }
        })
    }

    // 9.定义方法8 , 左右切换  
    leftRight() {
        this.oD.addEventListener('click',  (e)=> {
            // 如果点击的是左切换
            if (e.target.getAttribute('name') == 'left') {
                // 防止过快
                if(this.bool !== '原始数值'){
                    return;
                }
                this.bool = '非原始数值';
                // index数值--
                this.index--;
                // 一定要用move()运动函数,这样才可以再次点击
                this.move(this.oUl, { left: -this.index * this.oLiwidth },  ()=> {
                    this.stopLoop();
                })
            }else if(e.target.getAttribute('name') == 'right'){
                // 防止过快
                if(this.bool !== '原始数值'){
                    return;
                }
                this.bool = '非原始数值';
                // index数值++
                this.index++;
                // 一定要用move()运动函数,这样才可以再次点击
                this.move(this.oUl, { left: -this.index * this.oLiwidth },  ()=> {
                    this.stopLoop();
                })
            }
        })
    }

    // 10.定义方法9 , 页面隐藏
    hidden(){
        // 当 页面显示变化时
        // 此处是特殊的页面显示状态事件,必须是document,不能改的
        document.addEventListener('visibilitychange' , ()=>{
            // 如果隐藏,清除定时器,不执行自动轮播
            if(document.visibilityState === 'hidden'){
                clearInterval(this.loopTime);
            // 如果显示,继续执行自动轮播
            }else if(document.visibilityState === 'visible'){
                this.autoLoop();
            }
        })
    }
}
