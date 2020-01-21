/**
 参考网站: 
    https://blog.csdn.net/qpzkobe/article/details/80056807
    https://www.iteye.com/blog/dsqiu-1705530
    https://www.jianshu.com/p/c2841d65df4c
 跳跃表是单向单链表的进化 是一种随机化的数据结构 
 能提高单链表查找的效率
 普通单链表的查找时间复杂度为 O(n) 
 跳跃表的查找平均时间复杂度为 O(logn)
 O(logn) < O(n)
 注意: 跳跃表是基于有序的(不是下标有序，是值有序) 并且索引不能重复
 **/

interface DataNode{
    nexts: DataNode[]; // 指向下一个节点的数组 索引代表层级
    index: number; // 所在表位置下标
    key: number; // 索引下标
    data: any;
}

// 跳跃表
export class SkipList{
    head: DataNode = undefined; // 头节点
    level = 0; // 当前层级
    private _length = 0; // 当前长度

    // init_level: 初始化层级
    // init_len: 初始化长度
    constructor(init_level = 4){
        this.level = init_level;
        this.head = this.newNode(undefined, -1, init_level, -1);
    }

    // 插入
    // key: 索引
    // data: 数据
    insert(key: number, data?): boolean{
        let [ret, updates] = this.getNode(key, true);
        // 已经有该索引的节点
        if (ret){
            return false;
        }
        // 随机层次
        let new_level = this.randomLevel();
        // 创建新节点
        let new_node = this.newNode(key, data, new_level, (updates[0] || this.head).index + 1);
        // 更新已有的层级
        for (let i = updates.length - 1; i >= 0; --i){
            if (i < new_level){
                let n = updates[i];
                new_node.nexts[i] = n.nexts[i];
                n.nexts[i] = new_node;
            }
        }
        // 有更高层级
        if (new_level > this.level){
            let sub = new_level - this.level;
            for (let i = 0; i < sub; ++i){
                this.head.nexts[this.level + i] = new_node;
                new_node.nexts[this.level + i] = undefined;
            }
            this.level = new_level;
        }
        ++this._length;
        return true;
    }

    // 删除
    erase(key: number): boolean{
        if (this._length <= 0){
            return;
        }
        let [node, updates] = this.getNode(key, true);
        // 没有该索引的节点
        if (!node){
            return false;
        }

        // 检查是否需要降层
        let level = node.nexts.length;
        if (this.level == level){
            let index = level - 1;
            for (let i = index; i >= 0; --i){
                let p = this.head.nexts[i];
                if (!p.nexts[i]){
                    this.head.nexts[i] = undefined;
                    --this.level;
                }
            }
        }

        for (let i = node.nexts.length - 1; i >= 0; --i){
            updates[i].nexts[i] = node.nexts[i];
        }
        --this._length;
        // 没有任何节点
        if (this._length <= 0){
            this.head.nexts = [];
            this.head.index = -1;
            this.level = 0;
        }
        return true;
    }

    getData(key: number){
        let node = this.getNode(key);
        if (node){
            return node.data;
        }
        return undefined;
    }

    // 表长度
    get length(){
        return this._length;
    }

    // 获取节点
    // key: 索引
    // save_pre: 
    //      是否保存要查找节点的前一个节点 
    //      如果没有查找到节点 也保存前一个小的节点
    //      目的解决在遍历获取节点的同时 顺便获取到前一个节点
    // 找不到返回undefined
    private getNode(key: number, save_pre = false){
        let p = this.head;
        let pre_p = [];
        let ret = undefined;
        // 竖向(层)
        for (let i = this.level - 1; i >= 0; --i){
            // 横向(链表)
            while (true){
                if (!p.nexts[i] || p.nexts[i].key > key){
                    save_pre && (pre_p[i] = p);
                    break;
                }
                else if (p.nexts[i].key == key){
                    if (!ret){
                        ret = p.nexts[i];
                    }

                    if (save_pre){
                        pre_p[i] = p;
                        break;
                    }
                    else{
                        return ret;
                    }
                }
                else if (p.nexts[i].key < key){
                    p = p.nexts[i];
                }
            }
        }
        return [ret, pre_p];
    }

    // 随机获取层级
    // 算法需要重写
    protected randomLevel(): number{
        let num = 1;
        // 允许多一层
        while(Math.random() < 0.8 && num <= this.level){
            num++;
        }
        return num;
    }

    // 创建新节点
    // key: 索引
    // data: 节点数据
    // level: 节点需要层级
    // index: 所在表位置下标
    protected newNode(key: number, data, level: number, index: number): DataNode{
        // 初始化每一层级
        let nexts = [];
        for (let i = 0; i < level; ++i){
            nexts[i] = undefined;
        }
        
        return {
            nexts: nexts,
            data: data,
            key: key,
            index: index,
        }
    }
}

