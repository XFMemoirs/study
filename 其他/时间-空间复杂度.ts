/**
 * 一个算法的优劣可以从 时间复杂度和空间复杂度综合考虑
    很多时候 时间和空间 是鱼和熊掌的关系

    【时间复杂度】
    指一个算法所消耗的时间
    比较详细的学习网站: 
        https://mp.weixin.qq.com/s/070nYGokM96aorZn6MZTDA
        https://blog.csdn.net/jsjwk/article/details/84315770
        https://www.jianshu.com/p/1ac6ad4069f8
    计算方法:
    1: 实际运行
        弊端:
            受运行环境影响 例如性能好和性能差的硬件环境
            必须要写完之后才能测试
    2: 大O(ou)表示法
        公式: T(n) = O(f(n))
        全称: 算法渐进时间复杂度
        实际意义: 
            该表示法并不是用于代表真实精确的算法时间
            而是代表算法执行时间的增长趋势
        f(n): 代表每行代码执行次数 这是一个简化后的式子
        例子:
            for(let i = 0; i < n; ++i){
                cc.log("i:", i);
            }
            假设把每行代码执行时间统一，单位为：时间单元(标记为c)
            代码分析:
                let i = 0: 1 * c
                i < n: (n + 1) * c
                ++i: n * c
                cc.log: n * c
                时间合计: 
                    1 * c + n * c + n * c + n * c
                    (1 + n + 1 + n + n) * c
                    (3n + 2) * c
                    也就是需要花费 3n + 2 个时间单元
                简化(省略系数, 低阶, 常量):
                    当n趋于无穷大时，其实 +2 相对对于整个时间消耗来说可以忽略不计 例如 n = 10000时候  10000和10002
                    再继续，当n = 10000 10000和30000其实属于同一量级的了 也可以忽略
                    最后简化成 n
                    这就是忽略低阶项 保留高阶
                    至于怎么判断一个式子里面哪些是可以被忽略的低阶 可以暂时不用管
                    但是需要记住常见的时间复杂度量级大小关系:
                    常数阶: O(1)
                    对数阶: O(logN)
                    线性阶：O(n)
                    线性对数：O(nlogN)
                    平方阶: O(n²)
                    立方阶: O(n³)
                    K次方阶: O(n^k)
                    指数阶: (2^n)
                    从上往下 时间复杂度依次变大 效率也就越低
    细化分支:
            最好时间复杂度 最坏时间复杂度 平均时间复杂度 均(平)摊时间复杂度
            参考网站: https://www.cnblogs.com/jonins/p/9956752.html
            最好和最坏是指在同一算法 不同条件产生时间
            例如:
                public int Function(int n, int x)
                {
                    int sum = 0;
                    for (int i = 1; i <= n; ++i)
                    {
                        if (i == x)
                            break;
                            sum += i;
                    }
                    return sum;
                }
                最坏情况: 当x大于n的时候 需要把整个循环走完
                最好情况: n == 1 或者 x == 1
                平均情况: 需要引入概率论，暂时不深入
                        多数情况下，我们不需要区分最好、最坏、平均情况时间复杂度
                        只有同一块代码在不同情况下时间复杂度存在量级差距，我们才会区分3种情况，为的是更有效的描述代码的时间复杂度
            均摊时间复杂度:
                是一个稍微高级的概念
                应用场景也相对特殊 个人认为搞清楚原理即可
                大致思路: 每一次O(n)都会跟着n次O(1)

    【空间复杂度】
        空间是指程序执行需要的临时内存空间
        分为2类:
            固定(静态)部分
            动态部分 例如动态开堆 递归之类的
            通常来说 指要不设计到动态分配内存空间的 空间复杂度通常为 O(1)
        
        
 **/